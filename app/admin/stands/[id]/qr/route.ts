import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Nota: esta ruta vive bajo /admin y por lo tanto queda protegida por el
// middleware (requiere sesión de administrador), a diferencia de /r/[id]
// que es pública y de baja latencia.

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get("format") || "png").toLowerCase();

  // Verificamos que el usuario tenga sesión (RLS ya lo exige, pero
  // devolvemos un error claro si no).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const targetUrl = `${baseUrl}/r/${id}?src=qr`;

  if (format === "svg") {
    const svg = await QRCode.toString(targetUrl, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 1024,
    });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${id}-qr.svg"`,
      },
    });
  }

  const pngBuffer = await QRCode.toBuffer(targetUrl, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 1024,
  });

  return new NextResponse(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${id}-qr.png"`,
    },
  });
}
