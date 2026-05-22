'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Opening from './components/Opening'
import Hero from './components/Hero'
import Event from './components/Event'
import Gallery from './components/Gallery'
import RSVP from './components/RSVP'
import Footer from './components/Footer'
import { Music2, Pause, Play } from 'lucide-react'
import { AutoScrollControl } from '../../AutoScrollControl'

export type BlueSerenityEvent = {
  bride_name?: string
  groom_name?: string
  bride_full_name?: string
  groom_full_name?: string
  bride_father?: string
  bride_mother?: string
  groom_father?: string
  groom_mother?: string
  cover_image_url?: string
  bride_photo_url?: string
  groom_photo_url?: string
  akad_date?: string
  akad_time?: string
  reception_date?: string
  reception_time?: string
  venue_name?: string
  venue_address?: string
  venue_maps_url?: string
  galleries?: Array<{ id?: string; image_url?: string; url?: string; caption?: string | null }>
  gift_accounts?: Array<{ id?: string; bank_name?: string; account_number?: string; account_name?: string }>
  qris_image_url?: string
  music_url?: string
  slug?: string
}

type Props = {
  event?: BlueSerenityEvent
  guest?: any
  guestName?: string | null
}

const FALLBACK_EVENT: BlueSerenityEvent = {
  bride_name: 'Nadira',
  groom_name: 'Raka',
  bride_full_name: 'Nadira Aulia Putri',
  groom_full_name: 'Raka Pratama Wijaya',
  bride_father: 'Bapak H. Santoso',
  bride_mother: 'Ibu Hj. Lestari',
  groom_father: 'Bapak H. Wijaya',
  groom_mother: 'Ibu Hj. Ratna',
  akad_date: '2026-08-22',
  akad_time: '08.00 WIB',
  reception_date: '2026-08-22',
  reception_time: '11.00 - 14.00 WIB',
  venue_name: 'The Grand Ballroom Indonesia',
  venue_address: 'Jakarta, Indonesia',
  venue_maps_url: 'https://maps.google.com',
  cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90',
  bride_photo_url: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=90',
  groom_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=90',
  galleries: [
    { image_url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=90', caption: 'Akad penuh haru' },
    { image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=90', caption: 'Resepsi hangat' },
    { image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=90', caption: 'Momen bahagia' },
    { image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=90', caption: 'Cinta dan doa' },
  ],
  gift_accounts: [
    { bank_name: 'BCA', account_number: '1234567890', account_name: 'Nadira Aulia Putri' },
    { bank_name: 'Mandiri', account_number: '0987654321', account_name: 'Raka Pratama Wijaya' },
  ],
  qris_image_url: '',
  music_url: '',
  slug: 'nadira-raka',
}

function useQueryGuestName() {
  const [name, setName] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setName(params.get('to') || '')
  }, [])

  return name
}

export default function BlueSerenityIndonesia({ event: eventProp, guestName: guestNameProp }: Props) {
  const event = { ...FALLBACK_EVENT, ...(eventProp || {}) }
  const queryGuestName = useQueryGuestName()
  const guestName = guestNameProp || queryGuestName || 'Bapak/Ibu/Saudara/i'
  const [opened, setOpened] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!event.music_url) return
    const audio = new Audio(event.music_url)
    audio.loop = true
    audio.volume = 0.32
    audioRef.current = audio

    return () => audio.pause()
  }, [event.music_url])

  const handleOpen = async () => {
    setOpened(true)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)

    if (audioRef.current) {
      await audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {})
    }
  }

  const toggleMusic = async () => {
    if (!audioRef.current) return

    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      await audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {})
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eaf3fb] text-[#20364d]">
      <style>{`
        .blue-paper {
          background-image:
            radial-gradient(circle at 12% 14%, rgba(255,255,255,.82), transparent 24%),
            radial-gradient(circle at 80% 10%, rgba(182,207,229,.55), transparent 28%),
            radial-gradient(circle at 50% 100%, rgba(126,162,194,.24), transparent 36%),
            linear-gradient(135deg, #f9fbfb 0%, #eaf3fb 46%, #f8f3e9 100%);
        }
        .cloud-blue {
          background-image:
            radial-gradient(circle at 20% 18%, rgba(255,255,255,.74), transparent 23%),
            radial-gradient(circle at 78% 24%, rgba(168,199,225,.45), transparent 31%),
            radial-gradient(circle at 45% 78%, rgba(255,255,255,.58), transparent 28%),
            linear-gradient(150deg, #dfeefa 0%, #f9fbfb 45%, #d8e7f3 100%);
        }
        .soft-grain:before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
        }
      `}</style>

      <AnimatePresence>
        {!opened && <Opening event={event} guestName={guestName} onOpen={handleOpen} />}
      </AnimatePresence>

      {opened && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <AutoScrollControl enabled={true} autoStart={true} startDelay={1000} pausePerSection={0} scrollDuration={2600}
            scrollSpeedPxPerSecond={155} />
          <div data-scroll-section><Hero event={event} /></div>
          <div data-scroll-section><Event event={event} /></div>
          <div data-scroll-section><Gallery event={event} /></div>
          <div data-scroll-section><RSVP event={event} guestName={guestName} /></div>
          <div data-scroll-section><Footer event={event} guestName={guestName} /></div>
        </motion.main>
      )}

      {opened && event.music_url && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-[#20364d]/88 text-white shadow-2xl backdrop-blur-md"
        >
          {musicPlaying ? <Pause size={17} /> : <Play size={17} />}
          <Music2 size={12} className="absolute -right-1 -top-1 text-blue-100" />
        </button>
      )}
    </div>
  )
}
