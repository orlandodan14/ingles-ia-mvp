"use server";

import { createClient as supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    return { ok: false, message: "Completa email y contraseña." };
  }

  const supabase = supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: error.message };
  }

  // Sesión creada correctamente → al dashboard
  redirect("/dashboard");
}
