"use server";

import { createClient as supabaseServer } from "@/lib/supabase/server";

export async function resetPasswordAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { ok: false, message: "Indica tu email." };

  const supabase = supabaseServer();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Cambia por tu dominio en producción
    redirectTo: "http://localhost:3000/update-password",
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Te enviamos un correo para restablecer la contraseña." };
}
    