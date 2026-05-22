-- PREMIUM STAGE 2 & 3 MIGRATION
-- Jalankan di Supabase SQL Editor.
-- Aman dijalankan berulang karena memakai IF NOT EXISTS.

alter table public.events
  add column if not exists premium_settings_json text,
  add column if not exists custom_primary_color text,
  add column if not exists custom_secondary_color text,
  add column if not exists custom_accent_color text,
  add column if not exists custom_heading_font text,
  add column if not exists custom_body_font text,
  add column if not exists particle_mode text default 'sparkle',
  add column if not exists ai_generated_text text,
  add column if not exists voice_narration_enabled boolean default false,
  add column if not exists cinematic_mode_enabled boolean default true;

comment on column public.events.premium_settings_json is 'JSON setting premium: semua teks, warna, font, tombol, narasi, cinematic mode.';
comment on column public.events.particle_mode is 'none, sparkle, flower, goldDust, heart, snow';
