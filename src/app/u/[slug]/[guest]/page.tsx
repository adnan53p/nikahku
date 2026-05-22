import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { InvitationPage } from '@/components/invitation/InvitationPage'
import { markGuestOpened } from '@/services/event.service'
import type { Event, Guest } from '@/types'

interface Props {
  params: Promise<{ slug: string; guest: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('bride_name, groom_name, event_date, venue_name')
    .eq('slug', slug)
    .single()

  if (!event) return { title: 'Undangan Digital' }

  return {
    title: `Undangan ${event.bride_name} & ${event.groom_name}`,
    description: `Anda diundang ke pernikahan ${event.bride_name} & ${event.groom_name} — ${event.event_date} di ${event.venue_name}`,
    openGraph: {
      title: `💍 Undangan Pernikahan ${event.bride_name} & ${event.groom_name}`,
      description: `Dengan penuh sukacita, kami mengundang Anda untuk menyaksikan hari bahagia kami.`,
      images: [{ url: '/og-wedding.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function InvitationGuestPage({ params }: Props) {
  const { slug, guest: guestSlug } = await params
  const supabase = await createClient()

  // Fetch event
  const { data: eventData } = await supabase
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

  if (!eventData) notFound()

  // Fetch guest
  const { data: guestData } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventData.id)
    .eq('slug', guestSlug)
    .single()

  // Mark as opened (fire-and-forget)
  if (guestData?.id) {
    markGuestOpened(guestData.id).catch(() => {})
  }

  // Increment view count
  supabase
    .from('events')
    .update({ view_count: (eventData.view_count || 0) + 1 })
    .eq('id', eventData.id)
    .then(() => {})

  return (
    <InvitationPage
      event={eventData as Event}
      guest={guestData as Guest | null}
      guestName={guestData?.name || null}
    />
  )
}
