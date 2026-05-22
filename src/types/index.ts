export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─── Database Types ────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow
        Insert: Omit<UserRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserRow, 'id' | 'created_at'>>
      }
      events: {
        Row: EventRow
        Insert: Omit<EventRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<EventRow, 'id' | 'created_at'>>
      }
      guests: {
        Row: GuestRow
        Insert: Omit<GuestRow, 'id' | 'created_at'>
        Update: Partial<Omit<GuestRow, 'id' | 'created_at'>>
      }
      rsvp: {
        Row: RsvpRow
        Insert: Omit<RsvpRow, 'id' | 'created_at'>
        Update: Partial<Omit<RsvpRow, 'id' | 'created_at'>>
      }
      galleries: {
        Row: GalleryRow
        Insert: Omit<GalleryRow, 'id' | 'created_at'>
        Update: Partial<Omit<GalleryRow, 'id' | 'created_at'>>
      }
      themes: {
        Row: ThemeRow
        Insert: Omit<ThemeRow, 'id' | 'created_at'>
        Update: Partial<Omit<ThemeRow, 'id' | 'created_at'>>
      }
      gift_accounts: {
        Row: GiftAccountRow
        Insert: Omit<GiftAccountRow, 'id' | 'created_at'>
        Update: Partial<Omit<GiftAccountRow, 'id' | 'created_at'>>
      }
      event_music: {
        Row: EventMusicRow
        Insert: Omit<EventMusicRow, 'id' | 'created_at'>
        Update: Partial<Omit<EventMusicRow, 'id' | 'created_at'>>
      }
    }
  }
}

// ─── Row Types ─────────────────────────────────────────────────────────────────

export interface UserRow {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: 'client' | 'admin'
  plan: 'free' | 'basic' | 'premium' | 'enterprise'
  plan_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface EventRow {
  id: string
  user_id: string
  slug: string
  title: string
  bride_name: string
  groom_name: string
  bride_parents: string | null
  groom_parents: string | null
  bride_full_name?: string | null
  groom_full_name?: string | null
  bride_address?: string | null
  groom_address?: string | null
  bride_instagram?: string | null
  groom_instagram?: string | null
  dinner_date?: string | null
  dinner_start_time?: string | null
  dinner_end_time?: string | null
  dinner_venue?: string | null
  dinner_address?: string | null
  schedule_items_text?: string | null
  love_story_items_text?: string | null
  custom_rsvp_fields_text?: string | null
  gift_is_collapsible?: boolean | null
  auto_scroll_enabled?: boolean | null
  premium_settings_json?: string | null
  custom_primary_color?: string | null
  custom_secondary_color?: string | null
  custom_accent_color?: string | null
  custom_heading_font?: string | null
  custom_body_font?: string | null
  particle_mode?: string | null
  ai_generated_text?: string | null
  voice_narration_enabled?: boolean | null
  cinematic_mode_enabled?: boolean | null
  event_date: string
  event_time: string
  venue_name: string
  venue_address: string
  venue_maps_url: string | null
  reception_date: string | null
  reception_time: string | null
  reception_venue: string | null
  theme_id: string | null
  theme_slug: string | null
  cover_image_url: string | null
  bride_photo_url: string | null
  groom_photo_url: string | null
  qris_image_url: string | null
  is_published: boolean
  is_active: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface GuestRow {
  id: string
  event_id: string
  name: string
  slug: string
  phone?: string | null
  invitation_link: string
  has_opened: boolean
  opened_at: string | null
  created_at: string
}

export interface RsvpRow {
  id: string
  event_id: string
  guest_id: string | null
  guest_name: string
  is_attending: boolean
  guest_count: number
  message: string | null
  phone?: string | null
  custom_answer?: string | null
  created_at: string
}

export interface GalleryRow {
  id: string
  event_id: string
  image_url: string
  caption: string | null
  order_index: number
  created_at: string
}

export interface ThemeRow {
  id: string
  name: string
  slug: string
  preview_image_url: string
  primary_color: string
  secondary_color: string
  accent_color: string
  font_heading: string
  font_body: string
  is_premium: boolean
  is_active: boolean
  created_at: string
}

export interface GiftAccountRow {
  id: string
  event_id: string
  bank_name: string
  account_number: string
  account_name: string
  created_at: string
}

export interface EventMusicRow {
  id: string
  event_id: string
  title: string
  artist: string | null
  audio_url: string
  is_active: boolean
  created_at: string
}

// ─── App Types ─────────────────────────────────────────────────────────────────

export type User = UserRow
export type Event = EventRow & {
  theme?: ThemeRow
  themes?: ThemeRow
  galleries?: GalleryRow[]
  gift_accounts?: GiftAccountRow[]
  event_music?: EventMusicRow[]
  rsvp_count?: number
  rsvp_attending?: number
}
export type Guest = GuestRow
export type Rsvp = RsvpRow
export type Gallery = GalleryRow
export type Theme = ThemeRow
export type GiftAccount = GiftAccountRow
export type EventMusic = EventMusicRow

export type Plan = 'free' | 'basic' | 'premium' | 'enterprise'
export type UserRole = 'client' | 'admin'

export interface PlanFeature {
  name: string
  included: boolean
}

export interface PricingPlan {
  id: Plan
  name: string
  price: number
  period: string
  description: string
  features: PlanFeature[]
  isPopular?: boolean
  maxEvents: number
  maxGuests: number
}

export interface DashboardStats {
  totalEvents: number
  totalGuests: number
  totalRsvp: number
  totalAttending: number
  totalViews: number
}

export interface AdminStats extends DashboardStats {
  totalUsers: number
  activeUsers: number
  revenueMonth: number
}

export interface GuestImport {
  name: string
  phone?: string
}
