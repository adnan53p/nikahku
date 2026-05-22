'use client'

import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

export function formatDate(date?: string) {
  if (!date) return 'Sabtu, 22 Agustus 2026'
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getGalleryImage(item: any) {
  return item?.image_url || item?.url || ''
}

export function useCountdown(date?: string) {
  const [time, setTime] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  React.useEffect(() => {
    const target = new Date(date || '2026-08-22').getTime()

    const tick = () => {
      const diff = target - Date.now()

      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [date])

  return time
}

export function ScrollReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 34, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function BatikCloudPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g opacity="0.45" stroke="currentColor" strokeWidth="0.7">
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((__, col) => {
            const x = col * 60 + 30
            const y = row * 60 + 30
            return (
              <g key={`${row}-${col}`}>
                <path d={`M${x - 18} ${y}c10-18 26-18 36 0-10 18-26 18-36 0Z`} />
                <path d={`M${x} ${y - 18}c18 10 18 26 0 36-18-10-18-26 0-36Z`} />
                <circle cx={x} cy={y} r="2.2" />
              </g>
            )
          })
        )}
      </g>
    </svg>
  )
}

export function FloralLine({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 260 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 48C58 10 89 10 130 42C171 10 202 10 250 48" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M130 42c-10-22 0-33 0-33s10 11 0 33Z" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
      <path d="M98 28c-15-7-24-2-24-2s7 10 24 2ZM162 28c15-7 24-2 24-2s-7 10-24 2Z" stroke="currentColor" strokeWidth="0.8" opacity="0.42" />
      <circle cx="130" cy="42" r="3" fill="currentColor" opacity="0.45" />
    </svg>
  )
}

export function SectionTitle({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="mb-11 text-center">
      <div className="mb-4 flex justify-center text-[#9db3c9]">
        <FloralLine className="h-9 w-40 opacity-70" />
      </div>
      <p className={`mb-2 text-[10px] uppercase tracking-[0.42em] ${dark ? 'text-blue-100/55' : 'text-[#6d8aa5]/70'}`}>{eyebrow}</p>
      <h2 className={`font-serif text-4xl italic leading-tight md:text-5xl ${dark ? 'text-[#f6fbff]' : 'text-[#20364d]'}`}>{title}</h2>
    </div>
  )
}

export function PaperCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[2rem] border border-white/80 bg-white/62 p-5 shadow-[0_24px_80px_rgba(60,91,122,0.13)] backdrop-blur-xl ${className}`}>
      <div className="pointer-events-none absolute inset-[7px] rounded-[1.6rem] border border-[#d5e1ec]/65" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function CopyButton({ text, label = 'Salin' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-[#b5c7d9]/60 bg-white/45 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#3d607f] shadow-sm backdrop-blur-sm transition hover:bg-white/80"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Tersalin' : label}
    </button>
  )
}
