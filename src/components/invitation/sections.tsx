'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Copy, Check, Gift, CreditCard, Calendar, Clock, Camera, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Event, Gallery, GiftAccount, Rsvp } from '@/types'

type StoryItem = {
  year: string
  title: string
  desc: string
  image?: string
}

type ScheduleItem = {
  time: string
  title: string
  desc: string
}

function parseLines(text?: string | null, fallback: string[] = []) {
  return (text || fallback.join('\n'))
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseStoryItems(text?: string | null): StoryItem[] {
  const fallback = [
    '2018|Pertama Bertemu|Pertemuan tak terduga di tempat yang sederhana menjadi awal dari cerita yang indah.|',
    '2020|Mengenal Lebih Dalam|Hari demi hari kami saling memahami, mendukung, dan bertumbuh bersama.|',
    '2022|Melamar|Dengan penuh keberanian dan cinta, sebuah pertanyaan sakral diajukan.|',
    '2026|Hari Pernikahan|Menyempurnakan separuh agama dengan ikatan suci pernikahan.|',
  ]

  return parseLines(text, fallback).map((line) => {
    const [year = '', title = '', desc = '', image = ''] = line.split('|').map((part) => part.trim())
    return { year, title, desc, image }
  })
}

function parseScheduleItems(event: Event): ScheduleItem[] {
  const fallback = [
    `${event.event_time}|Akad Nikah|Prosesi ijab kabul dan doa bersama keluarga.`,
    event.reception_time ? `${event.reception_time}|Resepsi|Ramah tamah dan makan bersama.` : '',
  ].filter(Boolean) as string[]

  return parseLines(event.schedule_items_text, fallback).map((line) => {
    const [time = '', title = '', desc = ''] = line.split('|').map((part) => part.trim())
    return { time, title, desc }
  })
}

// ─── Love Story ───────────────────────────────────────────────────────────────
export function LoveStorySection({ event }: { event?: Event }) {
  const stories = parseStoryItems(event?.love_story_items_text)

  return (
    <section className="py-20 bg-white px-4 overflow-hidden">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">Our Journey</p>
          <h2 className="font-display text-3xl font-bold italic text-elegant">Kisah Cinta Kami</h2>
          <p className="text-elegant/40 text-sm font-sans mt-3">Cerita singkat perjalanan kami menuju pelaminan.</p>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-300 to-transparent" />
          <div className="space-y-8">
            {stories.map((item, i) => (
              <motion.div
                key={`${item.year}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-6 pl-16 relative"
              >
                <div className="absolute left-3.5 top-2 w-5 h-5 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center">
                  <Heart size={9} className="text-white" fill="currentColor" />
                </div>
                <div className="w-full">
                  {item.image && (
                    <div className="mb-3 rounded-2xl overflow-hidden border border-gold-100 bg-champagne">
                      <motion.img src={item.image} alt={item.title} className="w-full h-40 object-cover" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
                    </div>
                  )}
                  <span className="text-gold-500 text-xs font-sans font-semibold">{item.year}</span>
                  <h3 className="font-display text-lg font-bold text-elegant mt-0.5">{item.title}</h3>
                  <p className="text-elegant/50 text-sm font-sans mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Schedule ─────────────────────────────────────────────────────────────────
export function ScheduleSection({ event }: { event: Event }) {
  const items = parseScheduleItems(event)
  if (items.length === 0) return null

  return (
    <section className="py-20 bg-ivory px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">Timeline</p>
          <h2 className="font-display text-3xl font-bold italic text-elegant">Susunan Acara</h2>
          <p className="text-elegant/40 text-sm font-sans mt-3">Rangkaian acara dan waktu pelaksanaan.</p>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={`${item.time}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-elegant p-5 flex gap-4"
            >
              <div className="w-16 flex-shrink-0 text-center">
                <p className="text-gold-600 font-sans font-semibold text-sm">{item.time}</p>
              </div>
              <div className="border-l border-gold-200 pl-4">
                <h3 className="font-display text-lg font-bold text-elegant">{item.title}</h3>
                <p className="text-elegant/50 text-sm font-sans leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Extra Event / Dinner ─────────────────────────────────────────────────────
export function ExtraEventSection({ event }: { event: Event }) {
  if (!event.dinner_date && !event.dinner_venue) return null

  return (
    <section className="py-16 bg-white px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-elegant p-6 text-center"
        >
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">Acara Tambahan</p>
          <h2 className="font-display text-3xl font-bold italic text-elegant mb-4">Makan Malam</h2>
          <div className="space-y-3 text-elegant/60 font-sans text-sm">
            {event.dinner_date && (
              <p className="flex items-center justify-center gap-2"><Calendar size={14} className="text-gold-500" />{formatDate(event.dinner_date)}</p>
            )}
            {(event.dinner_start_time || event.dinner_end_time) && (
              <p className="flex items-center justify-center gap-2"><Clock size={14} className="text-gold-500" />{event.dinner_start_time || ''}{event.dinner_end_time ? ` - ${event.dinner_end_time}` : ''}</p>
            )}
            {event.dinner_venue && <p className="font-semibold text-elegant">{event.dinner_venue}</p>}
            {event.dinner_address && <p>{event.dinner_address}</p>}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export function GallerySection({ galleries }: { galleries: Gallery[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section className="py-20 bg-ivory px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">Gallery</p>
          <h2 className="font-display text-3xl font-bold italic text-elegant">Momen Berharga</h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="columns-2 sm:columns-3 gap-3 space-y-3">
          {galleries.map((gallery, i) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelected(gallery.image_url)}
            >
              <img
                src={gallery.image_url}
                alt={gallery.caption || `Gallery ${i + 1}`}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <img src={selected} className="max-w-full max-h-full rounded-2xl object-contain" alt="Preview" />
          </motion.div>
        )}
      </div>
    </section>
  )
}

// ─── Maps ─────────────────────────────────────────────────────────────────────
export function MapsSection({ event }: { event: Event }) {
  if (!event.venue_maps_url) return null

  return (
    <section className="py-16 bg-white px-4">
      <div className="max-w-lg mx-auto text-center">
        <MapPin size={32} className="text-gold-500 mx-auto mb-4" />
        <h2 className="font-display text-3xl font-bold italic text-elegant mb-2">Lokasi Acara</h2>
        <p className="text-elegant/60 font-sans text-sm mb-4">{event.venue_name}</p>
        <p className="text-elegant/40 font-sans text-xs mb-6">{event.venue_address}</p>
        <a href={event.venue_maps_url} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex">
          <MapPin size={15} /> Buka Google Maps
        </a>
      </div>
    </section>
  )
}

// ─── Gift ─────────────────────────────────────────────────────────────────────
export function GiftSection({ giftAccounts, collapsible = false }: { giftAccounts: GiftAccount[]; collapsible?: boolean | null }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [opened, setOpened] = useState(!collapsible)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Nomor rekening disalin!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="py-20 bg-ivory px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">Hadiah</p>
          <h2 className="font-display text-3xl font-bold italic text-elegant">Amplop Digital</h2>
          <p className="text-elegant/40 font-sans text-sm mt-3">
            Doa restu Anda adalah hadiah terbaik bagi kami. Namun jika ingin memberikan tanda kasih:
          </p>
          <div className="section-divider mt-6" />

          {collapsible && (
            <button onClick={() => setOpened((value) => !value)} className="btn-outline-gold mt-4 inline-flex">
              <Gift size={14} /> {opened ? 'Sembunyikan Amplop' : 'Buka Amplop Digital'} {opened ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </motion.div>

        {opened && (
          <div className="space-y-3">
            {giftAccounts.map((gift, i) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elegant p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-champagne flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} className="text-gold-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-elegant/40 font-sans">{gift.bank_name}</p>
                  <p className="font-sans font-bold text-elegant text-lg tracking-wider">{gift.account_number}</p>
                  <p className="text-elegant/60 font-sans text-xs">{gift.account_name}</p>
                </div>
                <button
                  onClick={() => handleCopy(gift.account_number, gift.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-champagne hover:bg-gold-50 transition-colors"
                >
                  {copiedId === gift.id
                    ? <Check size={14} className="text-emerald-500" />
                    : <Copy size={14} className="text-gold-600" />
                  }
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Wishes ──────────────────────────────────────────────────────────────────
export function WishesSection({ event }: { event: Event }) {
  return (
    <section className="py-20 bg-white px-4 overflow-hidden">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">Ucapan</p>
          <h2 className="font-display text-3xl font-bold italic text-elegant">Doa & Ucapan</h2>
          <div className="section-divider mt-4" />
        </motion.div>
        <WishesList eventId={event.id} />
      </div>
    </section>
  )
}

function WishesList({ eventId }: { eventId: string }) {
  const [wishes, setWishes] = useState<Rsvp[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('rsvp')
      .select('*')
      .eq('event_id', eventId)
      .not('message', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setWishes(data || []))

    const sub = supabase
      .channel('wishes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvp', filter: `event_id=eq.${eventId}` }, (payload) => {
        setWishes((prev) => [payload.new as Rsvp, ...prev].slice(0, 20))
      })
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [eventId])

  if (wishes.length === 0) {
    return (
      <div className="text-center py-8 text-elegant/40 font-sans text-sm">
        Belum ada ucapan. Jadilah yang pertama memberi doa! 💌
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
      {wishes.map((wish) => (
        <div key={wish.id} className="card-elegant p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-white text-xs font-bold">
              {wish.guest_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-elegant font-sans font-semibold text-sm">{wish.guest_name}</p>
              <p className="text-elegant/30 text-xs font-sans">
                {wish.is_attending ? 'Akan hadir' : 'Tidak hadir'}
                {wish.phone ? ` · ${wish.phone}` : ''}
              </p>
            </div>
          </div>
          {wish.custom_answer && <p className="text-elegant/45 text-xs font-sans mb-2">Jawaban tambahan: {wish.custom_answer}</p>}
          <p className="text-elegant/60 text-sm font-sans leading-relaxed italic">"{wish.message}"</p>
        </div>
      ))}
    </div>
  )
}
