"use client";

import { useState, useTransition } from "react";
import { registerAction } from "./actions";

export default function RegisterPage() {
  const [msg, setMsg] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="text-2xl font-semibold">Crear cuenta</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(async () => {
            const res = await registerAction(fd);
            setMsg(res.message);
            // Si la confirmación está OFF, registerAction hará redirect al dashboard.
            // Si está ON, te quedas aquí con el mensaje de "revisa tu correo".
          });
        }}
        className="mt-4 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            name="name"
            className="mt-1 w-full rounded-xl border p-2"
            required
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-xl border p-2"
            required
            placeholder="tucorreo@dominio.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            name="password"
            type="password"
            className="mt-1 w-full rounded-xl border p-2"
            required
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <button
          disabled={isPending}
          className="w-full rounded-2xl bg-indigo-600 py-2 text-white disabled:opacity-60"
        >
          {isPending ? "Creando..." : "Registrarme"}
        </button>
      </form>

      {msg && (
        <p className="mt-3 text-sm text-gray-700">
          {msg}
        </p>
      )}

      <p className="mt-4 text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <a className="text-indigo-600 underline" href="/login">
          Ingresar
        </a>
      </p>
    </div>
  );
}
