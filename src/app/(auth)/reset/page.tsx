"use client";
import { useState, useTransition } from "react";
import { resetPasswordAction } from "./actions";

export default function ResetPage() {
  const [msg, setMsg] = useState(""); const [isPending, start] = useTransition();

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="text-2xl font-semibold">Recuperar contraseña</h2>
      <form onSubmit={(e)=>{e.preventDefault(); const fd=new FormData(e.currentTarget); start(async()=>{ const r=await resetPasswordAction(fd); setMsg(r.message); });}} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-xl border p-2"/>
        </div>
        <button disabled={isPending} className="w-full rounded-2xl bg-indigo-600 py-2 text-white">
          {isPending ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
