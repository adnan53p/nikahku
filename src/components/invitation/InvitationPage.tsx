'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Volume2, VolumeX } from 'lucide-react'
import type { Event, Guest } from '@/types'
import { CoverSection } from './CoverSection'
import { CountdownSection } from './CountdownSection'
import { CoupleSection } from './CoupleSection'
import { LoveStorySection, GallerySection, GiftSection, WishesSection, MapsSection, ScheduleSection, ExtraEventSection } from './sections'
import { AutoScrollControl } from './AutoScrollControl'
import { RsvpSection } from './RsvpSection'
import IslamicLuxury from './themes/IslamicLuxury'
import PendopoSenja from './themes/PendopoSenja/PendopoSenja'
import BlueSerenityIndonesia from './themes/BlueSerenityIndonesia/BlueSerenityIndonesia'
import { PremiumParticles } from './premium/PremiumParticles'
import { ThemeStyleInjector } from './premium/ThemeStyleInjector'
import { VoiceNarration } from './premium/VoiceNarration'
import { AiInvitationGenerator } from './premium/AiInvitationGenerator'

interface Props {
  event: Event
  guest: Guest | null
  guestName: string | null
}

function ClassicElegantTemplate({ event, guest, guestName }: Props) {
  const [opened, setOpened] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeMusic = event.event_music?.find((m) => m.is_active)

  useEffect(() => {
    if (activeMusic?.audio_url) {
      audioRef.current = new Audio(activeMusic.audio_url)
      audioRef.current.loop = true
      audioRef.current.volume = 0.4
    }
    return () => audioRef.current?.pause()
  }, [activeMusic])

  const handleOpen = () => {
    setOpened(true)
    audioRef.current?.play().then(() => setMusicPlaying(true)).catch(() => {})
  }

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.play()
      setMusicPlaying(true)
    }
  }

  return (
    <div className="dynamic-theme min-h-screen bg-ivory font-body overflow-x-hidden">
      <ThemeStyleInjector event={event} />
      <PremiumParticles event={event} mode={(event as any).particle_mode} />
      <AnimatePresence>
        {!opened && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.8 }} className="fixed inset-0 z-50">
            <CoverSection event={event} guestName={guestName} onOpen={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            {activeMusic && (
              <motion.button onClick={toggleMusic} className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-elegant text-champagne shadow-elegant-lg flex items-center justify-center">
                {musicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </motion.button>
            )}
            <AutoScrollControl enabled={true} autoStart={true} startDelay={1000} pausePerSection={0} scrollDuration={2600}
            scrollSpeedPxPerSecond={155} />
            <VoiceNarration event={event} guest={guest} guestName={guestName} />
            <section data-scroll-section className="py-16 text-center bg-ivory">
              <p className="font-body italic text-2xl text-elegant/60 mb-3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
              <p className="text-elegant/40 text-sm font-sans max-w-sm mx-auto leading-relaxed px-4">Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.</p>
              <p className="text-elegant/30 text-xs font-sans mt-2">(QS. Ar-Rum: 21)</p>
              <div className="section-divider mt-8" />
            </section>
            <div data-scroll-section><CoupleSection event={event} guestName={guestName} /></div>
            <div data-scroll-section><CountdownSection event={event} /></div>
            <div data-scroll-section><LoveStorySection event={event} /></div>
            <div data-scroll-section><ScheduleSection event={event} /></div>
            <div data-scroll-section><ExtraEventSection event={event} /></div>
            {event.galleries && event.galleries.length > 0 && <div data-scroll-section><GallerySection galleries={event.galleries} /></div>}
            {event.venue_maps_url && <div data-scroll-section><MapsSection event={event} /></div>}
            <div data-scroll-section><RsvpSection event={event} guest={guest} /></div>
            <div data-scroll-section><WishesSection event={event} /></div>
            {event.gift_accounts && event.gift_accounts.length > 0 && <div data-scroll-section><GiftSection giftAccounts={event.gift_accounts} collapsible={event.gift_is_collapsible} /></div>}
            <AiInvitationGenerator event={event} />
            <section data-scroll-section className="py-20 text-center bg-elegant relative overflow-hidden">
              <Heart size={32} className="text-gold-400 mx-auto mb-6" fill="currentColor" />
              <h3 className="font-display text-3xl font-bold italic text-champagne mb-4">{event.bride_name} & {event.groom_name}</h3>
              <p className="text-champagne/50 font-sans text-sm max-w-sm mx-auto leading-relaxed">Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function InvitationPage({ event, guest, guestName }: Props) {
  const themeSlug = event.theme_slug || event.themes?.slug || event.theme?.slug || 'classic-elegant'

  if (themeSlug === 'islamic-luxury') {
    return <IslamicLuxury event={event} guest={guest} guestName={guestName} />
  }

  if (themeSlug === 'pendopo-senja') {
    return <PendopoSenja event={event} guest={guest} guestName={guestName} />
  }

  if (themeSlug === 'blue-serenity-indonesia') {
    return <BlueSerenityIndonesia event={event as any} guest={guest} guestName={guestName} />
  }

  // Template baru tahap 3 memakai engine klasik dengan style dinamis
  if (themeSlug === 'royal-garden' || themeSlug === 'modern-minimal' || themeSlug === 'cinematic-gold') {
    return <ClassicElegantTemplate event={event} guest={guest} guestName={guestName} />
  }

  return <ClassicElegantTemplate event={event} guest={guest} guestName={guestName} />
}
