// =============================================
// FILE: src/lib/voice/speech.ts
// TTS (voz latina joven) + STT con estados: idle | pre | active | retrying
// Evaluación flexible: fonética simple, WER, cohesión, puerta de avance blanda
// Todo el feedback en palabras, sin símbolos.
// =============================================
"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

const DEFAULT_VOICE_NAME = "";

type VoicePrefs = {
  rate?: number;
  pitch?: number;
  lang?: string;
  preferFemale?: boolean;
  voiceName?: string;
};

// ---------- utilidades texto ----------
export function normalizeText(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-záéíóúüñ0-9\s']/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeWords(t: string) {
  const n = normalizeText(t);
  return n ? n.split(" ").filter(Boolean) : [];
}

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function lcsLength(a: string[], b: string[]) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function bigrams(tokens: string[]) {
  const res: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) res.push(tokens[i] + " " + tokens[i + 1]);
  return res;
}

function similarityChars(a: string, b: string) {
  const A = normalizeText(a);
  const B = normalizeText(b);
  if (!A && !B) return 1;
  const d = levenshtein(A, B);
  return 1 - d / Math.max(A.length, B.length, 1);
}

// ---------- fonética simple para tolerancia ----------
function toPhoneticSimple(w: string) {
  // normalización: vocales a una clase, th→d, s/z→s, v/b→b, r/l cercanas, t/d cercanas
  let s = normalizeText(w);
  s = s.replace(/th/g, "d");
  s = s.replace(/ph/g, "f");
  s = s.replace(/[zs]/g, "s");
  s = s.replace(/[vb]/g, "b");
  s = s.replace(/[td]/g, "t");
  s = s.replace(/[rl]/g, "r");
  s = s.replace(/[ckq]/g, "k");
  s = s.replace(/g/g, "k"); // g suave como k para coincidencias duras
  s = s.replace(/[aeiou]/g, "a");
  s = s.replace(/aa+/g, "a");
  return s;
}

function phoneticClose(a: string, b: string) {
  const A = toPhoneticSimple(a);
  const B = toPhoneticSimple(b);
  if (!A && !B) return true;
  const d = levenshtein(A, B);
  const ratio = 1 - d / Math.max(A.length, B.length, 1);
  return ratio >= 0.75; // bastante permisivo para confusiones típicas del STT
}

// ---------- evaluación flexible con feedback textual ----------
type Op = { type: "match" | "sub" | "ins" | "del"; target?: string; said?: string; i: number; j: number };

function wordAlignment(targetWords: string[], saidWords: string[]) {
  const m = targetWords.length, n = saidWords.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const path: ("none" | "del" | "ins" | "sub" | "match")[][] =
    Array.from({ length: m + 1 }, () => new Array(n + 1).fill("none"));

  const costDel = 1, costIns = 1;
  const subCost = (a: string, b: string) => (a === b ? 0 : (phoneticClose(a, b) ? 0.25 : 1));

  for (let i = 0; i <= m; i++) dp[i][0] = i * costDel, path[i][0] = i ? "del" : "none";
  for (let j = 0; j <= n; j++) dp[0][j] = j * costIns, path[0][j] = j ? "ins" : "none";

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const a = targetWords[i - 1], b = saidWords[j - 1];
      const sCost = subCost(a, b);
      const candidates = [
        { v: dp[i - 1][j] + costDel, p: "del" as const },
        { v: dp[i][j - 1] + costIns, p: "ins" as const },
        { v: dp[i - 1][j - 1] + sCost, p: sCost === 0 ? "match" as const : "sub" as const },
      ];
      const best = candidates.reduce((acc, cur) => cur.v < acc.v ? cur : acc, candidates[0]);
      dp[i][j] = best.v; path[i][j] = best.p;
    }
  }

  const ops: Op[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    const p = path[i][j];
    if (p === "match" || p === "sub") { ops.push({ type: p, target: targetWords[i - 1], said: saidWords[j - 1], i: i - 1, j: j - 1 }); i--; j--; }
    else if (p === "del") { ops.push({ type: "del", target: targetWords[i - 1], i: i - 1, j }); i--; }
    else if (p === "ins") { ops.push({ type: "ins", said: saidWords[j - 1], i, j: j - 1 }); j--; }
    else break;
  }
  ops.reverse(); return ops;
}

const STOPWORDS = new Set(["the","a","an","is","this","that","yes","no","mr","mrs","miss"]);
const CRITICAL = new Set(["this","the","is","yes"]);

export type StrictEvalResult = {
  score: number;
  feedback: string;
  errors: { missing: string[]; extra: string[]; wrong: { target: string; said: string }[]; orderPenalty: number; cohesionPenalty: number };
  contentMatchRatio: number; // porcentaje de palabras de contenido acertadas
};

