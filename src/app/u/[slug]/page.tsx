import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { InvitationPage } from '@/components/invitation/InvitationPage'
import type { Event } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ to?: string; kpd?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('bride_name, groom_name')
    .eq('slug', slug)
    .single()

  if (!event) return { title: 'Undangan Digital' }
  return { title: `Undangan ${event.bride_name} & ${event.groom_name}` }
}

export default async function InvitationSlugPage({ params, searchParams }: Props) {
  const { slug } = await params
  const query = searchParams ? await searchParams : {}
  const supabase = await createClient()

  const { data: eventData } = await supabase
    .from('events')
    .select('*, themes(*), galleries(*), gift_accounts(*), event_music(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!eventData) notFound()

  // Public visitors should only access published events.
  if (!eventData.is_published) notFound()

  const rawGuestName = query?.kpd || query?.to
  const guestNameFromUrl = rawGuestName ? decodeURIComponent(rawGuestName).trim() : null

  let guestData = null
  if (guestNameFromUrl) {
    const { data: matchedGuest } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventData.id)
      .ilike('name', guestNameFromUrl)
      .maybeSingle()

    guestData = matchedGuest

    if (matchedGuest?.id) {
      await supabase
        .from('guests')
        .update({ has_opened: true, opened_at: new Date().toISOString() })
        .eq('id', matchedGuest.id)
    }
  }

  supabase
    .from('events')
    .update({ view_count: (eventData.view_count || 0) + 1 })
    .eq('id', eventData.id)
    .then(() => {})

  return <InvitationPage event={eventData as Event} guest={guestData} guestName={guestNameFromUrl} />
}
