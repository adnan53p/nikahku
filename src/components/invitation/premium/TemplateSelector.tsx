'use client'

import type { Event, Guest } from '@/types'
import IslamicLuxury from '../themes/IslamicLuxury'
import PendopoSenja from '../themes/PendopoSenja/PendopoSenja'
import BlueSerenityIndonesia from '../themes/BlueSerenityIndonesia/BlueSerenityIndonesia'

export const premiumTemplates = [
  { slug: 'classic-elegant', name: 'Classic Elegant' },
  { slug: 'islamic-luxury', name: 'Islamic Luxury' },
  { slug: 'pendopo-senja', name: 'Pendopo Senja' },
  { slug: 'blue-serenity-indonesia', name: 'Blue Serenity Indonesia' },
]

export function renderPremiumTemplate({
  slug,
  event,
  guest,
  guestName,
}: {
  slug: string
  event: Event
  guest: Guest | null
  guestName: string | null
}) {
  if (slug === 'islamic-luxury') return <IslamicLuxury event={event} guest={guest} guestName={guestName} />
  if (slug === 'pendopo-senja') return <PendopoSenja event={event} guest={guest} guestName={guestName} />
  if (slug === 'blue-serenity-indonesia') return <BlueSerenityIndonesia event={event as any} guest={guest} guestName={guestName} />
  return null
}
