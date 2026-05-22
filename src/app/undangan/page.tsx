import IslamicLuxury from '@/components/invitation/themes/IslamicLuxury'
import type { Event } from '@/types'

const demoEvent = {
  id: 'demo',
  user_id: 'demo',
  slug: 'demo',
  title: 'Demo Islamic Luxury',
  bride_name: 'Aisyah',
  groom_name: 'Rafif',
  bride_parents: 'Putri dari Bpk. H. Khalid dan Ibu Hj. Fatimah',
  groom_parents: 'Putra dari Bpk. H. Ahmad dan Ibu Hj. Rahma',
  event_date: '2026-12-12',
  event_time: '08:00',
  venue_name: 'Masjid Al-Hikmah',
  venue_address: 'Jl. Sudirman No. 45, Jakarta',
  venue_maps_url: 'https://maps.google.com',
  reception_date: '2026-12-12',
  reception_time: '11:00',
  reception_venue: 'Grand Ballroom Jakarta',
  theme_id: null,
  theme_slug: 'islamic-luxury',
  cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=1800&fit=crop',
  bride_photo_url: null,
  groom_photo_url: null,
  qris_image_url: null,
  is_published: true,
  is_active: true,
  view_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  galleries: [],
  gift_accounts: [],
  event_music: [],
} satisfies Event

export default function UndanganPage() {
  return <IslamicLuxury event={demoEvent} guest={null} guestName="Papik" />
}
