"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStandsBatch } from "@/app/admin/actions";
import { Layers } from "lucide-react";

export default function BatchStandForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await createStandsBatch(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSuccess(`Se crearon ${result.count} stands correctamente.`);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg px-3.5 py-2"
      >
        <Layers className="w-4 h-4" />
        Generar en lote
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
      <h3 className="text-sm font-medium text-slate-700 mb-1">
        Generar stands en lote
      </h3>
      <p className="text-xs text-slate-400 mb-3">
        Ej: prefijo <span className="font-mono">stand_</span>, del 1 al 50,
        relleno 3 → <span className="font-mono">stand_001 … stand_050</span>
      </p>
      <form action={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Prefijo</label>
          <input
            name="prefix"
            defaultValue="stand_"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Desde</label>
          <input
            name="from"
            type="number"
            min={1}
            defaultValue={1}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Hasta</label>
          <input
            name="to"
            type="number"
            min={1}
            defaultValue={50}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Relleno (dígitos)</label>
          <input
            name="padding"
            type="number"
            min={1}
            max={6}
            defaultValue={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600 col-span-2 md:col-span-4">{error}</p>}
        {success && <p className="text-sm text-emerald-600 col-span-2 md:col-span-4">{success}</p>}

        <div className="flex gap-2 col-span-2 md:col-span-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            {isPending ? "Generando..." : "Generar stands"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-slate-500 px-4 py-2"
          >
            Cerrar
          </button>
        </div>
      </form>
    </div>
  );
}
