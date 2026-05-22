-- STAGE 2 & 3 PREMIUM FEATURES
-- Jalankan di Supabase SQL Editor sebelum memakai halaman /admin/premium-editor

alter table events
  add column if not exists custom_primary_color text default '#8c6a43',
  add column if not exists custom_secondary_color text default '#f8f5f1',
  add column if not exists custom_accent_color text default '#d4a017',
  add column if not exists custom_heading_font text default 'Playfair Display',
  add column if not exists custom_body_font text default 'Inter',
  add column if not exists particle_mode text default 'gold-dust',
  add column if not exists opening_text text,
  add column if not exists closing_text text,
  add column if not exists ai_invitation_enabled boolean default true,
  add column if not exists ai_invitation_text text,
  add column if not exists voice_narration_enabled boolean default true,
  add column if not exists voice_narration_text text;

-- Template pilihan tambahan
insert into themes (name, slug, preview_image_url, primary_color, secondary_color, accent_color, font_heading, font_body, is_premium, is_active)
values
  ('Royal Garden', 'royal-garden', '/themes/royal-garden.jpg', '#557153', '#f7efe5', '#b99b6b', 'Cormorant Garamond', 'Inter', true, true),
  ('Modern Minimal', 'modern-minimal', '/themes/modern-minimal.jpg', '#222222', '#fafafa', '#9a8c7c', 'Montserrat', 'Inter', true, true),
  ('Cinematic Gold', 'cinematic-gold', '/themes/cinematic-gold.jpg', '#1a1a2e', '#f8f5f1', '#d4a017', 'Playfair Display', 'Inter', true, true)
on conflict (slug) do nothing;
