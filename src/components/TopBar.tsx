// =============================================
// COMPONENTE: TopBar (barra superior fija)
// -------------------------------------------------------------
// Qué hace:
//  - Muestra el logo "Talkia" centrado al cargar.
//  - Observa el contenedor #hero-buttons del Héroe con IntersectionObserver.
//  - Cuando #hero-buttons deja de ser visible (por el scroll):
//      * Aparecen los botones de CTA ("Comenzar Gratis", "Ya tengo cuenta")
//        en el borde derecho de la barra.
//      * El logo pasa de "centrado" a "alineado a la izquierda".
//  - Usa Link (next/link) en vez de <a> para navegación interna (mejor SEO y UX).
//
// Requisitos:
//  - En el Héroe debe existir un elemento con id="hero-buttons" (ya está en tu Hero).
//  - TailwindCSS habilitado (ya lo tienes).
//
// Accesibilidad:
//  - role="banner" para el header.
//  - aria-labels y foco visual en CTAButtons (definido en ese componente).
// =============================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CTAButtons from "./CTAButtons";
import LogoTalkia from "./LogoTalkia";

export default function TopBar() {
  // Estado que controla la visibilidad de los botones en la topbar
  // true  => los botones del héroe NO se ven; mostrar botones en la barra
  // false => los botones del héroe SÍ se ven; ocultar botones en la barra
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Buscamos el contenedor de botones del héroe por su id
    const target = document.getElementById("hero-buttons");
    if (!target) return; // Si el héroe no está en la página, no observamos

    // Callback del IntersectionObserver:
    // entry.isIntersecting === true  -> el elemento es visible en el viewport
    // entry.isIntersecting === false -> el elemento salió del viewport (scrolleaste)
    const onIntersect: IntersectionObserverCallback = ([entry]) => {
      setShowButtons(!entry.isIntersecting);
    };

    // Creamos el observer. Con threshold 0 basta: en el momento que deja de intersectar, dispara.
    const observer = new IntersectionObserver(onIntersect, { threshold: 0 });

    // Comenzamos a observar el target
    observer.observe(target);

    // Limpieza al desmontar el componente
    return () => observer.disconnect();
  }, []);

  return (
    <header
      role="banner"
      className="
        sticky top-0 z-40 w-full
        border-b border-gray-200
        bg-white/70 backdrop-blur
        supports-[backdrop-filter]:bg-white/70
      "
    >
      {/* 
        Contenedor principal.
        - 'relative' nos permite posicionar el bloque de CTAs de forma absoluta a la derecha sin romper el flujo.
        - 'flex items-center' para alinear verticalmente.
      */}
      <div className="relative mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-6">
        {/* 
          Zona del logo:
          - flex-1 hace que ocupe todo el espacio disponible.
          - Cambiamos la justificación según showButtons:
              * false => justify-center (logo centrado)
              * true  => justify-start  (logo a la izquierda)
          - Transición suave para el cambio de justificación.
        */}
        <div
          className={`flex flex-1 transition-all duration-300 ${
            showButtons ? "justify-start" : "justify-center"
          }`}
        >
          {/* Usamos Link en lugar de <a> para navegación interna en Next.js */}
          <Link href="/" aria-label="Ir al inicio" className="flex items-center">
            <LogoTalkia />
          </Link>
        </div>

        {/* 
          Bloque de CTAs a la derecha.
          - Solo visible cuando showButtons === true (cuando ya no se ven los botones del héroe).
          - En móviles (xs/sm) lo escondemos para no saturar (hidden md:block).
          - Transición de opacidad y leve desplazamiento vertical para "aparecer".
        */}
        <nav
          aria-label="acciones"
          className={`
            pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 md:block
            transform transition-all duration-200 ease-out
            ${showButtons ? "pointer-events-auto opacity-100 translate-y-[-50%]" : "opacity-0 translate-y-[-40%]"}
          `}
        >
          {/* Tamaño 'sm' para botones compactos en la barra */}
          <CTAButtons size="sm" />
        </nav>
      </div>
    </header>
  );
}
