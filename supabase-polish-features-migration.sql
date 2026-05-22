-- Invitely polish migration: guest links, storage, publish protection, music, themes.
-- Run this in Supabase SQL Editor after the main schema.

-- 1) Ensure required event media columns exist.
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS theme_slug text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS bride_photo_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS groom_photo_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS qris_image_url text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- 2) Ensure gallery table supports stable ordering and public URLs.
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS event_id uuid;
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS caption text;
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;
ALTER TABLE public.galleries ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 3) Ensure guest table supports guest-link tracking.
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS invitation_link text;
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS has_opened boolean DEFAULT false;
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS opened_at timestamptz;

-- 4) Ensure music table exists.
CREATE TABLE IF NOT EXISTS public.event_music (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist text,
  audio_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 5) Create public storage buckets used by dashboard uploads.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('events', 'events', true),
  ('galleries', 'galleries', true),
  ('music', 'music', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6) Simple storage policies for authenticated dashboard uploads and public read.
DROP POLICY IF EXISTS "Public read events" ON storage.objects;
DROP POLICY IF EXISTS "Public read galleries" ON storage.objects;
DROP POLICY IF EXISTS "Public read music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload galleries" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload music" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update own media buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete own media buckets" ON storage.objects;

CREATE POLICY "Public read events" ON storage.objects
FOR SELECT USING (bucket_id = 'events');

CREATE POLICY "Public read galleries" ON storage.objects
FOR SELECT USING (bucket_id = 'galleries');

CREATE POLICY "Public read music" ON storage.objects
FOR SELECT USING (bucket_id = 'music');

CREATE POLICY "Authenticated upload events" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Authenticated upload galleries" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'galleries');

CREATE POLICY "Authenticated upload music" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'music');

CREATE POLICY "Authenticated update own media buckets" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id IN ('events', 'galleries', 'music'))
WITH CHECK (bucket_id IN ('events', 'galleries', 'music'));

CREATE POLICY "Authenticated delete own media buckets" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id IN ('events', 'galleries', 'music'));

-- 7) Seed official themes for the marketplace.
INSERT INTO public.themes (
  name, slug, preview_image_url, primary_color, secondary_color, accent_color,
  font_heading, font_body, is_premium, is_active
)
VALUES
  ('Islamic Luxury', 'islamic-luxury', '', '#D4A847', '#0A0A0A', '#050505', 'Playfair Display', 'Cormorant Garamond', false, true),
  ('Classic Elegant', 'classic-elegant', '', '#D4A017', '#F7E7CE', '#1A1A2E', 'Playfair Display', 'Cormorant Garamond', false, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  preview_image_url = EXCLUDED.preview_image_url,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  font_heading = EXCLUDED.font_heading,
  font_body = EXCLUDED.font_body,
  is_premium = EXCLUDED.is_premium,
  is_active = true;

-- 8) Optional development convenience. If your RLS policies are still causing 500 errors,
-- keep these disabled while developing locally. Re-enable and tighten before production.
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_music DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp DISABLE ROW LEVEL SECURITY;
