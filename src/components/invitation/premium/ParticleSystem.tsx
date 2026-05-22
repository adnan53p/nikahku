'use client'

import { motion } from 'framer-motion'
import type { PremiumInvitationSettings } from '@/lib/invitationPremium'

export function ParticleSystem({ mode = 'sparkle' }: { mode?: PremiumInvitationSettings['particleMode'] }) {
  if (!mode || mode === 'none') return null

  const icons: Record<string, string[]> = {
    sparkle: ['✦', '✧', '✨', '✦', '✧'],
    flower: ['❀', '✿', '❁', '❀', '✿'],
    goldDust: ['•', '∙', '✦', '•', '∙'],
    heart: ['♡', '♥', '♡', '♥', '♡'],
    snow: ['❄', '❅', '❆', '❄', '❅'],
  }

  const items = icons[mode] || icons.sparkle

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-[var(--inv-accent)]/50 text-lg"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `-${(i % 9) * 8}px`,
          }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{
            y: ['-10vh', '110vh'],
            x: [0, i % 2 === 0 ? 40 : -40, 0],
            opacity: [0, 0.8, 0.25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 9 + (i % 7),
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'linear',
          }}
        >
          {items[i % items.length]}
        </motion.span>
      ))}
    </div>
  )
}
