'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/utils'

export function CtaSection() {
  const waLink = getWhatsAppLink(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',
    'Halo Invitely, saya ingin membuat undangan digital premium. Bisa bantu?'
  )

  return (
    <section className="py-24 bg-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-champagne/30 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold border border-gold-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-medium text-gold-700 font-sans">
              Mulai Sekarang, Gratis
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-elegant leading-tight mb-6">
            Wujudkan Undangan{' '}
            <span className="gold-text italic">Impian</span>{' '}
            Kalian
          </h2>

          <p className="text-elegant/60 text-lg font-sans leading-relaxed mb-10 max-w-xl mx-auto">
            Ribuan pasangan telah mempercayakan momen spesial mereka kepada Invitely.
            Giliran kalian menceritakan kisah cinta yang indah.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-gold text-base px-10 py-4 group">
              Buat Undangan Sekarang
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold text-base px-10 py-4 flex items-center gap-2 justify-center"
            >
              <MessageCircle size={18} />
              Tanya via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
