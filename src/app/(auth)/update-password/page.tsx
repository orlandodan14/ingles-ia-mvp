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
