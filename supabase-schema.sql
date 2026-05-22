-- ============================================================
-- INVITELY — Supabase Database Schema
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUM Types ───────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE user_plan AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- ─── Table: users ────────────────────────────────────────────
CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'client',
  plan          user_plan NOT NULL DEFAULT 'free',
  plan_expires_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: themes ───────────────────────────────────────────
CREATE TABLE public.themes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  preview_image_url TEXT NOT NULL DEFAULT '',
  primary_color     TEXT NOT NULL DEFAULT '#D4A017',
  secondary_color   TEXT NOT NULL DEFAULT '#F7E7CE',
  accent_color      TEXT NOT NULL DEFAULT '#1A1A2E',
  font_heading      TEXT NOT NULL DEFAULT 'Playfair Display',
  font_body         TEXT NOT NULL DEFAULT 'Cormorant Garamond',
  is_premium        BOOLEAN NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: events ───────────────────────────────────────────
CREATE TABLE public.events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  bride_name       TEXT NOT NULL,
  groom_name       TEXT NOT NULL,
  bride_parents    TEXT,
  groom_parents    TEXT,
  event_date       DATE NOT NULL,
  event_time       TIME NOT NULL,
  venue_name       TEXT NOT NULL,
  venue_address    TEXT NOT NULL,
  venue_maps_url   TEXT,
  reception_date   DATE,
  reception_time   TIME,
  reception_venue  TEXT,
  theme_id         UUID REFERENCES public.themes(id) ON DELETE SET NULL,
  cover_image_url  TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  view_count       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: guests ───────────────────────────────────────────
CREATE TABLE public.guests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id         UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL,
  phone            TEXT,
  invitation_link  TEXT NOT NULL,
  has_opened       BOOLEAN NOT NULL DEFAULT FALSE,
  opened_at        TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, slug)
);

-- ─── Table: rsvp ─────────────────────────────────────────────
CREATE TABLE public.rsvp (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id     UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_id     UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  guest_name   TEXT NOT NULL,
  is_attending BOOLEAN NOT NULL DEFAULT TRUE,
  guest_count  INTEGER NOT NULL DEFAULT 1 CHECK (guest_count BETWEEN 1 AND 10),
  message      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: galleries ────────────────────────────────────────
CREATE TABLE public.galleries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  caption     TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: gift_accounts ────────────────────────────────────
CREATE TABLE public.gift_accounts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id       UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name   TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: event_music ──────────────────────────────────────
CREATE TABLE public.event_music (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id   UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  artist     TEXT,
  audio_url  TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES — Performa Query
-- ============================================================
CREATE INDEX idx_events_user_id    ON public.events(user_id);
CREATE INDEX idx_events_slug       ON public.events(slug);
CREATE INDEX idx_events_is_active  ON public.events(is_active);
CREATE INDEX idx_guests_event_id   ON public.guests(event_id);
CREATE INDEX idx_guests_slug       ON public.guests(slug);
CREATE INDEX idx_rsvp_event_id     ON public.rsvp(event_id);
CREATE INDEX idx_galleries_event   ON public.galleries(event_id);
CREATE INDEX idx_music_event       ON public.event_music(event_id);

-- ============================================================
-- TRIGGERS — Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on semua tabel
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_music   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes        ENABLE ROW LEVEL SECURITY;

-- ── users ──
CREATE POLICY "users_select_own"  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"  ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own"  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
-- Admin dapat membaca semua user
CREATE POLICY "admin_select_all_users" ON public.users FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- ── themes (semua user bisa baca) ──
CREATE POLICY "themes_select_all"   ON public.themes FOR SELECT USING (is_active = TRUE);
CREATE POLICY "themes_admin_all"    ON public.themes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ── events ──
CREATE POLICY "events_select_own"   ON public.events FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "events_insert_own"   ON public.events FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "events_update_own"   ON public.events FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "events_delete_own"   ON public.events FOR DELETE USING (user_id = auth.uid());
-- Public bisa baca event yang published untuk halaman undangan
CREATE POLICY "events_select_public" ON public.events FOR SELECT
  USING (is_published = TRUE AND is_active = TRUE);
-- Admin bisa lihat semua
CREATE POLICY "events_admin_all"    ON public.events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ── guests ──
CREATE POLICY "guests_owner_all" ON public.guests FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));
-- Tamu publik bisa membaca data guest mereka sendiri (untuk halaman undangan)
CREATE POLICY "guests_select_public" ON public.guests FOR SELECT USING (TRUE);
CREATE POLICY "guests_update_opened" ON public.guests FOR UPDATE USING (TRUE);

-- ── rsvp ──
CREATE POLICY "rsvp_owner_select" ON public.rsvp FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));
CREATE POLICY "rsvp_public_insert" ON public.rsvp FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "rsvp_public_select" ON public.rsvp FOR SELECT USING (TRUE);

