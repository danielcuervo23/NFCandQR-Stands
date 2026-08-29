import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewRestaurantForm from "@/components/NewRestaurantForm";
import { ChevronRight } from "lucide-react";

export default async function RestaurantsPage() {
  const supabase = await createClient();

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name, slug, contact_name, phone")
    .order("created_at", { ascending: false });

  // Conteo de stands por restaurante (una sola consulta agrupada en JS)
  const { data: standsCount } = await supabase
    .from("stands")
    .select("restaurant_id");

  const countsByRestaurant: Record<string, number> = {};
  for (const s of standsCount ?? []) {
    if (!s.restaurant_id) continue;
    countsByRestaurant[s.restaurant_id] = (countsByRestaurant[s.restaurant_id] ?? 0) + 1;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Restaurantes</h1>
          <p className="text-sm text-slate-500">
            Comercios vinculados a tus soportes físicos.
          </p>
        </div>
        <NewRestaurantForm />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {(!restaurants || restaurants.length === 0) && (
          <p className="p-5 text-sm text-slate-400">
            Aún no hay restaurantes registrados.
          </p>
        )}
        {restaurants?.map((r) => (
          <Link
            key={r.id}
            href={`/admin/restaurants/${r.id}`}
            className="flex items-center justify-between p-4 hover:bg-slate-50"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">{r.name}</p>
              <p className="text-xs text-slate-400">
                {r.slug} · {r.contact_name || "Sin contacto"}
                {r.phone ? ` · ${r.phone}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                {countsByRestaurant[r.id] ?? 0} stands
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
