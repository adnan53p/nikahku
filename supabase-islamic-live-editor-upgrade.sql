-- Islamic Luxury live editor upgrade
-- Jalankan di Supabase SQL Editor jika bucket/kolom belum siap.

alter table public.events
  add column if not exists premium_settings_json text,
  add column if not exists auto_scroll_enabled boolean default true;

-- Bucket publik untuk cover, foto mempelai, QRIS, dan galeri.
insert into storage.buckets (id, name, public)
values ('events', 'events', true)
on conflict (id) do update set public = true;

-- Policy upload/read/update/delete untuk user login.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can read event assets') then
    create policy "Public can read event assets"
    on storage.objects for select
    using (bucket_id = 'events');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated can upload event assets') then
    create policy "Authenticated can upload event assets"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'events');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated can update event assets') then
    create policy "Authenticated can update event assets"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'events')
    with check (bucket_id = 'events');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated can delete event assets') then
    create policy "Authenticated can delete event assets"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'events');
  end if;
end $$;