-- ── galleries ──
CREATE POLICY "galleries_owner_all" ON public.galleries FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));
CREATE POLICY "galleries_public_select" ON public.galleries FOR SELECT USING (TRUE);

-- ── gift_accounts ──
CREATE POLICY "gift_owner_all" ON public.gift_accounts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));
CREATE POLICY "gift_public_select" ON public.gift_accounts FOR SELECT USING (TRUE);

-- ── event_music ──
CREATE POLICY "music_owner_all" ON public.event_music FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));
CREATE POLICY "music_public_select" ON public.event_music FOR SELECT USING (TRUE);

-- ============================================================
-- STORAGE BUCKETS
-- Buat di: Supabase Dashboard → Storage → New Bucket
-- ============================================================
-- Bucket: "events"     → public, untuk cover images
-- Bucket: "galleries"  → public, untuk foto galeri
-- Bucket: "music"      → public, untuk file audio

-- Storage Policies (jalankan setelah bucket dibuat)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('events',    'events',    true),
  ('galleries', 'galleries', true),
  ('music',     'music',     true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "events_storage_owner" ON storage.objects FOR ALL
  USING (bucket_id = 'events' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'events');

CREATE POLICY "events_storage_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'events');

CREATE POLICY "galleries_storage_owner" ON storage.objects FOR ALL
  USING (bucket_id = 'galleries')
  WITH CHECK (bucket_id = 'galleries' AND auth.role() = 'authenticated');

CREATE POLICY "galleries_storage_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'galleries');

CREATE POLICY "music_storage_owner" ON storage.objects FOR ALL
  USING (bucket_id = 'music')
  WITH CHECK (bucket_id = 'music' AND auth.role() = 'authenticated');

CREATE POLICY "music_storage_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'music');

-- ============================================================
-- SEED DATA — Default Themes
-- ============================================================
INSERT INTO public.themes (name, primary_color, secondary_color, accent_color, font_heading, font_body, is_premium, is_active) VALUES
  ('Champagne Gold',   '#D4A017', '#F7E7CE', '#1A1A2E',  'Playfair Display',    'Cormorant Garamond', FALSE, TRUE),
  ('Midnight Elegant', '#E8C99A', '#F7E7CE', '#1A1A2E',  'Playfair Display',    'Cormorant Garamond', FALSE, TRUE),
  ('Blush Rose',       '#C9748A', '#FDF0F3', '#4A2030',  'Playfair Display',    'Lora',               TRUE,  TRUE),
  ('Forest Green',     '#6B9E7A', '#EDF5EF', '#2C4A35',  'Cormorant Garamond',  'Lora',               TRUE,  TRUE),
  ('Royal Navy',       '#7B8FC0', '#EEF1FA', '#1B2451',  'Cinzel',              'Cormorant Garamond', TRUE,  TRUE),
  ('Dusty Rose',       '#C4898A', '#FAF0EE', '#5C3535',  'Great Vibes',         'Lora',               TRUE,  TRUE);

-- ============================================================
-- REALTIME — Enable untuk RSVP live updates
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;

-- ============================================================
-- FUNCTIONS — Helper functions
-- ============================================================

-- Function: auto-create user profile setelah register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client',
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: jalankan function setiap user baru register
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- VIEWS — Untuk kemudahan query dashboard
-- ============================================================

-- View: event_stats (statistik per event)
CREATE OR REPLACE VIEW public.event_stats AS
SELECT
  e.id,
  e.slug,
  e.bride_name,
  e.groom_name,
  e.event_date,
  e.view_count,
  e.is_published,
  e.user_id,
  COUNT(DISTINCT g.id) AS guest_count,
  COUNT(DISTINCT r.id) AS rsvp_count,
  COUNT(DISTINCT r.id) FILTER (WHERE r.is_attending = TRUE) AS attending_count,
  COALESCE(SUM(r.guest_count) FILTER (WHERE r.is_attending = TRUE), 0) AS total_attending_guests
FROM public.events e
LEFT JOIN public.guests g ON g.event_id = e.id
LEFT JOIN public.rsvp r ON r.event_id = e.id
WHERE e.is_active = TRUE
GROUP BY e.id;

-- View: admin_overview (statistik global untuk admin)
CREATE OR REPLACE VIEW public.admin_overview AS
SELECT
  (SELECT COUNT(*) FROM public.users) AS total_users,
  (SELECT COUNT(*) FROM public.events WHERE is_active = TRUE) AS total_events,
  (SELECT COUNT(*) FROM public.events WHERE is_published = TRUE AND is_active = TRUE) AS published_events,
  (SELECT COUNT(*) FROM public.guests) AS total_guests,
  (SELECT COUNT(*) FROM public.rsvp) AS total_rsvp,
  (SELECT COALESCE(SUM(view_count), 0) FROM public.events WHERE is_active = TRUE) AS total_views;
