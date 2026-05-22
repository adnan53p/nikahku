'use client'

import { useMemo, useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'
import type { Event } from '@/types'

export function AiInvitationGenerator({ event }: { event: Event }) {
  const [copied, setCopied] = useState(false)

  const generatedText = useMemo(() => {
    const e = event as any
    return e.ai_invitation_text || `Assalamu’alaikum Warahmatullahi Wabarakatuh.

Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan ${event.bride_name} dan ${event.groom_name}.

Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Wassalamu’alaikum Warahmatullahi Wabarakatuh.`
  }, [event])

  const copyText = async () => {
    await navigator.clipboard.writeText(generatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if ((event as any).ai_invitation_enabled === false) return null

  return (
    <section data-scroll-section className="py-16 px-5 bg-white text-center">
      <div className="max-w-xl mx-auto rounded-[2rem] border border-gold-100 bg-champagne/30 p-6 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-gold-100 mx-auto flex items-center justify-center mb-4">
          <Sparkles size={20} className="text-gold-600" />
        </div>
        <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">AI Invitation</p>
        <h2 className="font-display text-3xl font-bold italic text-elegant mb-4">Ucapan Undangan Otomatis</h2>
        <p className="text-elegant/55 text-sm leading-loose whitespace-pre-line">{generatedText}</p>
        <button onClick={copyText} className="mt-6 inline-flex items-center gap-2 rounded-full bg-elegant text-champagne px-5 py-3 text-sm">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Tersalin' : 'Salin Kata-kata'}
        </button>
      </div>
    </section>
  )
}
