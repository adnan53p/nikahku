'use client'

import { motion } from 'framer-motion'
import type { PremiumInvitationSettings } from '@/lib/invitationPremium'

export function PremiumQuranSection({ settings }: { settings: PremiumInvitationSettings }) {
  return (
    <section data-scroll-section className="py-20 px-6 text-center bg-[var(--inv-secondary)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="max-w-xl mx-auto rounded-[2rem] border border-[var(--inv-accent)]/25 bg-white/50 backdrop-blur-md p-8 shadow-xl"
      >
        <p className="text-[var(--inv-accent)] text-xs tracking-[0.35em] uppercase mb-4">
          QS Ar-Rum : 21
        </p>
        <p className="leading-loose text-[var(--inv-primary)]/75 italic">
          “{settings.quranText}”
        </p>
      </motion.div>
    </section>
  )
}
