-- ============================================================
-- INVITELY FEATURE MIGRATION
-- Upload foto, theme_slug, guest URL ?to=, publish/draft, storage policies
-- Jalankan di Supabase SQL Editor setelah schema utama.
-- ============================================================

-- 1) Kolom tambahan untuk template & media
ALTER TABLE public.themes ADD COLUMN IF NOT EXISTS slug TEXT;
UPDATE public.themes SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL OR slug = '';
CREATE UNIQUE INDEX IF NOT EXISTS themes_slug_unique ON public.themes(slug);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS theme_slug TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS bride_photo_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS groom_photo_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS qris_image_url TEXT;

UPDATE public.events e
SET theme_slug = t.slug
FROM public.themes t
WHERE e.theme_id = t.id AND (e.theme_slug IS NULL OR e.theme_slug = '');

-- 2) Tema bawaan
INSERT INTO public.themes (name, slug, preview_image_url, primary_color, secondary_color, accent_color, font_heading, font_body, is_premium, is_active)
VALUES
('Islamic Luxury', 'islamic-luxury', '', '#D4A847', '#0A0A0A', '#050505', 'Playfair Display', 'Cormorant Garamond', false, true),
('Classic Elegant', 'classic-elegant', '', '#D4A017', '#F7E7CE', '#1A1A2E', 'Playfair Display', 'Cormorant Garamond', false, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  is_active = true;

-- 3) Pastikan user auth yang sudah terdaftar punya row di public.users
INSERT INTO public.users (id, email, full_name, role, plan)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  'client',
  'free'
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id);

-- 4) Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true), ('galleries', 'galleries', true), ('music', 'music', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5) Policy storage yang lebih sederhana untuk development/production awal
DROP POLICY IF EXISTS "events_storage_owner" ON storage.objects;
DROP POLICY IF EXISTS "events_storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "events_storage_authenticated_write" ON storage.objects;
DROP POLICY IF EXISTS "galleries_storage_owner" ON storage.objects;
DROP POLICY IF EXISTS "galleries_storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "galleries_storage_authenticated_write" ON storage.objects;
DROP POLICY IF EXISTS "music_storage_owner" ON storage.objects;
DROP POLICY IF EXISTS "music_storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "music_storage_authenticated_write" ON storage.objects;

CREATE POLICY "events_storage_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "events_storage_authenticated_write" ON storage.objects FOR ALL USING (bucket_id = 'events' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "galleries_storage_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'galleries');
CREATE POLICY "galleries_storage_authenticated_write" ON storage.objects FOR ALL USING (bucket_id = 'galleries' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'galleries' AND auth.role() = 'authenticated');

CREATE POLICY "music_storage_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'music');
CREATE POLICY "music_storage_authenticated_write" ON storage.objects FOR ALL USING (bucket_id = 'music' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

-- 6) RLS praktis agar dashboard tidak error 500 karena policy recursive lama
-- Catatan: ini aman untuk development. Sebelum jualan/deploy besar, kita bisa kunci ulang lebih ketat.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_music DISABLE ROW LEVEL SECURITY;
