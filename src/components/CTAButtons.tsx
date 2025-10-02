// =============================================
// COMPONENTE: CTAButtons
// Descripción: Botones de acción reutilizables.
//  - Siempre usa el texto "Comenzar Gratis" para el CTA principal.
// Props:
//  - size: "sm" | "md" (cambia padding para barra superior / héroe)
// =============================================
"use client";

type Size = "sm" | "md";

export default function CTAButtons({ size = "md" }: { size?: Size }) {
  // Padding según tamaño: pequeño para topbar, mediano para hero
  const pad = size === "sm" ? "px-4 py-2" : "px-6 py-3";

  return (
    <div className="flex flex-wrap gap-3">
      {/* CTA principal */}
      <a
        href="/register"
        className={`rounded-2xl bg-indigo-600 ${pad} text-sm font-semibold text-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
      >
        Comenzar Gratis
      </a>

      {/* Link a login */}
      <a
        href="/login"
        className={`rounded-2xl border border-gray-300 bg-white ${pad} text-sm font-semibold text-gray-900 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
      >
        Ya tengo cuenta
      </a>
    </div>
  );
}
