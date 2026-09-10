-- ============================================================================
-- catering_enquiries
-- Public catering requests from the website form. Anyone may insert one;
-- only admins can read, update or delete them.
-- ============================================================================

create table if not exists public.catering_enquiries (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  phone        text not null,
  event_date   text not null,
  guest_count  text not null,
  event_type   text not null,
  message      text,
  -- follow-up state, owned by the admin screen
  status       text not null default 'new'
                 check (status in ('new', 'contacted', 'booked', 'closed')),
  handled_at   timestamptz,
  handled_by   text
);

create index if not exists catering_enquiries_created_idx
  on public.catering_enquiries (created_at desc);
create index if not exists catering_enquiries_status_idx
  on public.catering_enquiries (status);

alter table public.catering_enquiries enable row level security;

-- The form is public, so anonymous visitors may file an enquiry — and nothing
-- else. No select policy for anon means a submitter cannot read the table back.
drop policy if exists catering_enquiries_insert on public.catering_enquiries;
create policy catering_enquiries_insert on public.catering_enquiries
  for insert to anon, authenticated
  with check (true);

drop policy if exists catering_enquiries_read on public.catering_enquiries;
create policy catering_enquiries_read on public.catering_enquiries
  for select to authenticated
  using (public.is_admin());

drop policy if exists catering_enquiries_write on public.catering_enquiries;
create policy catering_enquiries_write on public.catering_enquiries
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists catering_enquiries_delete on public.catering_enquiries;
create policy catering_enquiries_delete on public.catering_enquiries
  for delete to authenticated
  using (public.is_admin());
