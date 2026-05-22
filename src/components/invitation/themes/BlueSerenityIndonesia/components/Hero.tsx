'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { BatikCloudPattern, formatDate, PaperCard, ScrollReveal, SectionTitle } from './shared'
import { useRef } from 'react'

export default function Hero({ event }: { event: any }) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.55])

  return (
    <>
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <img src={event.cover_image_url} alt="Cover" className="h-full w-full scale-105 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#162b42]/55 via-[#d7e9f7]/55 to-[#eaf3fb]" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </motion.div>
        <div className="absolute inset-0 soft-grain" />
        <BatikCloudPattern className="absolute left-4 top-16 h-72 w-72 text-white/35" />
        <BatikCloudPattern className="absolute bottom-0 right-0 h-80 w-80 text-[#6d8aa5]/20" />

        <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-6 text-[10px] uppercase tracking-[0.55em] text-white/90 drop-shadow">Bismillahirrahmanirrahim</p>
          <PaperCard className="mx-auto max-w-xl px-7 py-10">
            <Sparkles className="mx-auto mb-5 text-[#8fb0cd]" size={26} />
            <h2 className="font-serif text-6xl italic leading-none text-[#20364d] md:text-8xl">{event.bride_name}</h2>
            <p className="my-3 font-serif text-4xl italic text-[#8fb0cd]">&</p>
            <h2 className="font-serif text-6xl italic leading-none text-[#20364d] md:text-8xl">{event.groom_name}</h2>
            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-[#6d8aa5]/70">{formatDate(event.akad_date || event.wedding_date)}</p>
          </PaperCard>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-8 flex justify-center text-white/80">
            <ChevronDown size={26} />
          </motion.div>
        </motion.div>
      </section>

      <section className="blue-paper relative px-6 py-20 text-center soft-grain">
        <ScrollReveal className="mx-auto max-w-2xl">
          <p className="mb-6 font-serif text-2xl italic leading-relaxed text-[#20364d] md:text-3xl">
            “Cinta yang dirawat dengan doa akan tumbuh menjadi rumah yang penuh ketenangan.”
          </p>
          <div className="mx-auto mb-6 h-px w-24 bg-[#9ab7d1]/70" />
          <p className="text-sm leading-7 text-[#4c6d8b]/80">
            Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
            agar kamu merasa tenteram kepadanya.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.34em] text-[#6d8aa5]/65">QS. Ar-Rum : 21</p>
        </ScrollReveal>
      </section>

      <section className="blue-paper px-6 py-24 soft-grain">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Mempelai" title="Kedua Insan" />
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                label: 'Mempelai Wanita',
                name: event.bride_name,
                full: event.bride_full_name || event.bride_name,
                father: event.bride_father,
                mother: event.bride_mother,
                photo: event.bride_photo_url,
              },
              {
                label: 'Mempelai Pria',
                name: event.groom_name,
                full: event.groom_full_name || event.groom_name,
                father: event.groom_father,
                mother: event.groom_mother,
                photo: event.groom_photo_url,
              },
            ].map((person, index) => (
              <ScrollReveal key={person.label} delay={index * 0.12}>
                <PaperCard className="text-center">
                  <div className="mx-auto mb-6 h-80 overflow-hidden rounded-[1.7rem] border border-white/80 bg-[#dcebf6] shadow-inner">
                    <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                  </div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.34em] text-[#6d8aa5]/70">{person.label}</p>
                  <h3 className="mb-2 font-serif text-4xl italic text-[#20364d]">{person.name}</h3>
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#4c6d8b]/70">{person.full}</p>
                  <div className="mx-auto mb-4 h-px w-20 bg-[#9ab7d1]/55" />
                  <p className="text-sm leading-7 text-[#4c6d8b]/75">Putra/i dari<br />{person.father || 'Bapak'}<br />& {person.mother || 'Ibu'}</p>
                </PaperCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
