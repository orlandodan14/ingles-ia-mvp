// =============================================
// COMPONENTE: LogoTalkia
// Descripción: Logo temporal "Talkia — Inglés con IA"
// - SVG de burbuja de chat + triángulo "play"
// - Texto en dos líneas
// Props:
//   - className: clases tailwind opcionales para el contenedor externo
// =============================================
"use client";

export default function LogoTalkia({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Ícono SVG del logo */}
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="shrink-0">
        <defs>
          {/* Degradado para la burbuja */}
          <linearGradient id="tg" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#4f46e5" />   {/* indigo-600 */}
            <stop offset="50%" stopColor="#0ea5e9" />  {/* sky-500 */}
            <stop offset="100%" stopColor="#22c55e" /> {/* lime-500 */}
          </linearGradient>
        </defs>
        {/* Burbuja de chat */}
        <path
          d="M10 8h20c5.523 0 10 4.477 10 10v6c0 5.523-4.477 10-10 10h-6l-8 6v-6H10C4.477 34 0 29.523 0 24v-6C0 12.477 4.477 8 10 8Z"
          fill="url(#tg)"
          opacity="0.95"
        />
        {/* Triángulo "play" blanco */}
        <path d="M19 16l12 8-12 8v-16z" fill="white" />
      </svg>

      {/* Texto del logo */}
      <div className="leading-tight select-none">
        <div className="text-xl font-black tracking-tight text-gray-900">Talkia</div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
          Inglés con IA
        </div>
      </div>
    </div>
  );
}
