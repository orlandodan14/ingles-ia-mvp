import { ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-[80vh] bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900">
          Inglés con IA — <span className="text-indigo-600">Nivel Principiante</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Practica diálogos reales con un tutor inteligente. Recibe feedback
          y avanza por lecciones A1.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <a href="/(auth)/register">Comenzar ahora <ArrowRight className="ml-2 h-4 w-4"/></a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/(auth)/login">Ya tengo cuenta <LogIn className="ml-2 h-4 w-4"/></a>
          </Button>
        </div>
      </div>
    </main>
  );
}

