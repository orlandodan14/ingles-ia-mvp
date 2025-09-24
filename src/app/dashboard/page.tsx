import { createClient as supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="text-2xl font-semibold">Hola, {user.user_metadata?.name || user.email}</h2>

      <form action={async () => {
        "use server";
        const s = supabaseServer();
        await s.auth.signOut();
        redirect("/"); // vuelve a Home
      }}>
        <button className="mt-3 rounded-2xl border px-3 py-1">Salir</button>
      </form>

      <div className="mt-6 rounded-2xl border p-6">
        <h3 className="text-lg font-semibold">Tu progreso</h3>
        <p className="mt-2 text-sm text-gray-600">Nivel: A1 — Lección 1 (Saludos)</p>
        <a className="mt-4 inline-block rounded-2xl bg-indigo-600 px-4 py-2 text-white" href="/lesson/1">
          Continuar lección
        </a>
      </div>
    </div>
  );
}
