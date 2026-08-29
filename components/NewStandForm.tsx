"use client";

import { useState, useTransition } from "react";
import { createSingleStand } from "@/app/admin/stands/new/actions";

export default function NewStandForm({
  restaurants,
}: {
  restaurants: { id: string; name: string }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      // createSingleStand redirige internamente si todo sale bien
      // (lanza NEXT_REDIRECT), así que solo capturamos el caso de error.
      const result = await createSingleStand(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div>
        <label className="block text-xs text-slate-500 mb-1">
          ID del stand (único, ej: stand_051)
        </label>
        <input
          name="id"
          required
          placeholder="stand_051"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Restaurante (opcional)</label>
        <select
          name="restaurant_id"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          defaultValue=""
        >
          <option value="">Sin asignar</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Mesa (opcional)</label>
        <input
          name="table_number"
          placeholder="Mesa 4"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Destino NFC (opcional)</label>
        <input
          name="nfc_target_url"
          type="url"
          placeholder="https://g.page/r/tu-restaurante/review"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Destino QR (opcional)</label>
        <input
          name="qr_target_url"
          type="url"
          placeholder="https://instagram.com/tu-restaurante"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2"
      >
        {isPending ? "Creando..." : "Crear stand"}
      </button>
    </form>
  );
}
