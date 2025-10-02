// =============================================
// FILE: src/app/dashboard/page.tsx  (grid de niveles con progreso)
// =============================================
// =============================================
// FILE: src/app/dashboard/page.tsx
// Grid de niveles con progreso + rutas escalables
// =============================================
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Tipos
type ProgressItem = {
  id: string;
  title: string;
  pct: number;
};

// --- Progreso mock (reemplazar luego con query a Supabase) ---
const PROGRESS: ProgressItem[] = [
  { id: "levelcheck", title: "Test de Nivelación Inicial", pct: 0 },
  { id: "starter-a1", title: "Nivel Inicial (A1)", pct: 20 },
  { id: "stepup-a2", title: "Nivel Básico (A2)", pct: 0 },
  { id: "bridge-b1a", title: "Intermedio Fundamental (B1 – Parte 1)", pct: 0 },
  { id: "bridge-b1b", title: "Intermedio Conversacional (B1 – Parte 2)", pct: 0 },
  { id: "advance-b2", title: "Avanzado General (B2)", pct: 0 },
  { id: "pro-c1", title: "Dominio Profesional (C1)", pct: 0 },
  { id: "master-c2", title: "Maestría del Idioma (C2)", pct: 0 },
  { id: "exam-toefl", title: "Preparación TOEFL", pct: 0 },
  { id: "biz-pro", title: "Inglés para Negocios", pct: 0 },
  { id: "sound-pron", title: "Entrenamiento en Pronunciación", pct: 0 },
  { id: "craft-writing", title: "Taller de Escritura en Inglés", pct: 0 },
  { id: "talk-speaking", title: "Práctica de Conversación", pct: 0 },
];

// --- Mapa explícito de rutas ya definidas ---
// 1) Si existe aquí, se usa esto.
// 2) Si no existe, intenta resolver por convención (ver resolveByConvention más abajo).
const ROUTE_MAP: Record<
  string,
  {
    level?: string;  // página de listado de lecciones del nivel
    lesson?: string; // “continuar”: primera o última lección en curso
  }
> = {
  // Niveles CEFR
  "starter-a1": { level: "/level1/a1", lesson: "/lesson/1" },
  "stepup-a2": { level: "/level2/a2", lesson: "/lesson/16" },
  "bridge-b1a": { level: "/level3/b1a", lesson: "/lesson/31" },
  "bridge-b1b": { level: "/level4/b1b", lesson: "/lesson/46" },
  "advance-b2": { level: "/level5/b2", lesson: "/lesson/61" },
  "pro-c1": { level: "/level6/c1", lesson: "/lesson/76" },
  "master-c2": { level: "/level7/c2", lesson: "/lesson/91" },

  // Examen/diagnóstico
  levelcheck: { level: "/placement", lesson: "/placement" },

  // Preparaciones/Especializaciones (ajusta a tu estructura real)
  "exam-toefl": { level: "/exam/toefl", lesson: "/exam/toefl/start" },
  "biz-pro": { level: "/track/business", lesson: "/track/business/start" },
  "sound-pron": { level: "/track/pronunciation", lesson: "/track/pronunciation/start" },
  "craft-writing": { level: "/track/writing", lesson: "/track/writing/start" },
  "talk-speaking": { level: "/track/speaking", lesson: "/track/speaking/start" },
};

// --- Convención para niveles CEFR ---
// Si el id incluye -a1, -a2, -b1a, -b1b, -b2, -c1 o -c2, auto-resuelve /level/<code>
function resolveByConvention(id: string): { level?: string; lesson?: string } | null {
  // Busca sufijos conocidos en el id, p.ej. "starter-a1", "bridge-b1a"
  const match = id.match(/-(a1|a2|b1a|b1b|b2|c1|c2)\b/i);
  if (!match) return null;

  const code = match[1].toLowerCase(); // a1 | a2 | b1a | b1b | b2 | c1 | c2

  // Resuelve /level/<code>; para lesson podrías tener una convención, p.ej. un índice base por nivel:
  const lessonStartByCode: Record<string, number> = {
    a1: 1,
    a2: 16,
    b1a: 31,
    b1b: 46,
    b2: 61,
    c1: 76,
    c2: 91,
  };

  return {
    level: `/level/${code}`,
    lesson: lessonStartByCode[code] ? `/lesson/${lessonStartByCode[code]}` : undefined,
  };
}

// --- Resolver rutas finales ---
// 1) Busca en ROUTE_MAP
// 2) Si no está, intenta convención
// 3) Si nada, retorna undefined (botón deshabilitado)
function getRoutesForId(id: string): { levelHref?: string; lessonHref?: string } {
  const direct = ROUTE_MAP[id];
  if (direct) return { levelHref: direct.level, lessonHref: direct.lesson };

  const conv = resolveByConvention(id);
  if (conv) return { levelHref: conv.level, lessonHref: conv.lesson };

  return {};
}

// --- Botón reutilizable ---
function ActionButton({
  href,
  children,
  variant = "primary",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const isDisabled = !href;
  const clsBase =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition";
  const clsEnabled =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:shadow-md"
      : "bg-transparent text-indigo-700 hover:bg-indigo-50 hover:shadow-md";
  const clsDisabled = "pointer-events-none opacity-50";
  const className = `${clsBase} ${isDisabled ? clsDisabled : clsEnabled}`;

  if (isDisabled) {
    return <span className={className} aria-disabled>{children}</span>;
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function DashboardPage() {
  const supa = createClient();
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) redirect("/login");

  // TODO: reemplazar con progreso real desde DB
  const progress = PROGRESS;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Hola, {user.user_metadata?.name || user.email}
          </h1>
          <p className="text-sm text-gray-600">
            Elige un nivel para continuar tu aprendizaje.
          </p>
        </div>

        {/* Sign out (Server Action) */}
        <form
          action={async () => {
            "use server";
            const s = createClient();
            await s.auth.signOut();
            redirect("/");
          }}
        >
          <button className="rounded-2xl border px-3 py-1">Salir</button>
        </form>
      </header>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {progress.map((p) => {
          const { levelHref, lessonHref } = getRoutesForId(p.id);
          return (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>

              {/* Barra de progreso */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: `${p.pct}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-gray-500">{p.pct}%</div>

              {/* Acciones */}
              <div className="mt-3 flex gap-2">
                <ActionButton href={levelHref}>Ver unidades</ActionButton>
                <ActionButton href={lessonHref} variant="ghost">
                  Continuar
                </ActionButton>
              </div>

              {/* Hint cuando no hay ruta aún */}
              {!levelHref && (
                <p className="mt-2 text-xs text-amber-600">
                  Ruta no disponible todavía. Crea la página del nivel o agrega el
                  mapping en <code>ROUTE_MAP</code>.
                </p>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}
