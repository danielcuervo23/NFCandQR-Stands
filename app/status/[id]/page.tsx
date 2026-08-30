import Image from "next/image";
import { Clock } from "lucide-react";

export default async function StandStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full opacity-[0.06] blur-3xl bg-brand-gradient"
      />

      <Image src="/icon.png" alt="Taply" width={44} height={44} className="mb-6 relative" />

      <div className="max-w-sm w-full bg-surface-alt rounded-2xl shadow-sm border border-line p-8 text-center relative">
        <div className="mx-auto w-14 h-14 rounded-full bg-brand-gradient-soft flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="text-lg font-semibold text-ink mb-1">
          Soporte en proceso de activación
        </h1>
        <p className="text-sm text-ink-muted mb-4">
          Este código (<span className="font-mono">{id}</span>) todavía no
          está vinculado a un restaurante o no tiene un destino configurado.
        </p>
        <p className="text-xs text-ink-faint">
          Si eres el administrador, vincula este soporte desde el panel de
          gestión.
        </p>
      </div>

      <p className="text-[11px] text-ink-faint mt-8 tracking-[0.15em]">
        TAPLY · TAP. CONNECT. EXPERIENCE.
      </p>
    </div>
  );
}
