import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewStandForm from "@/components/NewStandForm";
import { ArrowLeft } from "lucide-react";

export default async function NewStandPage() {
  const supabase = await createClient();
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-6 max-w-xl">
      <Link
        href="/admin/stands"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Stands
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">Nuevo stand</h1>
        <p className="text-sm text-slate-500">
          Crea un único stand con un ID específico. Para crear muchos a la
          vez, usa &quot;Generar en lote&quot; desde el listado.
        </p>
      </div>

      <NewStandForm restaurants={restaurants ?? []} />
    </div>
  );
}
