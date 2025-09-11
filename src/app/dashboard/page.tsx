import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  // TODO: traer progreso real del usuario
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="text-2xl font-semibold">Tu progreso</h2>
      <Card className="mt-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Nivel</p>
            <h3 className="text-lg font-semibold">A1 — Lección 1: Saludos</h3>
          </div>
          <Button asChild><a href="/lesson/1">Continuar lección</a></Button>
        </div>
        <div className="mt-4">
          <Progress value={20} />
          <p className="mt-2 text-sm text-gray-600">Avance estimado: 20%</p>
        </div>
      </Card>
    </div>
  );
}
    