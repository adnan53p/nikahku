'use client'

import { motion } from 'framer-motion'
import type { Event } from '@/types'

type ParticleMode = 'sparkle' | 'flower' | 'gold-dust' | 'hearts' | 'none'

export function PremiumParticles({ event, mode }: { event?: Event; mode?: ParticleMode | string | null }) {
  const activeMode = mode || (event as any)?.particle_mode || 'gold-dust'
  if (activeMode === 'none') return null

  const icon = activeMode === 'hearts' ? '♥' : activeMode === 'flower' ? '❀' : '✦'

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {Array.from({ length: 26 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-gold-300/45 text-xs md:text-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `-${(i * 11) % 40}px`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, i % 2 === 0 ? 22 : -22, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.75, 0],
          }}
          transition={{
            duration: 9 + (i % 7),
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'linear',
          }}
        >
          {icon}
        </motion.span>
      ))}
    </div>
  )
}
