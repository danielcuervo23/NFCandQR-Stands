"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStand, deleteStand } from "@/app/admin/actions";
import type { Stand } from "@/lib/types";
import { Trash2 } from "lucide-react";

export default function StandEditForm({
  stand,
  restaurants,
}: {
  stand: Stand;
  restaurants: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateStand(stand.id, formData);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar el stand "${stand.id}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      const result = await deleteStand(stand.id);
      if (result?.error) setError(result.error);
      else router.push("/admin/stands");
    });
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div>
        <label className="block text-xs text-slate-500 mb-1">Restaurante</label>
        <select
          name="restaurant_id"
          defaultValue={stand.restaurant_id ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
        <label className="block text-xs text-slate-500 mb-1">Mesa</label>
        <input
          name="table_number"
          defaultValue={stand.table_number ?? ""}
          placeholder="Mesa 4"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">
          Destino NFC (a dónde redirige al acercar el teléfono)
        </label>
        <input
          name="nfc_target_url"
          type="url"
          defaultValue={stand.nfc_target_url ?? ""}
          placeholder="https://g.page/r/tu-restaurante/review"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">
          Destino QR (a dónde redirige al escanear)
        </label>
        <input
          name="qr_target_url"
          type="url"
          defaultValue={stand.qr_target_url ?? ""}
          placeholder="https://instagram.com/tu-restaurante"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={stand.is_active}
          className="rounded border-slate-300"
        />
        Stand activo
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-sm font-medium text-red-600 px-3 py-2 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar stand
        </button>
      </div>
    </form>
  );
}
