import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Password tidak cocok',
  path: ['confirm_password'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export const eventSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  bride_name: z.string().min(2, 'Nama mempelai wanita minimal 2 karakter'),
  groom_name: z.string().min(2, 'Nama mempelai pria minimal 2 karakter'),
  bride_parents: z.string().optional(),
  groom_parents: z.string().optional(),
  bride_full_name: z.string().optional(),
  groom_full_name: z.string().optional(),
  bride_address: z.string().optional(),
  groom_address: z.string().optional(),
  bride_instagram: z.string().optional(),
  groom_instagram: z.string().optional(),
  dinner_date: z.string().optional(),
  dinner_start_time: z.string().optional(),
  dinner_end_time: z.string().optional(),
  dinner_venue: z.string().optional(),
  dinner_address: z.string().optional(),
  schedule_items_text: z.string().optional(),
  love_story_items_text: z.string().optional(),
  custom_rsvp_fields_text: z.string().optional(),
  gift_is_collapsible: z.boolean().optional(),
  auto_scroll_enabled: z.boolean().optional(),
  event_date: z.string().min(1, 'Tanggal acara wajib diisi'),
  event_time: z.string().min(1, 'Waktu acara wajib diisi'),
  venue_name: z.string().min(3, 'Nama venue minimal 3 karakter'),
  venue_address: z.string().min(10, 'Alamat venue minimal 10 karakter'),
  venue_maps_url: z.string().url('URL Google Maps tidak valid').optional().or(z.literal('')),
  reception_date: z.string().optional(),
  reception_time: z.string().optional(),
  reception_venue: z.string().optional(),
  theme_id: z.string().optional(),
  theme_slug: z.string().optional(),
  cover_image_url: z.string().optional().nullable(),
  bride_photo_url: z.string().optional().nullable(),
  groom_photo_url: z.string().optional().nullable(),
  qris_image_url: z.string().optional().nullable(),
})

export const rsvpSchema = z.object({
  guest_name: z.string().min(2, 'Nama minimal 2 karakter'),
  is_attending: z.boolean(),
  guest_count: z.number().min(1).max(10),
  phone: z.string().optional(),
  custom_answer: z.string().max(500, 'Jawaban tambahan maksimal 500 karakter').optional(),
  message: z.string().max(500, 'Ucapan maksimal 500 karakter').optional(),
})

export const giftAccountSchema = z.object({
  bank_name: z.string().min(2, 'Nama bank wajib diisi'),
  account_number: z.string().min(5, 'Nomor rekening tidak valid'),
  account_name: z.string().min(2, 'Nama pemilik rekening wajib diisi'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type EventInput = z.infer<typeof eventSchema>
export type RsvpInput = z.infer<typeof rsvpSchema>
export type GiftAccountInput = z.infer<typeof giftAccountSchema>
