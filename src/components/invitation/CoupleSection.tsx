'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { Event } from '@/types'
import { formatDate } from '@/lib/utils'

export function CoupleSection({ event, guestName }: { event: Event; guestName: string | null }) {
  return (
    <section className="py-20 text-center bg-ivory px-4 relative">
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      <div className="relative max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-6">
            Bismillah, Kami Mengundang
          </p>

          {guestName && (
            <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 glass-gold rounded-2xl border border-gold-200/50">
              <Heart size={14} className="text-gold-500" fill="currentColor" />
              <span className="font-display font-semibold text-elegant">{guestName}</span>
            </div>
          )}

          <p className="text-elegant/50 font-sans text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            Dengan penuh rasa syukur kepada Allah SWT, kami mengundang Anda untuk menyaksikan dan mendoakan pernikahan putra-putri kami:
          </p>

          <div className="space-y-2 mb-6">
            {event.bride_parents && (
              <p className="text-elegant/40 text-xs font-sans">{event.bride_parents}</p>
            )}
            <h2 className="font-display text-4xl sm:text-5xl font-bold italic text-elegant">
              {event.bride_name}
            </h2>
            {event.bride_full_name && (
              <p className="text-elegant/55 text-sm font-sans mt-2">{event.bride_full_name}</p>
            )}
            {event.bride_address && (
              <p className="text-elegant/40 text-xs font-sans mt-2 leading-relaxed">{event.bride_address}</p>
            )}
            {event.bride_instagram && (
              <a href={`https://instagram.com/${event.bride_instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gold-600 text-xs font-sans mt-2 inline-block">
                {event.bride_instagram.startsWith('@') ? event.bride_instagram : `@${event.bride_instagram}`}
              </a>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-gold-400/50 max-w-24" />
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <Heart size={16} className="text-white" fill="currentColor" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold-400/50 to-gold-400/50 max-w-24" />
          </div>

          <div className="space-y-2">
            {event.groom_parents && (
              <p className="text-elegant/40 text-xs font-sans">{event.groom_parents}</p>
            )}
            <h2 className="font-display text-4xl sm:text-5xl font-bold italic text-elegant">
              {event.groom_name}
            </h2>
            {event.groom_full_name && (
              <p className="text-elegant/55 text-sm font-sans mt-2">{event.groom_full_name}</p>
            )}
            {event.groom_address && (
              <p className="text-elegant/40 text-xs font-sans mt-2 leading-relaxed">{event.groom_address}</p>
            )}
            {event.groom_instagram && (
              <a href={`https://instagram.com/${event.groom_instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gold-600 text-xs font-sans mt-2 inline-block">
                {event.groom_instagram.startsWith('@') ? event.groom_instagram : `@${event.groom_instagram}`}
              </a>
            )}
          </div>

          <div className="section-divider mt-10" />

          <div className="mt-8 space-y-2">
            <p className="text-gold-600 font-sans text-sm font-medium">{event.venue_name}</p>
            <p className="text-elegant/50 font-sans text-sm">{formatDate(event.event_date)} · {event.event_time}</p>
            <p className="text-elegant/40 font-sans text-xs">{event.venue_address}</p>
          </div>

          {event.reception_date && (
            <div className="mt-6 p-4 bg-champagne/50 rounded-2xl inline-block text-left">
              <p className="text-xs text-gold-600 font-sans font-medium mb-1">Resepsi</p>
              <p className="text-elegant font-sans text-sm">{formatDate(event.reception_date)} · {event.reception_time}</p>
              {event.reception_venue && (
                <p className="text-elegant/50 font-sans text-xs">{event.reception_venue}</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
