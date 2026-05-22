'use client'

import { motion } from 'framer-motion'
import {
  Music, Camera, MapPin, Heart, Users, BarChart3,
  Link2, MessageSquare, Gift, Clock, Palette, Upload
} from 'lucide-react'

const features = [
  { icon: Heart, title: 'Love Story', desc: 'Timeline perjalanan cinta yang mengharukan' },
  { icon: Camera, title: 'Galeri Foto', desc: 'Slider foto premium dengan transisi elegan' },
  { icon: Music, title: 'Musik Latar', desc: 'Autoplay musik favorit kalian otomatis' },
  { icon: Clock, title: 'Countdown Timer', desc: 'Hitung mundur menuju hari spesial' },
  { icon: Users, title: 'RSVP Realtime', desc: 'Konfirmasi kehadiran tamu secara langsung' },
  { icon: MapPin, title: 'Google Maps', desc: 'Embed lokasi untuk navigasi mudah tamu' },
  { icon: Gift, title: 'Amplop Digital', desc: 'Info rekening bank untuk hadiah pernikahan' },
  { icon: MessageSquare, title: 'Ucapan Tamu', desc: 'Guestbook digital penuh kenangan indah' },
  { icon: Link2, title: 'Link Personal', desc: 'Link unik per tamu dengan nama otomatis' },
  { icon: Upload, title: 'Import Excel', desc: 'Upload ratusan tamu sekaligus dari file' },
  { icon: Palette, title: 'Multi Tema', desc: 'Pilih dari berbagai tema premium eksklusif' },
  { icon: BarChart3, title: 'Statistik', desc: 'Pantau siapa yang sudah membuka undangan' },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-sans font-medium mb-4">
            Lengkap & Premium
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-elegant mb-4">
            Semua yang Kalian Butuhkan
          </h2>
          <p className="text-elegant/60 max-w-xl mx-auto font-sans leading-relaxed">
            Fitur lengkap untuk menciptakan undangan digital yang tak terlupakan
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card-elegant p-5 group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-champagne flex items-center justify-center mb-3 group-hover:bg-gold-gradient group-hover:shadow-gold transition-all duration-300">
                <feature.icon
                  size={18}
                  className="text-gold-600 group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="font-sans font-semibold text-elegant text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-elegant/50 text-xs leading-relaxed font-sans">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
