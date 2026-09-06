-- Storage policies for the "menu" bucket (create the bucket first: npm run seed:menu
-- creates it, or Supabase dashboard → Storage → New bucket → name "menu", Public).
-- Apply in the Supabase SQL editor. Idempotent.

-- Public read of every object in the bucket.
drop policy if exists menu_bucket_read on storage.objects;
create policy menu_bucket_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'menu');

-- Only signed-in admins may add / change / remove images.
drop policy if exists menu_bucket_insert on storage.objects;
create policy menu_bucket_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'menu' and public.is_admin());

drop policy if exists menu_bucket_update on storage.objects;
create policy menu_bucket_update on storage.objects
  for update to authenticated
  using (bucket_id = 'menu' and public.is_admin())
  with check (bucket_id = 'menu' and public.is_admin());

drop policy if exists menu_bucket_delete on storage.objects;
create policy menu_bucket_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'menu' and public.is_admin());
