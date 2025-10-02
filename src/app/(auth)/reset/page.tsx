// =============================================
// FILE: src/app/(auth)/reset/page.tsx  (UI mejorada, mismas acciones)
// =============================================
"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { resetPasswordAction } from "./actions";

export default function ResetPage() {
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="grid min-h-[80vh] grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image src="/images/auth-reset.jpg" alt="Recuperar contraseña" fill className="object-cover"/>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center p-8">
        <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
        <form onSubmit={(e)=>{e.preventDefault(); const fd=new FormData(e.currentTarget); start(async()=>{ const r= await resetPasswordAction(fd); setMsg(r.message); });}} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" required className="mt-1 w-full rounded-xl border p-2"/>
          </div>
          <button disabled={pending} className="w-full rounded-2xl bg-indigo-600 py-2 text-white">{pending?"Enviando...":"Enviar enlace"}</button>
          {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
