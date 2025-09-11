"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar Supabase Auth + crear perfil
    alert(`Registro demo: ${name} / ${email}`);
  };
  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="text-2xl font-semibold">Crear cuenta</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" value={name} onChange={e=>setName(e.target.value)} required/>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" value={pass} onChange={e=>setPass(e.target.value)} required/>
        </div>
        <Button type="submit" className="w-full">Registrarme</Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        ¿Ya tienes cuenta? <a className="text-indigo-600 underline" href="/(auth)/login">Ingresar</a>
      </p>
    </div>
  );
}