export function evaluatePronunciationStrict(userSaid: string, target: string): StrictEvalResult {
  const said = tokenizeWords(userSaid);
  const targ = tokenizeWords(target);

  if (!targ.length) {
    return { score: 0, feedback: "No hay frase objetivo.", errors: { missing: [], extra: [], wrong: [], orderPenalty: 0, cohesionPenalty: 0 }, contentMatchRatio: 0 };
  }
  if (!said.length) {
    return { score: 0, feedback: "No se detecto tu voz. intenta de nuevo. habla mas fuerte y claro.", errors: { missing: targ, extra: [], wrong: [], orderPenalty: 20, cohesionPenalty: 20 }, contentMatchRatio: 0 };
  }

  const ops = wordAlignment(targ, said);
  const missing: string[] = [];
  const extra: string[] = [];
  const wrong: { target: string; said: string }[] = [];
  let penalty = 0;

  for (const op of ops) {
    if (op.type === "del" && op.target) {
      missing.push(op.target);
      penalty += CRITICAL.has(op.target) ? 12 : 8; // penalización menor que antes
    } else if (op.type === "ins" && op.said) {
      extra.push(op.said);
      penalty += 5;
    } else if (op.type === "sub" && op.target && op.said) {
      // si son fonéticamente cercanas, penalización leve
      if (phoneticClose(op.target, op.said)) {
        penalty += 3;
      } else {
        wrong.push({ target: op.target, said: op.said });
        penalty += (CRITICAL.has(op.target) || CRITICAL.has(op.said)) ? 12 : 10;
      }
    }
  }

  // orden y cohesión
  const lcs = lcsLength(targ, said);
  const orderPenalty = Math.round((1 - lcs / Math.max(targ.length, 1)) * 12); // menor influencia
  penalty += orderPenalty;

  const bT = new Set(bigrams(targ)), bS = new Set(bigrams(said));
  const inter = new Set([...bT].filter(x => bS.has(x))).size;
  const p = bS.size ? inter / bS.size : 0, r = bT.size ? inter / bT.size : 0;
  const bigramF1 = (p + r) ? (2 * p * r) / (p + r) : 0;
  const cohesionPenalty = Math.round((1 - bigramF1) * 12);
  penalty += cohesionPenalty;

  // parecido caracter a caracter: suaviza si el global está muy cerca
  const charPenalty = Math.round((1 - similarityChars(userSaid, target)) * 8);
  penalty += charPenalty;

  let score = Math.max(0, 100 - penalty);
  if (wrong.some(w => CRITICAL.has(w.target)) || missing.some(w => CRITICAL.has(w))) {
    score = Math.min(score, 88); // permite avanzar si el resto está bien
  }

  // porcentaje de palabras de contenido acertadas
  const contentTarget = targ.filter(w => !STOPWORDS.has(w));
  const contentSaid = said.filter(w => !STOPWORDS.has(w));
  const matchedContent = contentTarget.filter(tw =>
    contentSaid.some(sw => sw === tw || phoneticClose(tw, sw))
  ).length;
  const contentMatchRatio = contentTarget.length ? matchedContent / contentTarget.length : 1;

  // mensajes en palabras
  const msgs: string[] = [];
  wrong.slice(0, 4).forEach(w => msgs.push(`Corrige. dijiste ${w.said}. la palabra correcta es ${w.target}.`));
  if (missing.length) msgs.push(`Falto contenido. incluye estas palabras. ${missing.slice(0, 4).join(" ")}.`);
  if (extra.length) msgs.push(`Sobra contenido. elimina estas palabras. ${extra.slice(0, 4).join(" ")}.`);
  if (orderPenalty >= 6) msgs.push("Mantén el orden exacto de las palabras.");
  if (cohesionPenalty >= 6) msgs.push("Cuida el enlace natural entre las palabras.");

  const feedback =
    msgs.length ? msgs.join(" ")
    : (score >= 90
        ? "Muy bien. lo pronunciaste de forma clara y precisa."
        : "Bien. ajusta detalles finos de pronunciacion y enlace.");

  return { score, feedback, errors: { missing, extra, wrong, orderPenalty, cohesionPenalty }, contentMatchRatio };
}

// ---------- TTS ----------
function pickLatinaYouthVoice(voices: SpeechSynthesisVoice[], lang = "es-419", preferFemale = true, voiceName?: string) {
  const forced = (voiceName || DEFAULT_VOICE_NAME)?.trim();
  if (forced) {
    const exact = voices.find(v => v.name.toLowerCase() === forced.toLowerCase());
    if (exact) return exact;
  }
  const preferredNames = [
    "es-US-Standard-C", "es-MX-Standard-C", "es-MX-Standard-D",
    "Google español de Estados Unidos", "Google Español (Latinoamérica)",
    "es-US-Standard-A", "es-US-Standard-F",
  ];
  const byName = voices.find(v => preferredNames.some(n => v.name.includes(n)));
  if (byName) return byName;

  const esAny = voices.filter(v => v.lang?.toLowerCase().startsWith("es"));
  if (preferFemale) {
    const female = esAny.find(v => /female|mujer|woman|chica|girl/i.test(v.name));
    if (female) return female;
  }
  return esAny[0] || voices[0];
}

