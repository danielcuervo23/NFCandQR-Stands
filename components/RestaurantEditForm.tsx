"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRestaurant, deleteRestaurant } from "@/app/admin/actions";
import type { Restaurant } from "@/lib/types";
import { Trash2 } from "lucide-react";

export default function RestaurantEditForm({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateRestaurant(restaurant.id, formData);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${restaurant.name}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      const result = await deleteRestaurant(restaurant.id);
      if (result?.error) setError(result.error);
      else router.push("/admin/restaurants");
    });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Nombre</label>
          <input
            name="name"
            defaultValue={restaurant.name}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Slug (no editable)</label>
          <input
            disabled
            value={restaurant.slug}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Contacto</label>
          <input
            name="contact_name"
            defaultValue={restaurant.contact_name ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Teléfono</label>
          <input
            name="phone"
            defaultValue={restaurant.phone ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-slate-500 mb-1">Dirección</label>
          <input
            name="address"
            defaultValue={restaurant.address ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

        <div className="flex items-center justify-between md:col-span-2 pt-1">
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
            Eliminar restaurante
          </button>
        </div>
      </form>
    </div>
  );
}
