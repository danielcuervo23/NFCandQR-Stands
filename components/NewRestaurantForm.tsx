"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRestaurant } from "@/app/admin/actions";
import { Plus } from "lucide-react";

export default function NewRestaurantForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createRestaurant(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-3.5 py-2"
      >
        <Plus className="w-4 h-4" />
        Nuevo restaurante
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
      <h3 className="text-sm font-medium text-slate-700 mb-3">
        Nuevo restaurante
      </h3>
      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="name"
          required
          placeholder="Nombre del restaurante"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="slug"
          required
          placeholder="slug-unico"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="contact_name"
          placeholder="Persona de contacto"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="phone"
          placeholder="Teléfono"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="address"
          placeholder="Dirección"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
        />

        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            {isPending ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-slate-500 px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
