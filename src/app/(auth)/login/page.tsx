// =============================================
// FILE: src/app/login/page.tsx  (UI mejorada)
// =============================================
"use client";
import { useTransition, useState } from "react";
import Image from "next/image";
import { loginAction } from "./actions";

export function LoginPage() {
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  return (
    <div className="grid min-h-[80vh] grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image src="/images/auth-login.jpg" alt="Inicia sesión" fill className="object-cover"/>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center p-8">
        <h1 className="text-2xl font-bold">Ingresar</h1>
        <form
          onSubmit={(e)=>{e.preventDefault(); const fd=new FormData(e.currentTarget); start(async()=>{ const r = await loginAction(fd); if (r && !r.ok) setMsg(r.message); });}}
          className="mt-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" required className="mt-1 w-full rounded-xl border p-2"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input name="password" type="password" required className="mt-1 w-full rounded-xl border p-2"/>
          </div>
          <button disabled={pending} className="w-full rounded-2xl bg-indigo-600 py-2 text-white">{pending?"Ingresando...":"Entrar"}</button>
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <p className="text-sm text-gray-600">¿No tienes cuenta? <a className="text-indigo-600 underline" href="/register">Crear una</a></p>
          <p className="text-sm text-gray-600">¿Olvidaste tu contraseña? <a className="text-indigo-600 underline" href="/reset">Recuperar acceso</a></p>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
