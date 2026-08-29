import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types";

/**
 * Cliente de Supabase para Server Components / Server Actions.
 * Usa la sesión del usuario (cookies) y por lo tanto respeta RLS
 * como usuario "authenticated".
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se puede ignorar si se llama desde un Server Component;
            // el middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}

/**
 * Cliente "admin" con la Service Role Key. BYPASSA RLS por completo.
 * Úsalo SOLO en código de servidor de confianza (ej. app/r/[id]/route.ts
 * para registrar analytics de forma pública y controlada).
 * NUNCA lo importes en un componente cliente.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
