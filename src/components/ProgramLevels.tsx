// =============================================
// COMPONENTE: ProgramLevels
// Descripción:
//   - Renderiza las tarjetas del programa por niveles con
//     colores distintos según la etapa ("Placement", "Iniciación",
//     "Aprendizaje", "Académica", "Especialización").
//   - Reduce el look "muy blanco" con fondos suaves y bordes coloreados.
// Uso:
//   <ProgramLevels levels={PROGRAM_LEVELS} />
// =============================================

import React from "react";

// Tipo para mayor claridad/TS
export type Level = {
  id: string;
  stage: string;
  title: string;
  desc: string;
};

// -------------------------------------------------------------
// Map de estilos por "grupo" de etapa (tú puedes ajustar colores aquí).
// bg: color de fondo de la tarjeta
// border: color del borde
// chipBg/chipText: estilos de la pill de etapa
// bar: color de la barrita vertical decorativa en el borde izquierdo
// hover: efecto hover sutil
// -------------------------------------------------------------
const GROUP_STYLES: Record<
  "placement" | "init" | "learn" | "academic" | "spec",
  { card: string; chip: string; bar: string; hover: string }
> = {
  placement: {
    card: "bg-sky-100 border-sky-200",
    chip: "bg-sky-100 text-sky-800",
    bar: "bg-sky-300",
    hover: "hover:shadow-md hover:border-sky-300",
  },
  init: {
    card: "bg-lime-50 border-lime-200",
    chip: "bg-lime-100 text-lime-800",
    bar: "bg-lime-300",
    hover: "hover:shadow-md hover:border-lime-300",
  },
  learn: {
    card: "bg-indigo-50 border-indigo-200",
    chip: "bg-indigo-100 text-indigo-800",
    bar: "bg-indigo-300",
    hover: "hover:shadow-md hover:border-indigo-300",
  },
  academic: {
    card: "bg-violet-50 border-violet-200",
    chip: "bg-violet-100 text-violet-800",
    bar: "bg-violet-300",
    hover: "hover:shadow-md hover:border-violet-300",
  },
  spec: {
    card: "bg-amber-50 border-amber-200",
    chip: "bg-amber-100 text-amber-800",
    bar: "bg-amber-300",
    hover: "hover:shadow-md hover:border-amber-300",
  },
};

// -------------------------------------------------------------
// Dado el texto de stage, decide a qué grupo pertenece.
// (Es robusto si cambias levemente el wording de la etapa.)
// -------------------------------------------------------------
function stageGroup(stage: string): keyof typeof GROUP_STYLES {
  if (/placement/i.test(stage)) return "placement";
  if (/iniciación/i.test(stage)) return "init";
  if (/aprendizaje/i.test(stage)) return "learn";
  if (/acad(é|e)mica/i.test(stage)) return "academic";
  return "spec"; // por defecto "Especialización"
}

// -------------------------------------------------------------
// Tarjeta aislada: usa los estilos según el grupo.
// Lleva una "barrita" de color a la izquierda para dar identidad.
// -------------------------------------------------------------
function LevelCard({ level }: { level: Level }) {
  const group = stageGroup(level.stage);
  const styles = GROUP_STYLES[group];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border p-5 transition",
        "shadow-sm", // base
        styles.card,
        styles.hover,
      ].join(" ")}
    >
      {/* Barrita de color en el borde izquierdo */}
      <span className={`pointer-events-none absolute inset-y-0 left-0 w-1 ${styles.bar}`} />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{level.title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.chip}`}>
          {level.stage}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-700">{level.desc}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Grid de niveles
// -------------------------------------------------------------
export default function ProgramLevels({ levels }: { levels: Level[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {levels.map((l) => (
        <LevelCard key={l.id} level={l} />
      ))}
    </div>
  );
}
