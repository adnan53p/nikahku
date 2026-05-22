INSERT INTO public.themes (
  name,
  slug,
  primary_color,
  secondary_color,
  accent_color,
  font_heading,
  font_body,
  is_premium,
  is_active
)
VALUES (
  'Pendopo Senja',
  'pendopo-senja',
  '#C9A96E',
  '#FAF7F2',
  '#1A1208',
  'Palatino Linotype',
  'Georgia',
  false,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  font_heading = EXCLUDED.font_heading,
  font_body = EXCLUDED.font_body,
  is_active = true;
