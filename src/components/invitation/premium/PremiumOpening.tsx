'use client'

import { motion } from 'framer-motion'
import type { PremiumInvitationSettings } from '@/lib/invitationPremium'

export function PremiumOpening({ settings }: { settings: PremiumInvitationSettings }) {
  return (
    <section data-scroll-section className="py-20 text-center bg-[var(--inv-bg)] px-5">
      <motion.p
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-[var(--inv-primary)]/70 text-sm leading-relaxed max-w-md mx-auto"
      >
        {settings.openingGreeting}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="text-[var(--inv-primary)]/70 text-sm leading-loose max-w-md mx-auto mt-5"
      >
        {settings.openingText}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-[var(--inv-primary)]/60 text-sm leading-loose max-w-md mx-auto mt-5"
      >
        {settings.invitationText}
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="h-px w-32 bg-gradient-to-r from-transparent via-[var(--inv-accent)] to-transparent mx-auto mt-8"
      />
    </section>
  )
}
