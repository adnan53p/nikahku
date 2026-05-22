-- Invitely feature upgrade: guest alias kpd, extended couple data, dinner, schedule, story, RSVP phone/custom, gift toggle, auto scroll

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS bride_full_name text,
ADD COLUMN IF NOT EXISTS groom_full_name text,
ADD COLUMN IF NOT EXISTS bride_address text,
ADD COLUMN IF NOT EXISTS groom_address text,
ADD COLUMN IF NOT EXISTS bride_instagram text,
ADD COLUMN IF NOT EXISTS groom_instagram text,
ADD COLUMN IF NOT EXISTS dinner_date date,
ADD COLUMN IF NOT EXISTS dinner_start_time text,
ADD COLUMN IF NOT EXISTS dinner_end_time text,
ADD COLUMN IF NOT EXISTS dinner_venue text,
ADD COLUMN IF NOT EXISTS dinner_address text,
ADD COLUMN IF NOT EXISTS schedule_items_text text,
ADD COLUMN IF NOT EXISTS love_story_items_text text,
ADD COLUMN IF NOT EXISTS custom_rsvp_fields_text text,
ADD COLUMN IF NOT EXISTS gift_is_collapsible boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_scroll_enabled boolean DEFAULT false;

ALTER TABLE public.rsvp
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS custom_answer text;

-- Optional: make sure public pages can still read needed rows while you are in development.
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_music DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp DISABLE ROW LEVEL SECURITY;
