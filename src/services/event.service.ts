import { createClient } from '@/lib/supabase/client'
import type { Event, Guest, GuestImport, Rsvp, Gallery, GiftAccount, EventMusic } from '@/types'
import type { EventInput } from '@/lib/validations'
import { slugify, generateGuestSlug, generateInvitationLink } from '@/lib/utils'

const supabase = createClient()

function safeFileExt(file: File, fallback = 'jpg') {
  return file.name.split('.').pop()?.toLowerCase() || fallback
}

function makeSafeFileName(eventId: string, prefix: string, ext: string) {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${eventId}/${prefix}-${id}.${ext}`
}

async function compressImageIfNeeded(file: File, maxWidth = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  if (typeof window === 'undefined') return file

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })

  const scale = Math.min(1, maxWidth / image.width)
  const width = Math.round(image.width * scale)
  const height = Math.round(image.height * scale)

  if (scale === 1 && file.size <= 900 * 1024) {
    URL.revokeObjectURL(image.src)
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    URL.revokeObjectURL(image.src)
    return file
  }
  ctx.drawImage(image, 0, 0, width, height)
  URL.revokeObjectURL(image.src)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  if (!blob) return file
  return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(userId: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      themes(*),
      galleries(count),
      rsvp(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getEventBySlug(slug: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      themes(*),
      galleries(*),
      gift_accounts(*),
      event_music(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error

  // Increment view count
  await supabase
    .from('events')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', data.id)

  return data as Event
}

export async function createEvent(userId: string, input: EventInput) {
  const slug = slugify(`${input.bride_name}-${input.groom_name}`)

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('events')
    .select('id')
    .eq('slug', slug)
    .single()

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  const { data, error } = await supabase
    .from('events')
    .insert({
      user_id: userId,
      slug: finalSlug,
      ...input,
      is_published: false,
      is_active: true,
      view_count: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEvent(eventId: string, input: Partial<EventInput>) {
  const { data, error } = await supabase
    .from('events')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function publishEvent(eventId: string, isPublished: boolean) {
  const { data, error } = await supabase
    .from('events')
    .update({ is_published: isPublished })
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase
    .from('events')
    .update({ is_active: false })
    .eq('id', eventId)

  if (error) throw error
}

// ─── Guests ───────────────────────────────────────────────────────────────────

export async function getGuests(eventId: string) {
  const { data, error } = await supabase
    .from('guests')
    .select('*, rsvp(*)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as (Guest & { rsvp: Rsvp[] })[]
}

export async function createGuests(eventId: string, eventSlug: string, guests: GuestImport[]) {
  const guestData = guests.map((g) => {
    const guestSlug = generateGuestSlug(g.name)
    return {
      event_id: eventId,
      name: g.name,
      slug: guestSlug,
      phone: g.phone || null,
      invitation_link: generateInvitationLink(eventSlug, g.name),
      has_opened: false,
    }
  })

  const { data, error } = await supabase
    .from('guests')
    .insert(guestData)
    .select()

  if (error) throw error
  return data
}

export async function deleteGuest(guestId: string) {
  const { error } = await supabase.from('guests').delete().eq('id', guestId)
  if (error) throw error
}

export async function markGuestOpened(guestId: string) {
  const { error } = await supabase
    .from('guests')
    .update({ has_opened: true, opened_at: new Date().toISOString() })
    .eq('id', guestId)

  if (error) throw error
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

export async function submitRsvp(data: {
  event_id: string
  guest_id?: string
  guest_name: string
  is_attending: boolean
  guest_count: number
  phone?: string
  custom_answer?: string
  message?: string
}) {
  const { data: rsvp, error } = await supabase
    .from('rsvp')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return rsvp
}

export async function getRsvpByEvent(eventId: string) {
  const { data, error } = await supabase
    .from('rsvp')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Rsvp[]
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

 export async function uploadGalleryImage(
  eventId: string,
  file: File,
  caption?: string
): Promise<Gallery> {
  const optimizedFile = await compressImageIfNeeded(file, 1600, 0.82)
  const fileExt = safeFileExt(optimizedFile, 'webp')
  const fileName = makeSafeFileName(eventId, 'gallery', fileExt)

  const { error: uploadError } = await supabase.storage
    .from('galleries')
    .upload(fileName, optimizedFile, {
      upsert: true,
      cacheControl: '31536000',
      contentType: optimizedFile.type || undefined,
    })

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = supabase.storage
    .from('galleries')
    .getPublicUrl(fileName)

  const { count } = await supabase
    .from('galleries')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)

  const { data, error } = await supabase
    .from('galleries')
    .insert({
      event_id: eventId,
      image_url: publicUrl,
      caption: caption || null,
      order_index: count || 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGalleryImage(galleryId: string) {
  const { error } = await supabase.from('galleries').delete().eq('id', galleryId)
  if (error) throw error
}

// ─── Music ────────────────────────────────────────────────────────────────────

export async function uploadMusic(
  eventId: string,
  file: File,
  title: string,
  artist?: string
): Promise<EventMusic> {
  const fileExt = safeFileExt(file, 'mp3')
  const fileName = makeSafeFileName(eventId, 'music', fileExt)

  const { error: uploadError } = await supabase.storage
    .from('music')
    .upload(fileName, file, {
      upsert: true,
      cacheControl: '31536000',
      contentType: file.type || undefined,
    })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('music')
    .getPublicUrl(fileName)

  // Deactivate existing music for this event.
  await supabase
    .from('event_music')
    .update({ is_active: false })
    .eq('event_id', eventId)

  const { data, error } = await supabase
    .from('event_music')
    .insert({
      event_id: eventId,
      title,
      artist: artist || null,
      audio_url: publicUrl,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMusic(musicId: string) {
  const { error } = await supabase
    .from('event_music')
    .delete()
    .eq('id', musicId)

  if (error) throw error
}

// ─── Gift Accounts ────────────────────────────────────────────────────────────

export async function addGiftAccount(eventId: string, data: {
  bank_name: string
  account_number: string
  account_name: string
}): Promise<GiftAccount> {
  const { data: gift, error } = await supabase
    .from('gift_accounts')
    .insert({ event_id: eventId, ...data })
    .select()
    .single()

  if (error) throw error
  return gift
}

export async function deleteGiftAccount(giftId: string) {
  const { error } = await supabase.from('gift_accounts').delete().eq('id', giftId)
  if (error) throw error
}

// ─── Event Media Uploads ─────────────────────────────────────────────────────

async function uploadEventAsset(eventId: string, file: File, kind: 'cover' | 'bride' | 'groom' | 'qris'): Promise<string> {
  const optimizedFile = kind === 'qris' ? file : await compressImageIfNeeded(file, kind === 'cover' ? 1800 : 1200, 0.84)
  const fileExt = safeFileExt(optimizedFile, kind === 'qris' ? 'png' : 'webp')
  const fileName = makeSafeFileName(eventId, kind, fileExt)

  const { error: uploadError } = await supabase.storage
    .from('events')
    .upload(fileName, optimizedFile, {
      upsert: true,
      cacheControl: '31536000',
      contentType: optimizedFile.type || undefined,
    })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('events')
    .getPublicUrl(fileName)

  return publicUrl
}

export async function uploadCoverImage(eventId: string, file: File): Promise<string> {
  const publicUrl = await uploadEventAsset(eventId, file, 'cover')
  const { error } = await supabase
    .from('events')
    .update({ cover_image_url: publicUrl })
    .eq('id', eventId)
  if (error) throw error
  return publicUrl
}

export async function uploadBridePhoto(eventId: string, file: File): Promise<string> {
  const publicUrl = await uploadEventAsset(eventId, file, 'bride')
  const { error } = await supabase
    .from('events')
    .update({ bride_photo_url: publicUrl })
    .eq('id', eventId)
  if (error) throw error
  return publicUrl
}

export async function uploadGroomPhoto(eventId: string, file: File): Promise<string> {
  const publicUrl = await uploadEventAsset(eventId, file, 'groom')
  const { error } = await supabase
    .from('events')
    .update({ groom_photo_url: publicUrl })
    .eq('id', eventId)
  if (error) throw error
  return publicUrl
}

export async function uploadQrisImage(eventId: string, file: File): Promise<string> {
  const publicUrl = await uploadEventAsset(eventId, file, 'qris')
  const { error } = await supabase
    .from('events')
    .update({ qris_image_url: publicUrl })
    .eq('id', eventId)
  if (error) throw error
  return publicUrl
}
