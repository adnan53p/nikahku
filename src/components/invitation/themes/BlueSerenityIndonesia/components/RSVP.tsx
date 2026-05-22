'use client'

import { useEffect, useState } from 'react'
import { Heart, Send } from 'lucide-react'
import { PaperCard, SectionTitle } from './shared'

export default function RSVP({ guestName }: { event: any; guestName: string }) {
  const [rsvpSent, setRsvpSent] = useState(false)
  const [rsvp, setRsvp] = useState({ name: guestName, attendance: 'hadir', count: 1, message: '' })

  useEffect(() => {
    setRsvp((prev) => ({ ...prev, name: guestName }))
  }, [guestName])

  return (
    <section className="blue-paper px-6 py-24 soft-grain">
      <div className="mx-auto max-w-xl">
        <SectionTitle eyebrow="Konfirmasi" title="Kehadiran Tamu" />
        <PaperCard>
          {rsvpSent ? (
            <div className="py-10 text-center">
              <Heart className="mx-auto mb-4 text-[#6d8aa5]" />
              <h3 className="font-serif text-3xl italic text-[#20364d]">Terima Kasih</h3>
              <p className="mt-2 text-sm text-[#4c6d8b]/75">Konfirmasi kehadiran Anda telah kami terima.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <input value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} className="w-full rounded-2xl border border-[#b5c7d9]/60 bg-white/55 px-4 py-3 text-sm outline-none focus:border-[#6d8aa5]" placeholder="Nama lengkap" />
              <div className="grid grid-cols-2 gap-3">
                {['hadir', 'tidak hadir'].map((value) => (
                  <button key={value} onClick={() => setRsvp({ ...rsvp, attendance: value })} className={`rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.2em] ${rsvp.attendance === value ? 'border-[#6d8aa5] bg-[#dcebf6] text-[#20364d]' : 'border-[#b5c7d9]/55 text-[#6d8aa5]'}`}>{value}</button>
                ))}
              </div>
              <textarea value={rsvp.message} onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })} rows={4} className="w-full rounded-2xl border border-[#b5c7d9]/60 bg-white/55 px-4 py-3 text-sm outline-none focus:border-[#6d8aa5]" placeholder="Ucapan dan doa" />
              <button onClick={() => setRsvpSent(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#20364d] px-6 py-4 text-xs uppercase tracking-[0.28em] text-white transition hover:bg-[#162b42]"><Send size={14} /> Kirim Konfirmasi</button>
            </div>
          )}
        </PaperCard>
      </div>
    </section>
  )
}