export async function speak(text: string, opts: VoicePrefs = { lang: "es-419", rate: 0.95, pitch: 1.1, preferFemale: true }) {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return resolve();
    const synth = window.speechSynthesis;

    const ensureVoices = (cb: () => void) => {
      const voices = synth.getVoices();
      if (voices && voices.length > 0) cb();
      else {
        const onVoices = () => { synth.removeEventListener("voiceschanged", onVoices); cb(); };
        synth.addEventListener("voiceschanged", onVoices);
        synth.getVoices();
      }
    };

    ensureVoices(() => {
      const voices = synth.getVoices();
      const voice = pickLatinaYouthVoice(voices, opts.lang, opts.preferFemale ?? true, opts.voiceName);
      const u = new SpeechSynthesisUtterance(text);
      u.lang = opts.lang || voice?.lang || "es-ES";
      u.voice = voice || null;
      u.rate = opts.rate ?? 0.95;
      u.pitch = opts.pitch ?? 1.1;
      u.onend = () => resolve();
      synth.cancel(); synth.speak(u);
    });
  });
}

export async function speakExplain(lines: string[], opts?: VoicePrefs) {
  for (const line of lines) {
    const phrased = line.replace(/: /g, ". ").replace(/\((.*?)\)/g, "$1. ");
    await speak(phrased, opts);
    await new Promise(r => setTimeout(r, 250));
  }
}

export async function beep(durationMs = 120, frequency = 880) {
  if (typeof window === "undefined") return;
  const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine"; o.frequency.value = frequency; g.gain.value = 0.05;
  o.connect(g); g.connect(ctx.destination); o.start();
  await new Promise(r => setTimeout(r, durationMs));
  o.stop(); ctx.close();
}

// ---------- STT con estados robustos ----------
export type ListeningStatus = "idle" | "pre" | "active" | "retrying";

type UseSpeechRecognitionArgs = {
  lang?: string;
  onFinalResult?: (text: string, confidence?: number) => void;
  minWordsForEval?: number;
  autoRestartIfShort?: boolean;
};

export function useSpeechRecognition({
  lang = "en-US",
  onFinalResult,
  minWordsForEval = 2,
  autoRestartIfShort = true,
}: UseSpeechRecognitionArgs = {}) {
  const Recognition = useMemo(() => {
    if (typeof window === "undefined") return null;
    return (window.SpeechRecognition || window.webkitSpeechRecognition) as new () => any;
  }, []);

  const supported = !!Recognition;
  const [status, setStatus] = useState<ListeningStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<any>(null);
  const retriedRef = useRef(false);
  const willRestartRef = useRef(false);

  useEffect(() => {
    if (!supported || recRef.current) return;

    const rec = new Recognition!();
    rec.lang = lang;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = true as any;

    rec.onstart = () => setStatus("active");
    rec.onaudioend = () => {
      if (!willRestartRef.current) setStatus("idle");
    };

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const res = e.results[e.results.length - 1];
      const alt: any = res?.[0];
      const t = String(alt?.transcript ?? "");
      setTranscript(t);

      if (!res.isFinal) return;

      const words = tokenizeWords(t).length;
      if (autoRestartIfShort && words < minWordsForEval && !retriedRef.current) {
        retriedRef.current = true;
        willRestartRef.current = true;
        setStatus("retrying");
        try {
          rec.stop();
          setTimeout(() => {
            try { rec.start(); setStatus("active"); } catch {}
            willRestartRef.current = false;
          }, 400);
          return;
        } catch {
          willRestartRef.current = false;
        }
      }

      retriedRef.current = false;
      willRestartRef.current = false;
      setStatus("idle");
      const conf: number | undefined = typeof alt?.confidence === "number" ? alt.confidence : undefined;
      onFinalResult?.(t, conf);
    };

    rec.onerror = () => {
      retriedRef.current = false;
      willRestartRef.current = false;
      setStatus("idle");
    };
    rec.onend = () => {
      if (!willRestartRef.current) setStatus("idle");
    };

    recRef.current = rec;

    return () => { try { recRef.current?.abort?.(); } catch {} recRef.current = null; };
  }, [supported, lang, onFinalResult, autoRestartIfShort, minWordsForEval, Recognition]);

  const startListening = useCallback(() => {
    if (!supported || !recRef.current) return;
    setTranscript("");
    retriedRef.current = false;
    willRestartRef.current = false;
    setStatus("active");
    try { recRef.current.start(); } catch { setStatus("idle"); }
  }, [supported]);

  const startListeningWithDelay = useCallback((ms = 1500) => {
    if (!supported || !recRef.current) return;
    setTranscript("");
    retriedRef.current = false;
    willRestartRef.current = false;
    setStatus("pre");
    setTimeout(() => {
      try { recRef.current!.start(); } catch { setStatus("idle"); }
    }, ms);
  }, [supported]);

  const stopListening = useCallback(() => {
    try { recRef.current?.stop?.(); } finally {
      retriedRef.current = false;
      willRestartRef.current = false;
      setStatus("idle");
    }
  }, []);

  const resetTranscript = useCallback(() => setTranscript(""), []);

  return {
    supported,
    status,                 // "idle" | "pre" | "active" | "retrying"
    isIndicatorOn: status !== "idle",
    transcript,
    startListening,
    startListeningWithDelay,
    stopListening,
    resetTranscript,
  };
}
