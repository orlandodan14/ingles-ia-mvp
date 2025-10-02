// =============================================
// COMPONENTE: Hero
// Descripción:
//  - Sección superior con título, descripción e imagen.
//  - SIN chip "A1 Principiantes — Gratis" (eliminado).
//  - Contiene el contenedor de botones con id="hero-buttons"
//    que usa TopBar para saber cuándo mostrar las CTAs arriba.
// =============================================
"use client";

import Image from "next/image";
import CTAButtons from "./CTAButtons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      {/* Fondo con imagen + velo en gradiente para legibilidad */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg"
          alt="Estudiantes practicando inglés"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      </div>

      {/* Contenido principal del héroe */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
        {/* Texto + CTAs */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Aprende <span className="text-indigo-600">inglés</span> hablando
            <span className="block">con IA desde el día 1</span>
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Lecciones cortas + práctica guiada con un tutor inteligente.
            Feedback en tiempo real, puntajes y progreso por niveles.
          </p>

          {/* Contenedor observado por TopBar (mismo set de botones) */}
          <div id="hero-buttons" className="mt-6">
            <CTAButtons />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Nivel A1 <strong>100% gratis</strong>. Luego podrás elegir plan mensual o comprar el curso completo.
          </p>
        </div>

        {/* Imagen de apoyo con una tarjetita demo */}
        <div className="relative hidden aspect-[4/3] md:block">
          <Image
            src="/images/hero-kids.jpg"
            alt="Clases divertidas de inglés"
            fill
            className="rounded-3xl object-cover shadow-xl ring-1 ring-black/5"
          />
          {/* Mini demo: materializable a componente si luego lo necesitas */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/90 p-3 shadow backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
              ▶
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">Di: “This is the family”</div>
              <div className="text-gray-600">Talkia te escucha y te corrige 😊</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
