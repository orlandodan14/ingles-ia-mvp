// src/app/(auth)/register/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient as supabaseServer } from '@/lib/supabase/server'

export async function registerAction(formData: FormData) {
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  const supabase = supabaseServer()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // user_metadata
      emailRedirectTo: 'http://localhost:3000/auth/callback', // ajusta si quieres
    },
  })

  if (error) return { ok: false, message: error.message }

  // const user = signUpData.user  // si lo necesitas
  revalidatePath('/dashboard')
  return { ok: true, message: 'Registro exitoso. Revisa tu correo si te pide confirmación.' }
}

