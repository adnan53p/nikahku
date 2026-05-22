'use client'

import { useMemo, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import type { Event, Guest } from '@/types'

export function VoiceNarration({ event, guest, guestName }: { event: Event; guest?: Guest | null; guestName?: string | null }) {
  const [speaking, setSpeaking] = useState(false)

  const text = useMemo(() => {
    const e = event as any
    return e.voice_narration_text || `Selamat datang ${guestName || guest?.name || 'Bapak Ibu Saudara/i'} di undangan pernikahan ${event.bride_name} dan ${event.groom_name}. Dengan penuh rasa bahagia, kami mengundang Anda untuk hadir dan memberikan doa restu.`
  }, [event, guest, guestName])

  const toggle = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'
    utterance.rate = 0.88
    utterance.pitch = 1
    utterance.onend = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  if ((event as any).voice_narration_enabled === false) return null

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-white/90 text-elegant shadow-xl flex items-center justify-center border border-gold-200 backdrop-blur-md"
      title="Voice narration"
    >
      {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  )
}
