import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BatchStandForm from "@/components/BatchStandForm";
import { ChevronRight, Plus, Download } from "lucide-react";

export default async function StandsPage() {
  const supabase = await createClient();

  const { data: stands } = await supabase
    .from("stands")
    .select("id, restaurant_id, table_number, is_active, nfc_target_url, qr_target_url")
    .order("id");

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name");

  const restaurantNameById: Record<string, string> = {};
  for (const r of restaurants ?? []) restaurantNameById[r.id] = r.name;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Stands</h1>
          <p className="text-sm text-slate-500">
            Soportes físicos NFC + QR. {stands?.length ?? 0} en total.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/stands/qr-batch"
            className="flex items-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg px-3.5 py-2"
          >
            <Download className="w-4 h-4" />
            Descargar QR (.zip)
          </a>
          <BatchStandForm />
          <Link
            href="/admin/stands/new"
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-3.5 py-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo QR
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {(!stands || stands.length === 0) && (
          <p className="p-5 text-sm text-slate-400">
            Aún no hay stands. Usa &quot;Generar en lote&quot; para crear tu primer batch.
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
                {s.restaurant_id
                  ? restaurantNameById[s.restaurant_id] ?? "Restaurante desconocido"
                  : "Sin asignar"}
                {s.table_number ? ` · Mesa ${s.table_number}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!s.nfc_target_url && !s.qr_target_url && (
                <span className="text-xs bg-amber-50 text-amber-600 rounded-full px-2.5 py-1">
                  Sin configurar
                </span>
              )}
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
  );
}
