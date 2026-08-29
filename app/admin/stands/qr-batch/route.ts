import QRCode from "qrcode";
import JSZip from "jszip";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: stands } = await supabase.from("stands").select("id");
  if (!stands || stands.length === 0) {
    return NextResponse.json({ error: "No hay stands para exportar" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const zip = new JSZip();

  for (const stand of stands) {
    const targetUrl = `${baseUrl}/r/${stand.id}?src=qr`;
    const svg = await QRCode.toString(targetUrl, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 1024,
    });
    zip.file(`${stand.id}-qr.svg`, svg);
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="qr-codes-lote.zip"`,
    },
  });
}
