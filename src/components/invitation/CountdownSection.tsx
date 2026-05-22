'use client'

import { motion } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'
import type { Event } from '@/types'

export function CountdownSection({ event }: { event: Event }) {
  const countdown = useCountdown(`${event.event_date}T${event.event_time}`)

  const units = [
    { label: 'Hari', value: countdown.days },
    { label: 'Jam', value: countdown.hours },
    { label: 'Menit', value: countdown.minutes },
    { label: 'Detik', value: countdown.seconds },
  ]

  if (countdown.isPast) {
    return (
      <section className="py-16 bg-elegant text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="font-display text-2xl italic text-champagne">Kami Telah Menikah 💍</p>
          <p className="text-champagne/40 font-sans text-sm mt-2">Terima kasih atas doa dan dukungan kalian</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-elegant relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="relative max-w-lg mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans mb-6">
            Menuju Hari Bahagia
          </p>
          <div className="flex items-stretch justify-center gap-3 sm:gap-4">
            {units.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-1 max-w-20"
              >
                <div className="glass-dark rounded-2xl p-3 mb-1.5">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-champagne tabular-nums">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-champagne/40 text-xs font-sans">{unit.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="section-divider mt-8" />
        </motion.div>
      </div>
    </section>
  )
}
