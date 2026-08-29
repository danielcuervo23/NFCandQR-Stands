import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas excepto:
     * - _next/static, _next/image, favicon.ico
     * - la ruta pública de redirección /r/[id] (debe ser lo más rápida posible)
     */
    "/((?!_next/static|_next/image|favicon.ico|r/).*)",
  ],
};
