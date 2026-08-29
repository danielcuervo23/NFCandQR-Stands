-- =========================================================
-- NFC/QR STANDS - SCHEMA COMPLETO PARA SUPABASE
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- =========================================================

-- Extensión necesaria para uuid_generate_v4() (normalmente ya viene activa en Supabase)
create extension if not exists "uuid-ossp";

-- =========================================================
-- 1. TABLA: restaurants
-- =========================================================
create table if not exists public.restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  contact_name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

comment on table public.restaurants is 'Comercios/restaurantes que reciben soportes físicos';

-- =========================================================
-- 2. TABLA: stands
-- =========================================================
create table if not exists public.stands (
  id text primary key, -- ej: 'stand_001'
  restaurant_id uuid references public.restaurants(id) on delete set null,
  table_number text,
  nfc_target_url text,
  qr_target_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.stands is 'Soportes físicos con NFC + QR independientes';

-- Índice para acelerar el filtro por restaurante en el panel admin
create index if not exists idx_stands_restaurant_id on public.stands(restaurant_id);

-- Trigger para mantener updated_at al día
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_stands_updated_at on public.stands;
create trigger trg_stands_updated_at
before update on public.stands
for each row execute function public.set_updated_at();

-- =========================================================
-- 3. TABLA: analytics_events
-- =========================================================
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  stand_id text not null references public.stands(id) on delete cascade,
  source text not null check (source in ('nfc', 'qr')),
  target_url text,
  user_agent text,
  created_at timestamptz not null default now()
);

comment on table public.analytics_events is 'Registro de cada escaneo/toque NFC o QR';

-- Índices para que el dashboard (agregaciones por fecha / stand / source) sea rápido
create index if not exists idx_events_stand_id on public.analytics_events(stand_id);
create index if not exists idx_events_created_at on public.analytics_events(created_at);
create index if not exists idx_events_source on public.analytics_events(source);

-- =========================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =========================================================

alter table public.restaurants enable row level security;
alter table public.stands enable row level security;
alter table public.analytics_events enable row level security;

-- ---------- restaurants ----------
-- Solo usuarios autenticados (el admin) pueden leer/escribir restaurantes.
drop policy if exists "restaurants_select_auth" on public.restaurants;
create policy "restaurants_select_auth"
  on public.restaurants for select
  to authenticated
  using (true);

drop policy if exists "restaurants_insert_auth" on public.restaurants;
create policy "restaurants_insert_auth"
  on public.restaurants for insert
  to authenticated
  with check (true);

drop policy if exists "restaurants_update_auth" on public.restaurants;
create policy "restaurants_update_auth"
  on public.restaurants for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "restaurants_delete_auth" on public.restaurants;
create policy "restaurants_delete_auth"
  on public.restaurants for delete
  to authenticated
  using (true);

-- ---------- stands ----------
-- Lectura pública SOLO de las columnas necesarias para redirigir se hace vía
-- Route Handler con la Service Role Key (bypassa RLS), así que aquí NO
-- exponemos lectura pública de stands; solo el admin autenticado gestiona.
drop policy if exists "stands_select_auth" on public.stands;
create policy "stands_select_auth"
  on public.stands for select
  to authenticated
  using (true);

drop policy if exists "stands_insert_auth" on public.stands;
create policy "stands_insert_auth"
  on public.stands for insert
  to authenticated
  with check (true);

drop policy if exists "stands_update_auth" on public.stands;
create policy "stands_update_auth"
  on public.stands for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "stands_delete_auth" on public.stands;
create policy "stands_delete_auth"
  on public.stands for delete
  to authenticated
  using (true);

-- ---------- analytics_events ----------
-- Inserción pública controlada: cualquiera (usuario anónimo escaneando el QR/NFC)
-- puede insertar un evento, pero NUNCA leer/editar/borrar eventos.
drop policy if exists "events_insert_public" on public.analytics_events;
create policy "events_insert_public"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

drop policy if exists "events_select_auth" on public.analytics_events;
create policy "events_select_auth"
  on public.analytics_events for select
  to authenticated
  using (true);

-- No se permite update/delete de eventos por nadie (integridad de las métricas).

-- =========================================================
-- 5. VISTAS DE APOYO PARA EL DASHBOARD (opcional pero útil)
-- =========================================================

-- Clics totales por stand y por fuente
create or replace view public.v_stand_click_totals as
select
  stand_id,
  source,
  count(*) as total_clicks
from public.analytics_events
group by stand_id, source;

-- Clics por día (últimos eventos agregados por fecha)
create or replace view public.v_clicks_by_day as
select
  date_trunc('day', created_at) as day,
  source,
  count(*) as total_clicks
from public.analytics_events
group by 1, 2
order by 1 desc;

-- Las vistas heredan RLS de las tablas base automáticamente en Postgres
-- moderno vía "security_invoker"; si tu versión no lo hace por defecto, descomenta:
-- alter view public.v_stand_click_totals set (security_invoker = true);
-- alter view public.v_clicks_by_day set (security_invoker = true);

-- =========================================================
-- FIN DEL SCRIPT
-- =========================================================
