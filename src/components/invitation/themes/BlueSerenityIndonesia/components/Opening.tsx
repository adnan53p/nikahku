'use client'

import { motion } from 'framer-motion'
import { BatikCloudPattern, FloralLine, formatDate, PaperCard } from './shared'

export default function Opening({ event, guestName, onOpen }: { event: any; guestName: string; onOpen: () => void }) {
  return (
    <motion.section
      key="opening"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-5"
    >
      <div className="cloud-blue absolute inset-0 soft-grain" />
      <BatikCloudPattern className="absolute -left-12 top-10 h-64 w-64 text-[#a9c0d5] opacity-25" />
      <BatikCloudPattern className="absolute -bottom-16 -right-8 h-72 w-72 rotate-12 text-[#a9c0d5] opacity-22" />
      <motion.div
        className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#bcd7ef]/45 blur-3xl"
        animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
          style={{ left: `${7 + index * 5.1}%`, top: `${12 + (index % 6) * 13}%` }}
          animate={{ y: [0, -24, 0], opacity: [0, 0.85, 0] }}
          transition={{ duration: 3.6 + (index % 5), repeat: Infinity, delay: index * 0.19 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -left-4 top-8 h-48 w-32 -rotate-6 rounded-[2rem] bg-white/45 shadow-2xl blur-[1px]" />
        <div className="absolute -right-4 bottom-7 h-44 w-32 rotate-6 rounded-[2rem] bg-[#dcebf6]/60 shadow-2xl blur-[1px]" />

        <PaperCard className="p-8 text-center">
          <div className="mb-5 flex justify-center text-[#8fb0cd]">
            <FloralLine className="h-12 w-48" />
          </div>
          <p className="mb-5 text-[10px] uppercase tracking-[0.5em] text-[#6d8aa5]/70">Wedding Invitation</p>
          <h1 className="font-serif text-6xl italic leading-none text-[#20364d]">{event.bride_name}</h1>
          <p className="my-2 font-serif text-4xl italic text-[#84a5c1]">&</p>
          <h1 className="font-serif text-6xl italic leading-none text-[#20364d]">{event.groom_name}</h1>

          <div className="mx-auto my-7 max-w-xs rounded-3xl border border-[#c5d7e7]/70 bg-[#f7fbff]/70 px-6 py-5 shadow-inner">
            <p className="mb-1 text-xs text-[#6d8aa5]/70">Kepada Yth.</p>
            <p className="font-serif text-xl italic text-[#20364d]">{guestName}</p>
          </div>

          <p className="mb-7 text-xs uppercase tracking-[0.28em] text-[#6d8aa5]/70">{formatDate(event.akad_date || event.wedding_date)}</p>

          <button
            onClick={onOpen}
            className="group relative w-full overflow-hidden rounded-full border border-[#9ab7d1]/70 bg-[#dcebf6]/55 px-8 py-4 text-xs uppercase tracking-[0.32em] text-[#345b7c] shadow-[0_16px_40px_rgba(88,128,162,.18)] backdrop-blur-md transition hover:bg-white/70"
          >
            <span className="relative z-10">Open Invitation</span>
            <span className="absolute inset-y-0 left-[-40%] w-1/3 skew-x-[-20deg] bg-white/70 transition-all duration-700 group-hover:left-[120%]" />
          </button>
        </PaperCard>
      </motion.div>
    </motion.section>
  )
}
