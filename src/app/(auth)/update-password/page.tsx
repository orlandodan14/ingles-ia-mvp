'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const sp = useSearchParams();
  const router = useRouter();
  const code = sp.get('code'); // viene en el enlace del correo

  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // 1) Intercambia el código por una sesión temporal
  useEffect(() => {
    (async () => {
      if (!code) { setErr('Código inválido o faltante.'); return; }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) setErr(error.message);
    })();
  }, [code, supabase]);

  // 2) Envía nueva password
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setErr(error.message);
    setMsg('Contraseña actualizada. Redirigiendo…');
    setTimeout(() => router.push('/login'), 1200);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-4 py-10">
      <div>
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input id="password" type="password" value={password}
               onChange={(e)=>setPassword(e.target.value)} required />
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      {msg && <p className="text-green-700 text-sm">{msg}</p>}
      <Button type="submit">Actualizar contraseña</Button>
    </form>
  );
}

// =============================================
// FILE: src/app/(auth)/update-password/page.tsx  (flujo Supabase code→session)
// =============================================
// "use client";
// import { useEffect, useState, useTransition } from "react";
// import { useSearchParams } from "next/navigation";
// import { createClient as supabaseBrowser } from "@/lib/supabase/client";

// export default function UpdatePasswordPage() {
//   const sp = useSearchParams();
//   const code = sp.get("code");
//   const [ready, setReady] = useState(false);
//   const [pending, start] = useTransition();
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     const run = async () => {
//       if (!code) { setMsg("Falta el código de recuperación."); return; }
//       const supa = supabaseBrowser();
//       const { error } = await supa.auth.exchangeCodeForSession(code);
//       if (error) setMsg(error.message);
//       setReady(true);
//     };
//     run();
//   }, [code]);

//   return (
//     <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center p-6">
//       <h1 className="text-2xl font-bold">Crear nueva contraseña</h1>
//       {!ready && <p className="mt-2 text-sm text-gray-600">Validando enlace...</p>}
//       {ready && (
//         <form
//           onSubmit={(e)=>{e.preventDefault(); const fd=new FormData(e.currentTarget); const pass=String(fd.get("password")||""); start(async()=>{ const supa=supabaseBrowser(); const { error } = await supa.auth.updateUser({ password: pass }); if (error) setMsg(error.message); else window.location.href = "/dashboard"; });}}
//           className="mt-4 space-y-4"
//         >
//           <div>
//             <label className="block text-sm font-medium">Nueva contraseña</label>
//             <input name="password" type="password" required className="mt-1 w-full rounded-xl border p-2"/>
//           </div>
//           <button disabled={pending} className="w-full rounded-2xl bg-indigo-600 py-2 text-white">{pending?"Guardando...":"Guardar"}</button>
//         </form>
//       )}
//       {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
//     </div>
//   );
// }