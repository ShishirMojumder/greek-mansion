-- Greek Mansion CMS — Phase 1 schema, RLS, triggers.
-- Apply in the Supabase SQL editor, or: supabase db push
-- Idempotent: safe to run more than once.

create extension if not exists pgcrypto;

-- ============================================================================
-- enums
-- ============================================================================
do $$ begin
  create type availability_status as enum
    ('available', 'sold_out_today', 'temporarily_unavailable', 'hidden');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- helpers
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ============================================================================
-- admins  (authorization list; rows created only via service_role / scripts)
-- ============================================================================
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists admins_select_self on public.admins;
create policy admins_select_self on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- security definer so RLS on admins doesn't recurse when checking membership
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ============================================================================
-- menu_categories
-- ============================================================================
create table if not exists public.menu_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_menu_categories_updated on public.menu_categories;
create trigger trg_menu_categories_updated
  before update on public.menu_categories
  for each row execute function public.set_updated_at();

alter table public.menu_categories enable row level security;

drop policy if exists menu_categories_read on public.menu_categories;
create policy menu_categories_read on public.menu_categories
  for select to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists menu_categories_write on public.menu_categories;
create policy menu_categories_write on public.menu_categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- menu_items
-- ============================================================================
create table if not exists public.menu_items (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid not null references public.menu_categories(id) on delete restrict,
  name           text not null,
  slug           text not null,
  description    text,
  price_cents    int check (price_cents is null or price_cents >= 0),
  image_url      text,
  availability   availability_status not null default 'available',
  sold_out_until timestamptz,
  is_featured    boolean not null default false,
  is_published   boolean not null default true,
  badge          text check (badge in ('popular', 'new', 'chef', 'special')),
  starts_at      timestamptz,
  ends_at        timestamptz,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists idx_menu_items_category on public.menu_items(category_id);

drop trigger if exists trg_menu_items_updated on public.menu_items;
create trigger trg_menu_items_updated
  before update on public.menu_items
  for each row execute function public.set_updated_at();

alter table public.menu_items enable row level security;

drop policy if exists menu_items_read on public.menu_items;
create policy menu_items_read on public.menu_items
  for select to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists menu_items_write on public.menu_items;
create policy menu_items_write on public.menu_items
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- menu_item_variants  (sizes / combo options; every item has >= 1)
-- ============================================================================
create table if not exists public.menu_item_variants (
  id           uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  name         text not null default '',
  price_cents  int not null check (price_cents >= 0),
  sort_order   int not null default 0,
  is_available boolean not null default true
);

create index if not exists idx_variants_item on public.menu_item_variants(menu_item_id);

alter table public.menu_item_variants enable row level security;

drop policy if exists menu_variants_read on public.menu_item_variants;
create policy menu_variants_read on public.menu_item_variants
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.menu_items i
      where i.id = menu_item_id and i.is_published
    )
  );

drop policy if exists menu_variants_write on public.menu_item_variants;
create policy menu_variants_write on public.menu_item_variants
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- menu_audit  (lightweight change log; admin-read only)
-- ============================================================================
create table if not exists public.menu_audit (
  id          bigint generated always as identity primary key,
  item_id     uuid,
  item_name   text,
  field       text,
  old_value   text,
  new_value   text,
  actor_email text,
  created_at  timestamptz not null default now()
);

alter table public.menu_audit enable row level security;

drop policy if exists menu_audit_read on public.menu_audit;
create policy menu_audit_read on public.menu_audit
  for select to authenticated using (public.is_admin());

drop policy if exists menu_audit_insert on public.menu_audit;
create policy menu_audit_insert on public.menu_audit
  for insert to authenticated with check (public.is_admin());
