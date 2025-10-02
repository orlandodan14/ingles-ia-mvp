// =============================================
// PÁGINA: Home pública (Talkia)
// Estructura:
//  - TopBar (logo centrado + CTAs que aparecen al scrollear)
//  - Hero
//  - Secciones: About / Program / Pricing / Teachers / Testimonials / Gallery / Contact / Footer
// Nota: Puedes seguir modulando en componentes si lo prefieres.
// =============================================

import Image from "next/image";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import LogoTalkia from "@/components/LogoTalkia";
import ProgramLevels from "@/components/ProgramLevels";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Barra superior fija */}
      <TopBar />

      {/* Héroe */}
      <Hero />

      {/* ABOUT COURSE */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/about-1.jpg"
              alt="Aprendizaje con IA"
              fill
              className="rounded-3xl object-cover shadow"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Cómo funciona</h2>
            <p className="mt-3 text-gray-700">
              Inspirado en la nueva tendencia y adaptado a una experiencia moderna con IA: teoría breve,
              ejemplos claros y práctica conversacional enfocada en la lección.
            </p>
            <ul className="mt-6 grid gap-3 text-gray-700">
              <li>• Programa alineado al MCER (A1→C2)</li>
              <li>• Tutor de IA que guía y corrige con amabilidad</li>
              <li>• Rúbrica con puntaje para desbloquear lecciones</li>
              <li>• Certificado al finalizar etapas clave</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="bg-gradient-to-b from-white to-sky-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-900">Programa por niveles</h2>
          <p className="mt-2 text-gray-600">
            Recorrido sugerido (puedes hacer un test de ubicación para empezar desde tu nivel).
          </p>

          {/* Nuevo grid coloreado */}
          <ProgramLevels levels={PROGRAM_LEVELS} />
        </div>
      </section>


      {/* PRICING */}
      <section id="pricing" className="bg-gradient-to-b from-white to-lime-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-900">Planes</h2>
          <p className="mt-2 text-gray-600">
            Empieza gratis en A1. Cuando quieras, pasa al plan mensual o adquiere el curso completo.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <PricingCard
              highlight
              title="Principiantes A1"
              price="Gratis"
              features={[
                "Lecciones A1",
                "Chat con IA enfocado",
                "Feedback y puntajes",
                "Acceso al tablero de progreso",
              ]}
              ctaText="Comenzar Gratis"
              ctaHref="/register"
            />
            <PricingCard
              title="Plan Mensual"
              price="$ XX / mes"
              features={[
                "Todos los niveles activos",
                "Actualizaciones y nuevos módulos",
                "Soporte por email",
              ]}
              ctaText="Comenzar Gratis"
              ctaHref="/register"
            />
            <PricingCard
              title="Curso Completo"
              price="$ XX único"
              features={["Acceso de por vida", "A1–C2 completos", "Certificados por etapa"]}
              ctaText="Comenzar Gratis"
              ctaHref="/register"
            />
          </div>
          <p className="mt-4 text-xs text-gray-500">
            *Los valores se publicarán al abrir niveles superiores. El A1 se mantendrá gratuito.
          </p>
        </div>
      </section>

      {/* TEACHERS */}
      <section id="teachers" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Profesores &amp; Mentores</h2>
        <p className="mt-2 text-gray-600">
          Equipo con experiencia en enseñanza de inglés y diseño instruccional.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEACHERS.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="relative mb-4 aspect-[4/3]">
                <Image src={t.photo} alt={t.name} fill className="rounded-xl object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
              <p className="text-sm text-gray-600">{t.role}</p>
              <p className="mt-2 text-sm text-gray-600">{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-900">Testimonios</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((q) => (
              <figure
                key={q.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <blockquote className="text-gray-800">“{q.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-medium text-gray-700">— {q.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Galería</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {GALLERY.map((g) => (
            <div key={g} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={g} alt="Galería del curso" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="bg-gradient-to-t from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-gray-900">Contacto</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-gray-700">Escríbenos para consultas, alianzas o soporte.</p>
              <ul className="mt-4 text-sm text-gray-700">
                <li><strong>Email:</strong> contacto@ingles-ia.app</li>
                <li><strong>Horario:</strong> Lun–Vie 9:00–18:00 (GMT-3)</li>
              </ul>
            </div>
            <form className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-3">
                <input className="rounded-xl border p-2" placeholder="Tu nombre" />
                <input type="email" className="rounded-xl border p-2" placeholder="Tu email" />
                <textarea className="min-h-[120px] rounded-xl border p-2" placeholder="Mensaje" />
                <button className="rounded-2xl bg-indigo-600 px-5 py-2 text-white">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <LogoTalkia className="h-7" />
            <span>© {new Date().getFullYear()} Talkia. Aprende hablando.</span>
          </div>
          <div className="flex gap-4">
            <a href="#program" className="hover:text-gray-900">Programa</a>
            <a href="#pricing" className="hover:text-gray-900">Planes</a>
            <a href="#contacts" className="hover:text-gray-900">Contacto</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ========================
// Datos auxiliares
// ========================
const PROGRAM_LEVELS = [
  { id: "placement", stage: "Placement Test", title: "Examen de Nivel y Ubicación", desc: "Evalúa tu nivel para empezar donde corresponde." },
  { id: "init", stage: "Etapa Iniciación", title: "Iniciación", desc: "Primeros pasos y confianza básica." },
  { id: "a1", stage: "Principiantes", title: "A1 — Principiantes (Gratis)", desc: "Saludos, presentaciones, vocabulario esencial y estructuras básicas." },
  { id: "a2", stage: "Etapa Aprendizaje", title: "A2 — Básico a Intermedio Bajo", desc: "Rutinas, descripciones, pasado simple, conversaciones cotidianas." },
  { id: "b1p1", stage: "Etapa Aprendizaje", title: "B1 — Intermedio (Primera parte)", desc: "Mayor fluidez y comprensión. Vocabulario ampliado para situaciones reales." },
  { id: "b1p2", stage: "Etapa Aprendizaje", title: "B1 — Avanzado Conversacional (Segunda parte)", desc: "Conversación extendida, opiniones y matices." },
  { id: "b2", stage: "Etapa Académica", title: "B2 — FCE", desc: "Preparación académica intermedia-alta." },
  { id: "c1", stage: "Etapa Académica", title: "C1 — CAE", desc: "Dominio avanzado para contextos profesionales y académicos." },
  { id: "c2", stage: "Etapa Académica", title: "C2 — CPE", desc: "Máximo dominio del idioma, precisión y naturalidad." },
  { id: "toefl", stage: "Etapa Académica", title: "TOEFL Test", desc: "Entrenamiento para examen internacional." },
  { id: "biz", stage: "Especialización", title: "Inglés de Negocios (Avanzado)", desc: "Reuniones, presentaciones, negociación y correos profesionales." },
  { id: "pron", stage: "Especialización", title: "Pronunciación en Inglés", desc: "Sonidos, acentuación y entonación natural." },
  { id: "writing", stage: "Especialización", title: "Redacción en Inglés", desc: "Escritura de emails, informes y textos argumentativos." },
  { id: "speaking", stage: "Especialización", title: "Conversación en Inglés", desc: "Confianza, fluidez y escucha activa." },
  { id: "a2deaf", stage: "Especialización", title: "A2 para Sordos e Hipoacúsicos", desc: "Adaptaciones visuales y ritmo adecuado." },
];

function PricingCard({
  title,
  price,
  features,
  ctaText,
  ctaHref,
  highlight,
}: {
  title: string;
  price: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${highlight ? "border-indigo-300 bg-white" : "border-gray-200 bg-white"}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-2 text-3xl font-extrabold text-gray-900">{price}</div>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <a href={ctaHref} className="mt-6 inline-block rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">
        {ctaText}
      </a>
    </div>
  );
}

const TEACHERS = [
  { id: 1, name: "María López", role: "Teacher & Coach", photo: "/images/teacher-1.jpg", bio: "10+ años en A1–B2. Enfoque comunicativo y confianza al hablar." },
  { id: 2, name: "James Carter", role: "Academic Designer", photo: "/images/teacher-2.jpg", bio: "Diseño instruccional y evaluación por rúbricas." },
  { id: 3, name: "Lucía Pérez", role: "Pronunciation Mentor", photo: "/images/teacher-3.jpg", bio: "Pronunciación y entonación para un sonido natural." },
];

const TESTIMONIALS = [
  { id: 1, quote: "Con la práctica con IA perdí el miedo a hablar.", author: "Daniel P." },
  { id: 2, quote: "Las lecciones son cortas y muy claras.", author: "Antonia G." },
  { id: 3, quote: "El puntaje me ayudó a ver mis avances semana a semana.", author: "Camila R." },
];

const GALLERY = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
];
