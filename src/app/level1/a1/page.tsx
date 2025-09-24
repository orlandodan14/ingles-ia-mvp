import React from "react";
import { BookOpen, Lock, CheckCircle2, PlayCircle, GraduationCap, ClipboardCheck, Trophy } from "lucide-react";

// Nota: en tu proyecto Next.js, coloca este contenido como
// src/app/level/a1/page.tsx
// y asegúrate de tener shadcn/ui con Button, Card, Progress.

// --- UI helpers mínimos (si ya tienes shadcn/ui, usa sus imports reales) ---
const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="mx-auto max-w-6xl px-4 py-10">{children}</section>
);

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-5 shadow-sm ${className}`}>{children}</div>
);

const Button = ({ children, href, disabled, variant = "primary" }: { children: React.ReactNode; href?: string; disabled?: boolean; variant?: "primary" | "ghost" }) => (
  <a
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    className={[
      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition",
      disabled ? "pointer-events-none opacity-50" : "hover:shadow-md",
      variant === "primary" ? "bg-indigo-600 text-white" : "bg-transparent text-indigo-700 hover:bg-indigo-50",
    ].join(" ")}
  >
    {children}
  </a>
);

// --- Datos mockeados (reemplazar con query a Supabase más adelante) ---
const LESSONS = Array.from({ length: 15 }).map((_, i) => {
  const n = i + 1;
  const titles = [
    "Saludos y Presentaciones",
    "Números y Edad",
    "Rutina Diaria",
    "Familia y Descripciones",
    "Comida y Pedidos",
    "Direcciones y Ubicaciones",
    "Tiempo y Clima (básico)",
    "Hobbies y Gustos",
    "La Casa y Objetos",
    "La Ciudad y Transporte",
    "Compras (prices)",
    "Trabajo/Estudio (básico)",
    "Salud (básico)",
    "Planes Simples (futuro)",
    "Revisión General A1",
  ];
  return {
    id: String(n),
    number: n,
    title: titles[i] ?? `Lección ${n}`,
    // Simulación de estados: desbloqueadas 1-3, la 4 en curso, 5-15 bloqueadas
    status: n < 4 ? "done" : n === 4 ? "current" : "locked",
    progress: n === 4 ? 40 : n < 4 ? 100 : 0,
    duration: 15, // minutos estimados
  } as const;
});

const TESTS = [
  { id: "t1", range: "1–5", href: "/test/1-5" },
  { id: "t2", range: "6–10", href: "/test/6-10" },
  { id: "t3", range: "11–15", href: "/test/11-15" },
];

export default function A1LevelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <Section>
        <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-indigo-700">
              <GraduationCap className="h-4 w-4" />
              <span>Nivel</span>
              <Badge className="border-indigo-200 bg-indigo-100 text-indigo-800">A1 — Principiante</Badge>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Lecciones del nivel A1</h1>
            <p className="mt-2 max-w-2xl text-gray-600">Estudia la teoría, practica con el bot de IA y avanza desbloqueando lecciones. Tu progreso se guarda automáticamente.</p>
          </div>
          <div className="flex gap-3">
            <Button href="/dashboard" variant="ghost"><ClipboardCheck className="h-4 w-4"/> Mi progreso</Button>
            <Button href="/lesson/1"><PlayCircle className="h-4 w-4"/> Empezar ahora</Button>
          </div>
        </header>

        {/* Grid de lecciones */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LESSONS.map((l) => (
            <Card key={l.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">{l.number}</div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{l.title}</h3>
                    <p className="text-xs text-gray-500">~{l.duration} min • Gramática + Vocabulario + Diálogo</p>
                  </div>
                </div>
                {l.status === "locked" ? (
                  <Badge className="border-gray-200 bg-gray-100 text-gray-600"><Lock className="mr-1 h-3 w-3"/>Bloqueada</Badge>
                ) : l.status === "done" ? (
                  <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700"><CheckCircle2 className="mr-1 h-3 w-3"/>Completada</Badge>
                ) : (
                  <Badge className="border-indigo-200 bg-indigo-100 text-indigo-800">En curso</Badge>
                )}
              </div>

              {/* Barra de progreso */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${l.progress}%` }} />
              </div>
              <div className="mt-1 text-right text-xs text-gray-500">{l.progress}%</div>

              <div className="mt-4 flex gap-2">
                {l.status === "locked" ? (
                  <Button disabled>
                    <Lock className="h-4 w-4"/> Desbloquea alcanzando 70+
                  </Button>
                ) : (
                  <Button href={`/lesson/${l.id}`}>
                    <BookOpen className="h-4 w-4"/> Abrir lección
                  </Button>
                )}
                <Button href={`/lesson/${l.id}#practice`} variant="ghost">
                  <PlayCircle className="h-4 w-4"/> Practicar con IA
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bloque de tests por unidad */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Tests por bloques</h2>
          <p className="mt-1 text-sm text-gray-600">Evalúa tu avance cada 5 lecciones. Puntaje ≥ 70 desbloquea el siguiente bloque.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TESTS.map((t) => (
              <Card key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold">{t.range}</div>
                  <div>
                    <p className="font-medium text-gray-900">Test unidades {t.range}</p>
                    <p className="text-xs text-gray-500">20 preguntas • tiempo sugerido 10 min</p>
                  </div>
                </div>
                <Button href={t.href}><Trophy className="h-4 w-4"/> Rendir test</Button>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
