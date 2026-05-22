'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Mail, Heart } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/types'

interface Props {
  event: Event
  guestName: string | null
  onOpen: () => void
}

export function CoverSection({ event, guestName, onOpen }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden">
      {/* Background */}
      {event.cover_image_url ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.cover_image_url})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#2D2D44] to-[#1A1A2E]" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />

      {/* Decorative pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5" />

      {/* Gold corner ornaments */}
      <div className="absolute top-6 left-6 w-16 h-16 opacity-40">
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2 L30 2 M2 2 L2 30" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M8 8 L22 8 M8 8 L8 22" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </div>
      <div className="absolute top-6 right-6 w-16 h-16 opacity-40 scale-x-[-1]">
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2 L30 2 M2 2 L2 30" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M8 8 L22 8 M8 8 L8 22" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </div>
      <div className="absolute bottom-6 left-6 w-16 h-16 opacity-40 scale-y-[-1]">
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2 L30 2 M2 2 L2 30" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 w-16 h-16 opacity-40 scale-[-1]">
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2 L30 2 M2 2 L2 30" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Top content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 pt-16 pb-8 w-full max-w-md mx-auto">
        {/* Guest address */}
        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-champagne/50 text-xs tracking-[0.25em] uppercase font-sans mb-1">
              Kepada Yth.
            </p>
            <p className="text-champagne text-lg font-display font-semibold">
              {guestName}
            </p>
          </motion.div>
        )}

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="text-champagne/50 text-xs tracking-[0.4em] uppercase font-sans">
            Undangan Pernikahan
          </p>

          <div className="flex items-center justify-center gap-4 my-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-500/40" />
            <Heart size={16} className="text-gold-400" fill="currentColor" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold italic text-champagne leading-tight">
            {event.bride_name}
            <span className="block text-2xl font-normal not-italic text-gold-400 my-2">&</span>
            {event.groom_name}
          </h1>

          <div className="flex items-center justify-center gap-4 my-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-500/30" />
            <span className="text-gold-400 text-xs">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-500/30" />
          </div>

          <p className="text-champagne/60 text-sm font-sans">
            {formatDate(event.event_date)}
          </p>
          <p className="text-champagne/40 text-xs font-sans">
            {event.venue_name}
          </p>
        </motion.div>
      </div>

      {/* Open button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 pb-12 px-8 text-center w-full max-w-xs mx-auto"
      >
        <button
          onClick={onOpen}
          className="w-full py-4 rounded-2xl bg-gold-gradient text-white font-sans font-medium text-sm shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-pulse-gold flex items-center justify-center gap-2"
        >
          <span>Buka Undangan</span>
          <ChevronDown size={16} />
        </button>
        <p className="text-champagne/30 text-xs font-sans mt-3">
          Ketuk untuk melihat undangan lengkap
        </p>
      </motion.div>
    </div>
  )
}
