import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RestaurantEditForm from "@/components/RestaurantEditForm";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!restaurant) notFound();

  const { data: stands } = await supabase
    .from("stands")
    .select("id, table_number, is_active, nfc_target_url, qr_target_url")
    .eq("restaurant_id", id)
    .order("id");

  return (
    <div className="space-y-6">
      <Link
        href="/admin/restaurants"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Restaurantes
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">{restaurant.name}</h1>
        <p className="text-sm text-slate-500">{restaurant.slug}</p>
      </div>

      <RestaurantEditForm restaurant={restaurant} />

      <div>
        <h2 className="text-sm font-medium text-slate-700 mb-2">
          Stands asignados ({stands?.length ?? 0})
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {(!stands || stands.length === 0) && (
            <p className="p-4 text-sm text-slate-400">
              Este restaurante aún no tiene stands asignados. Ve a{" "}
              <Link href="/admin/stands" className="text-brand-600 underline">
                Stands
              </Link>{" "}
              para asignarle uno.
            </p>
          )}
          {stands?.map((s) => (
            <Link
              key={s.id}
              href={`/admin/stands/${s.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 font-mono">{s.id}</p>
                <p className="text-xs text-slate-400">
                  {s.table_number ? `Mesa ${s.table_number}` : "Sin mesa asignada"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs rounded-full px-2.5 py-1 ${
                    s.is_active
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {s.is_active ? "Activo" : "Inactivo"}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
