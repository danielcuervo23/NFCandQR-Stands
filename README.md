# NFC/QR Stands

Panel para gestionar soportes físicos de acrílico con chip NFC + código QR
independientes, redirección ultrarrápida (Edge, 307) y registro de métricas.

## 1. Estructura del proyecto

```
app/
  r/[id]/route.ts          -> Redirección pública NFC/QR (Edge Runtime)
  status/[id]/page.tsx     -> Página "soporte en activación"
  login/page.tsx           -> Login del admin (fuera del layout /admin)
  admin/
    layout.tsx             -> Layout con navegación (protegido por middleware)
    page.tsx                -> Dashboard
    actions.ts               -> Server Actions (CRUD, batch, stats)
    restaurants/
      page.tsx               -> Listado
      [id]/page.tsx           -> Detalle + stands asignados
    stands/
      page.tsx               -> Listado + descarga ZIP de QRs
      new/                    -> Alta de un stand individual
      [id]/
        page.tsx              -> Edición + preview QR
        qr/route.ts           -> Descarga SVG/PNG del QR de ese stand
      qr-batch/route.ts        -> Descarga ZIP con todos los QR (SVG)
components/                   -> Formularios y UI reutilizable
lib/
  supabase/
    client.ts                 -> Cliente para Client Components
    server.ts                 -> Cliente para Server Components/Actions + admin
    middleware.ts              -> Refresco de sesión + protección de /admin
  types.ts                     -> Tipos de dominio y Database
middleware.ts                  -> Middleware raíz de Next.js
supabase/schema.sql             -> Script SQL completo (tablas + RLS + vistas)
```

## 2. Crear el proyecto en Supabase

1. Ve a https://supabase.com/dashboard y crea un proyecto nuevo.
2. Entra a **SQL Editor** → **New query**, pega el contenido de
   `supabase/schema.sql` y ejecútalo. Esto crea las tablas `restaurants`,
   `stands`, `analytics_events`, sus políticas RLS y dos vistas de apoyo.
3. Ve a **Authentication → Users → Add user** y crea tu usuario
   administrador (email + contraseña). Este es el único usuario que podrá
   entrar al panel `/admin`.
4. Ve a **Project Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (¡nunca la expongas al cliente!)

## 3. Configurar variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 4. Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000 → redirige automáticamente a `/admin` → como no
hay sesión, el middleware te lleva a `/login`. Entra con el usuario que
creaste en Supabase.

## 5. Despliegue en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En https://vercel.com/new, importa el repositorio.
3. En **Environment Variables**, agrega las mismas 4 variables del paso 3,
   pero con `NEXT_PUBLIC_BASE_URL` apuntando a tu dominio final de Vercel,
   por ejemplo `https://nfc-qr-stands.vercel.app` (o tu dominio propio si
   ya lo conectaste en Vercel → Settings → Domains).
4. Despliega. La ruta `/app/r/[id]/route.ts` se ejecuta en el Edge Runtime
   de Vercel automáticamente gracias a `export const runtime = "edge"`.

## 6. Flujo de fabricación de un lote nuevo

1. En `/admin/stands`, usa **"Generar en lote"** para crear, por ejemplo,
   `stand_001` a `stand_050`.
2. Entra a cada stand (o dile al equipo de diseño que reserve los IDs) y
   descarga el **QR en SVG** desde su página de detalle, o descarga el
   **ZIP completo** con "Descargar QR (.zip)" desde el listado para
   mandarlo de una vez al taller de corte láser / impresión UV.
3. El chip NFC de cada soporte debe grabarse (vía tu programador NFC/app
   móvil) con la URL: `https://tu-dominio/r/[id]?src=nfc`.
4. Cuando el restaurante firme contrato, entra al stand correspondiente,
   asígnalo al restaurante y configura `nfc_target_url` (normalmente
   Google Reviews) y `qr_target_url` (normalmente menú digital o
   Instagram) — pueden apuntar al mismo lugar si así lo prefieres.
5. Mientras un stand no tenga restaurante o URLs configuradas, cualquier
   escaneo cae en la página `/status/[id]` ("Soporte en proceso de
   activación").

## 7. Notas de seguridad

- La tabla `analytics_events` permite `INSERT` público (anónimo) pero
  **nunca** `SELECT/UPDATE/DELETE` público — solo el admin autenticado
  puede leer las métricas.
- `stands` y `restaurants` solo son legibles/editables por el usuario
  autenticado (RLS `to authenticated`).
- La ruta de redirección `/r/[id]` usa la **Service Role Key** en el
  servidor (bypassa RLS) porque necesita leer los stands para redirigir
  sin requerir login del comensal; esa clave nunca se envía al navegador.
