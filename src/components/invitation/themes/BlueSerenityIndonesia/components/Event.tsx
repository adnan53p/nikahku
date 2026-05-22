'use client'

import { Calendar, Clock, MapPin } from 'lucide-react'
import { BatikCloudPattern, formatDate, PaperCard, SectionTitle, useCountdown } from './shared'

export default function Event({ event }: { event: any }) {
  const countdown = useCountdown(event.akad_date || event.wedding_date)

  return (
    <>
      <section className="relative overflow-hidden bg-[#20364d] px-6 py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(185,214,239,.25),transparent_35%)]" />
        <BatikCloudPattern className="absolute -left-20 top-0 h-80 w-80 text-white/10" />
        <div className="relative mx-auto max-w-3xl">
          <SectionTitle eyebrow="Menghitung Hari" title="Menuju Hari Bahagia" dark />
          <div className="grid grid-cols-4 gap-3">
            {[
              ['Hari', countdown.days],
              ['Jam', countdown.hours],
              ['Menit', countdown.minutes],
              ['Detik', countdown.seconds],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/15 bg-white/10 px-2 py-5 shadow-[0_20px_60px_rgba(0,0,0,.12)] backdrop-blur-md">
                <p className="font-serif text-3xl text-white">{String(value).padStart(2, '0')}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-blue-100/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blue-paper px-6 py-24 soft-grain">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Rangkaian Acara" title="Waktu & Tempat" />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: 'Akad Nikah', date: event.akad_date || event.wedding_date, time: event.akad_time },
              { title: 'Resepsi', date: event.reception_date || event.akad_date, time: event.reception_time },
            ].map((item) => (
              <PaperCard key={item.title} className="text-center">
                <p className="mb-5 font-serif text-3xl italic text-[#20364d]">{item.title}</p>
                <div className="space-y-4 text-sm text-[#4c6d8b]">
                  <p className="flex items-center justify-center gap-3"><Calendar size={16} className="text-[#6d8aa5]" />{formatDate(item.date)}</p>
                  <p className="flex items-center justify-center gap-3"><Clock size={16} className="text-[#6d8aa5]" />{item.time || '08.00 WIB'}</p>
                </div>
              </PaperCard>
            ))}
          </div>
          <PaperCard className="mt-5 text-center">
            <MapPin className="mx-auto mb-3 text-[#6d8aa5]" size={22} />
            <h3 className="mb-2 font-serif text-3xl italic text-[#20364d]">{event.venue_name}</h3>
            <p className="mx-auto mb-6 max-w-md text-sm leading-7 text-[#4c6d8b]/75">{event.venue_address}</p>
            <a href={event.venue_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#9ab7d1]/70 bg-white/55 px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#345b7c] transition hover:bg-white">
              <MapPin size={14} /> Buka Maps
            </a>
          </PaperCard>
        </div>
      </section>
    </>
  )
}
