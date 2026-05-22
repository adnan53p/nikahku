'use client'

import { motion } from 'framer-motion'

export function CinematicMode({ active }: { active?: boolean }) {
  if (!active) return null

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-16 bg-gradient-to-b from-black/25 to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-16 bg-gradient-to-t from-black/25 to-transparent" />
      <motion.div
        className="pointer-events-none fixed inset-0 z-10 opacity-25"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, var(--inv-accent), transparent 22%), radial-gradient(circle at 80% 70%, var(--inv-primary), transparent 18%)',
        }}
      />
    </>
  )
}
