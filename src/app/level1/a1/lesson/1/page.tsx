// =============================================
// FILE: src/app/level1/a1/lesson/1/page.tsx
// Indicador visible en pre/active/retrying; se apaga solo en idle
// Avance flexible: puntaje o coincidencia de contenido
// Feedback en palabras, sin símbolos
// Barra de progreso junto al botón "Escuchar la clase"
// Imagen a la derecha de la frase actual (cambia con la frase)
// Mensaje final hablado tras feedback de la oración y de la página
// =============================================

"use client";

import React, { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import {
  speak,
  speakExplain,
  beep,
  useSpeechRecognition,
  evaluatePronunciationStrict,
} from "@/lib/voice/speech";

const DIALOG_LINES: { en: string; es: string }[] = [
  { en: "This is the family.", es: "Esta es la familia." },
  { en: "This is the mother.", es: "Esta es la madre." },
  { en: "This is Mrs. Brown.", es: "Esta es la Sra. Brown." },
  { en: "Is this the mother? Yes, this is the mother.", es: "¿Es esta la madre? Sí, esta es la madre." },
  { en: "Is this Mrs. Brown? Yes, this is Mrs. Brown.", es: "¿Es esta la Sra. Brown? Sí, esta es la Sra. Brown." },
  { en: "This is the father.", es: "Este es el padre." },
  { en: "This is Mr. Brown.", es: "Este es el Sr. Brown." },
  { en: "Is this the father? Yes, this is the father.", es: "¿Es este el padre? Sí, este es el padre." },
  { en: "Is this Mr. Brown? Yes, this is Mr. Brown.", es: "¿Es este el Sr. Brown? Sí, este es el Sr. Brown." },
  { en: "This is the son.", es: "Este es el hijo." },
  { en: "This is Alex.", es: "Este es Alex." },
  { en: "Is this the son? Yes, this is the son.", es: "¿Es este el hijo? Sí, este es el hijo." },
  { en: "Is this Alex? Yes, this is Alex.", es: "¿Es este Alex? Sí, este es Alex." },
  { en: "This is the daughter.", es: "Esta es la hija." },
  { en: "This is Emma.", es: "Esta es Emma." },
  { en: "Is this the daughter? Yes, this is the daughter.", es: "¿Es esta la hija? Sí, esta es la hija." },
  { en: "Is this Emma? Yes, this is Emma.", es: "¿Es esta Emma? Sí, esta es Emma." },
  { en: "This is the baby.", es: "Este es el bebé." },
  { en: "This is Leo.", es: "Este es Leo." },
  { en: "Is this the baby? Yes, this is the baby.", es: "¿Es este el bebé? Sí, este es el bebé." },
  { en: "Is this Leo? Yes, this is Leo.", es: "¿Es este Leo? Sí, este es Leo." },
];

// Imágenes por frase (ajusta según tus archivos en public/images/family/)
const LINE_IMAGES: string[] = [
  "/images/family/family.jpg",
  "/images/family/mother.jpg",
  "/images/family/mrs-brown.jpg",
  "/images/family/mother-question.jpg",
  "/images/family/mrs-brown-question.jpg",
  "/images/family/father.jpg",
  "/images/family/mr-brown.jpg",
  "/images/family/father-question.jpg",
  "/images/family/mr-brown-question.jpg",
  "/images/family/son.jpg",
  "/images/family/alex.jpg",
  "/images/family/son-question.jpg",
  "/images/family/alex-question.jpg",
  "/images/family/daughter.jpg",
  "/images/family/emma.jpg",
  "/images/family/daughter-question.jpg",
  "/images/family/emma-question.jpg",
  "/images/family/baby.jpg",
  "/images/family/leo.jpg",
  "/images/family/baby-question.jpg",
  "/images/family/leo-question.jpg",
];
const FALLBACK_IMAGE = "/images/lesson-family.jpg";

// Barra de progreso de la página (porcentaje de frases aprobadas)
function PageProgress({ value }: { value: number }) {
  const color =
    value >= 66 ? "bg-emerald-600" : value >= 33 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2 min-w-[180px]">
      <div className="h-2 w-36 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-600 w-10 text-right">{value}%</span>
    </div>
  );
}

