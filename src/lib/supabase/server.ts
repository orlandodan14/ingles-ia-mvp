// src/lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export const createClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // En Server Actions / Route Handlers sí podemos mutar cookies.
          // En Server Components es read-only: silenciamos el tipo.
          try {
            // @ts-expect-error - set existe en contextos mutables
            cookies().set({ name, value, ...options })
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            // @ts-expect-error - set existe en contextos mutables
            cookies().set({ name, value: '', ...options })
          } catch {}
        },
      },
    }
  )
}
