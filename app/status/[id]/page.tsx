import { AlertCircle } from "lucide-react";

export default async function StandStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-amber-500" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900 mb-1">
          Soporte en proceso de activación
        </h1>
        <p className="text-sm text-slate-500 mb-4">
          Este código (<span className="font-mono">{id}</span>) todavía no
          está vinculado a un restaurante o no tiene un destino configurado.
        </p>
        <p className="text-xs text-slate-400">
          Si eres el administrador, vincula este soporte desde el panel de
          gestión.
        </p>
      </div>
    </div>
  );
}
