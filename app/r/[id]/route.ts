import { createAdminClient } from "@/lib/supabase/server";
import type { Source } from "@/lib/types";

// Edge Runtime = mínima latencia posible para la redirección física.
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const srcParam = searchParams.get("src");
  const source: Source = srcParam === "nfc" ? "nfc" : "qr";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const supabase = createAdminClient();

  const { data: stand, error } = await supabase
    .from("stands")
    .select("id, is_active, nfc_target_url, qr_target_url")
    .eq("id", id)
    .maybeSingle();

  // Soporte inexistente o inactivo → página de estado / activación.
  if (error || !stand || !stand.is_active) {
    return Response.redirect(`${baseUrl}/status/${id}`, 307);
  }

  const targetUrl = source === "nfc" ? stand.nfc_target_url : stand.qr_target_url;

  // Aún no se configuró destino para esa fuente → página de estado.
  if (!targetUrl) {
    return Response.redirect(`${baseUrl}/status/${id}`, 307);
  }

  // Registro de analytics: se espera el insert (una sola fila, overhead
  // mínimo en Edge) pero envuelto en try/catch para que un fallo de
  // analytics NUNCA impida la redirección al comensal.
  // Nota: en Edge Runtime, una promesa "fire-and-forget" sin await puede
  // cortarse en cuanto se envía la respuesta, por eso sí se espera aquí.
  try {
    await supabase.from("analytics_events").insert({
      stand_id: stand.id,
      source,
      target_url: targetUrl,
      user_agent: request.headers.get("user-agent") ?? undefined,
    });
  } catch {
    // no-op: nunca bloqueamos la redirección por un error de analytics
  }

  return Response.redirect(targetUrl, 307);
}
