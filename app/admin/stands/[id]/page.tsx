import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StandEditForm from "@/components/StandEditForm";
import StandQrPanel from "@/components/StandQrPanel";
import { ArrowLeft } from "lucide-react";

export default async function StandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: stand } = await supabase
    .from("stands")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!stand) notFound();

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name")
    .order("name");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/stands"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Stands
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-slate-900 font-mono">{stand.id}</h1>
        <p className="text-sm text-slate-500">
          Configura los destinos independientes de NFC y QR para este soporte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <StandEditForm stand={stand} restaurants={restaurants ?? []} />
        <StandQrPanel standId={stand.id} baseUrl={baseUrl} />
      </div>
    </div>
  );
}
