'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { Event } from '@/types'
import type { PremiumInvitationSettings } from '@/lib/invitationPremium'

export function PremiumClosing({ event, settings }: { event: Event; settings: PremiumInvitationSettings }) {
  return (
    <section data-scroll-section className="py-24 text-center bg-[var(--inv-primary)] relative overflow-hidden px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-md mx-auto"
      >
        <Heart size={34} className="text-[var(--inv-accent)] mx-auto mb-6" fill="currentColor" />
        <h3 className="font-display text-3xl font-bold italic text-white mb-4">
          {event.bride_name} & {event.groom_name}
        </h3>
        <p className="text-white/70 text-sm leading-loose">
          {settings.closingText}
        </p>
        <p className="text-white/70 text-sm leading-loose mt-6 italic">
          {settings.closingGreeting}
        </p>
      </motion.div>
    </section>
  )
}