function Thermometer({ value }: { value: number }) {
  const color = value >= 85 ? "bg-emerald-600" : value >= 70 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>Precisión</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ListeningIndicator({ active, label = "Escuchando. di la frase" }: { active: boolean; label?: string }) {
  if (!active) return null;
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-600" />
        </div>
        <div className="flex items-end gap-[3px] h-4">
          <span className="eqbar" style={{ animationDelay: "0ms" }} />
          <span className="eqbar" style={{ animationDelay: "120ms" }} />
          <span className="eqbar" style={{ animationDelay: "240ms" }} />
          <span className="eqbar" style={{ animationDelay: "360ms" }} />
        </div>
        <span className="text-xs font-medium text-emerald-700">{label}</span>
      </div>
      <style jsx>{`
        .eqbar { display:inline-block; width:3px; background:#059669; border-radius:2px; height:6px; animation:eq-b 900ms ease-in-out infinite; }
        @keyframes eq-b { 0%,100%{height:6px;opacity:.8} 50%{height:16px;opacity:1} }
      `}</style>
    </>
  );
}

export default function LessonOnePage() {
  const [idx, setIdx] = useState(0);
  const [passed, setPassed] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [lastErrors, setLastErrors] = useState<{
    missing: string[];
    extra: string[];
    wrong: { target: string; said: string }[];
  } | null>(null);

  const current = DIALOG_LINES[idx];
  const currentImage = LINE_IMAGES[idx] ?? FALLBACK_IMAGE;

  const percent = useMemo(() => Math.round(((idx + 1) / DIALOG_LINES.length) * 100), [idx]);
  const approvedCount = useMemo(() => Object.values(passed).filter(Boolean).length, [passed]);
  const pageProgress = useMemo(
    () => Math.round((approvedCount / DIALOG_LINES.length) * 100),
    [approvedCount]
  );
  const allPassed = useMemo(() => DIALOG_LINES.every((_, i) => passed[i]), [passed]);

  const ADVANCE_SCORE = 80;              // más flexible
  const ADVANCE_CONTENT_MATCH = 0.8;     // ochenta por ciento de palabras de contenido
  const lastIndex = DIALOG_LINES.length - 1;

  const onFinalResult = useCallback(async (text: string) => {
    setTranscript(text);
    const res = evaluatePronunciationStrict(text, current.en);

    setScore(res.score);
    setFeedback(res.feedback);
    setLastErrors({ missing: res.errors.missing, extra: res.errors.extra, wrong: res.errors.wrong });

    const canAdvance = res.score >= ADVANCE_SCORE || res.contentMatchRatio >= ADVANCE_CONTENT_MATCH;
    if (canAdvance) setPassed((p) => ({ ...p, [idx]: true }));

    // 1) Feedback de la oración, siempre en voz
    await speak(res.feedback, { lang: "es-419", rate: 0.95, pitch: 1.1, preferFemale: true });

    // 2) Instrucción para continuar o corregir
    const isLast = idx === lastIndex;
    if (!isLast) {
      await speak(
        canAdvance ? "Muy bien. puedes continuar." : "Necesita correccion. intenta una vez mas.",
        { lang: "es-419", rate: 0.95, pitch: 1.1, preferFemale: true }
      );
    } else {
      // 3) Última frase: cierre de oración
      await speak(
        canAdvance
          ? "Muy bien. terminaste la ultima frase con buen resultado."
          : "Estas en la ultima frase. cuando la pronuncies correctamente podras avanzar a la siguiente pagina.",
        { lang: "es-419", rate: 0.95, pitch: 1.1, preferFemale: true }
      );

      // 4) Si aprobó la última, resumen de página y permiso para avanzar (también por voz)
      if (canAdvance) {
        const approvedAfter = Object.values({ ...passed, [idx]: true }).filter(Boolean).length;
        const pageMsg =
          `Resumen de la pagina. oraciones logradas. ${approvedAfter} de ${DIALOG_LINES.length}. ` +
          `Puedes avanzar a la siguiente pagina.`;
        await speak(pageMsg, { lang: "es-419", rate: 0.95, pitch: 1.1, preferFemale: true });
      }
    }
  }, [current.en, idx, lastIndex, passed]);

  const {
    supported: sttSupported,
    status,
    isIndicatorOn,
    startListeningWithDelay,
    resetTranscript,
  } = useSpeechRecognition({
    lang: "en-US",
    onFinalResult,
    minWordsForEval: 2,
    autoRestartIfShort: true,
  });

  const practiceOnce = useCallback(async () => {
    setScore(null); setFeedback(""); setTranscript(""); setLastErrors(null); resetTranscript();
    await speak("Repite despues de mi.", { lang: "es-419", rate: 0.95, pitch: 1.1, preferFemale: true });
    await speak(current.en, { lang: "en-US", rate: 0.9, pitch: 1.0 });
    await beep(120, 880);
    startListeningWithDelay(500);
  }, [current.en, resetTranscript, startListeningWithDelay]);

  const handleExplainClass = useCallback(async () => {
    const explanation = [
      "Objetivos. usar el articulo the. el demostrativo this. y hacer preguntas con is.",
      "the se pronuncia the. o thee. antes de vocal.",
      "this significa esto. este. o esta. se pronuncia this.",
      "para preguntar. is this. respuesta. yes. this is.",
      "practiquemos ahora la frase objetivo.",
    ];
    await speakExplain(explanation, { lang: "es-419", rate: 0.95, pitch: 1.1, preferFemale: true });
    await practiceOnce();
  }, [practiceOnce]);

  const handleNext = useCallback(() => {
    setScore(null); setFeedback(""); setTranscript(""); setLastErrors(null);
    setIdx(p => Math.min(DIALOG_LINES.length - 1, p + 1));
  }, []);
  const handlePrev = useCallback(() => {
    setScore(null); setFeedback(""); setTranscript(""); setLastErrors(null);
    setIdx(p => Math.max(0, p - 1));
  }, []);

  return (
    <main className="bg-gradient-to-b from-indigo-50 via-white to-white">
      <header className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-700">Nivel A1 · Lección 1 · Página 1</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">The Family — La Familia</h1>
            <p className="mt-1 text-sm text-gray-600">Objetivos. usar the y this. hacer preguntas con is. presentar miembros de la familia.</p>
          </div>
          <a href="/level1/a1" className="rounded-2xl border px-3 py-1 text-sm">Volver a A1</a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Gramática en 1 minuto</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li><strong>the</strong> significa el la los las. pronunciacion the o thee antes de vocal.</li>
              <li><strong>this</strong> significa esto este esta. pronunciacion this.</li>
              <li>preguntas. is this. respuesta. yes. this is.</li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={handleExplainClass} className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                Escuchar la clase
              </button>
              <PageProgress value={pageProgress} />
            </div>
          </div>

          <div className="relative hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:block">
            <Image src="/images/lesson-family.jpg" alt="Family" fill className="rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-5xl px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Diálogo modelo</h2>
          </div>

          <div className="mt-4 grid items-start gap-6 md:grid-cols-2">
            {/* Columna izquierda: frase actual */}
            <div>
              <p className="text-xl font-semibold text-gray-900">{current.en}</p>
              <p className="mt-2 text-sm text-gray-600">{current.es}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button onClick={practiceOnce} className="rounded-2xl border px-4 py-2 text-sm font-semibold">
                  Repetir con mi voz
                </button>

                <ListeningIndicator
                  active={isIndicatorOn}
                  label={status === "pre" ? "Listo. comenzando a escuchar" : status === "retrying" ? "Escuchando. intenta de nuevo" : "Escuchando. di la frase"}
                />
              </div>

              {!sttSupported && (
                <p className="mt-2 text-xs text-amber-600">Tu navegador no soporta reconocimiento de voz. prueba con chrome.</p>
              )}
              {transcript && (
                <p className="mt-3 text-sm text-gray-700"><strong>Tu voz transcripcion</strong> {transcript}</p>
              )}

              {score !== null && <Thermometer value={score} />}
              {feedback && <p className="mt-2 text-sm text-gray-700">{feedback}</p>}

              {lastErrors && (lastErrors.missing.length || lastErrors.extra.length || lastErrors.wrong.length) > 0 && (
                <div className="mt-3 rounded-md bg-rose-50 p-3 text-sm text-rose-800 space-y-1">
                  {lastErrors.wrong.length > 0 && (
                    <div>
                      <span className="font-semibold">Sustituciones</span>
                      <ul className="list-disc pl-5">
                        {lastErrors.wrong.map((w, i) => (
                          <li key={i}>
                            Corrige. dijiste {w.said}. la palabra correcta es {w.target}.
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {lastErrors.missing.length > 0 && (
                    <div>
                      <span className="font-semibold">Falto</span>
                      <ul className="list-disc pl-5">
                        {lastErrors.missing.map((m, i) => <li key={i}>Incluye la palabra {m}.</li>)}
                      </ul>
                    </div>
                  )}
                  {lastErrors.extra.length > 0 && (
                    <div>
                      <span className="font-semibold">De mas</span>
                      <ul className="list-disc pl-5">
                        {lastErrors.extra.map((e, i) => <li key={i}>Elimina la palabra {e}.</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => { setScore(null); setFeedback(""); setTranscript(""); setLastErrors(null); setIdx(p => Math.max(0, p - 1)); }}
                  disabled={idx === 0}
                  className="rounded-2xl border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => { setScore(null); setFeedback(""); setTranscript(""); setLastErrors(null); setIdx(p => Math.min(DIALOG_LINES.length - 1, p + 1)); }}
                  disabled={!passed[idx]}
                  className="rounded-2xl border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>

              {/* Mensaje claro al estar en la última frase */}
              {idx === lastIndex && (
                <p className="mt-3 text-sm text-indigo-700">
                  {passed[idx]
                    ? "Muy bien. completaste la última frase con buen resultado. puedes avanzar a la siguiente página."
                    : "Estás en la última frase. cuando la pronuncies correctamente podrás avanzar a la siguiente página."}
                </p>
              )}
            </div>

            {/* Columna derecha: Imagen que cambia con la frase y consejos debajo */}
            <div className="space-y-4">
              <div className="relative h-44 w-full overflow-hidden rounded-xl border bg-white">
                <Image
                  key={idx} // fuerza el cambio visual al cambiar de frase
                  src={currentImage}
                  alt="Referencia de la frase"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={idx < 2}
                />
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                <p className="font-semibold">Consejo de pronunciación</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>the. sonido suave. usa the antes de consonante y thee antes de vocal.</li>
                  <li>this. sonido suave de th.</li>
                  <li>Mantén el orden y el enlace natural entre las palabras.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto my-10 max-w-5xl px-6">
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-gray-900">¿Listo para seguir?</p>
            <p className="text-sm text-gray-600">
              Puedes avanzar si el termómetro es mayor o igual a ochenta o si las palabras importantes están bien dichas.
              {idx === lastIndex && !passed[idx] && " Estás en la última frase. cuando la pronuncies correctamente podrás avanzar."}
              {idx === lastIndex && passed[idx] && " Felicitaciones. ya puedes avanzar a la siguiente página."}
            </p>
          </div>
          <a
            aria-disabled={!allPassed}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white ${allPassed ? "bg-indigo-600" : "pointer-events-none bg-gray-300"}`}
            href={allPassed ? "/level1/a1/lesson/1/page-2" : undefined}
          >
            Ir a Página 2
          </a>
        </div>
      </section>
    </main>
  );
}
