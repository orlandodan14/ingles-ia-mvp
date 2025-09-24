"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [msg, setMsg] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="text-2xl font-semibold">Ingresar</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(async () => {
            const res = await loginAction(fd);
            // Si hubo error, mostramos mensaje. Si no, el server action hace redirect.
            if (res && !res.ok) setMsg(res.message);
          });
        }}
        className="mt-4 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" className="mt-1 w-full rounded-xl border p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input name="password" type="password" className="mt-1 w-full rounded-xl border p-2" required />
        </div>

        <button
          disabled={isPending}
          className="w-full rounded-2xl bg-indigo-600 py-2 text-white disabled:opacity-60"
        >
          {isPending ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}

      <p className="mt-4 text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <a className="text-indigo-600 underline" href="/register">Crear una</a>
      </p>
      <p className="mt-1 text-sm text-gray-600">
        ¿Olvidaste tu contraseña?{" "}
        <a className="text-indigo-600 underline" href="/reset">Recuperar acceso</a>
      </p>
    </div>
  );
}
