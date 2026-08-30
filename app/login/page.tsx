"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Credenciales inválidas. Inténtalo de nuevo.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-surface">
      {/* Acento ambiental: arco degradado sutil, eco del ícono de marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full opacity-[0.07] blur-3xl bg-brand-gradient"
      />

      <div className="max-w-sm w-full relative">
        <div className="flex flex-col items-center mb-6">
          <Image src="/icon.png" alt="Taply" width={52} height={52} priority />
          <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-ink">
            TAPLY
          </p>
          <p className="text-xs text-ink-faint mt-0.5">
            Tap. Connect. Experience.
          </p>
        </div>

        <div className="bg-surface-alt rounded-2xl shadow-sm border border-line p-8">
          <h1 className="text-base font-semibold text-ink text-center mb-6">
            Panel administrativo
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1">
                Correo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
                placeholder="admin@tuempresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white text-sm font-medium rounded-lg py-2.5 transition-opacity"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-xs text-ink-faint text-center mt-6">
          El usuario se crea manualmente desde Supabase Dashboard &gt;
          Authentication &gt; Users.
        </p>
      </div>
    </div>
  );
}
