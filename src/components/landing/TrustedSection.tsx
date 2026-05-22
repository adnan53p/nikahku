'use client'

import { motion } from 'framer-motion'
import { Shield, Smartphone, Download, Lock, Globe, Zap } from 'lucide-react'

const trustedItems = [
  {
    icon: Shield,
    title: 'HTTPS Secure',
    desc: 'Semua koneksi dilindungi enkripsi SSL 256-bit',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Smartphone,
    title: 'Tanpa Aplikasi',
    desc: 'Dibuka langsung dari browser, mudah dan cepat',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Download,
    title: 'Tanpa Download',
    desc: 'Tidak perlu instal apapun di smartphone tamu',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Lock,
    title: 'Data Aman',
    desc: 'Data tamu tersimpan aman di server terenkripsi',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Globe,
    title: 'Domain Terpercaya',
    desc: 'Link dari domain resmi, bukan link random/singkat',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: Zap,
    title: 'Akses Instan',
    desc: 'Loading cepat, tidak menunggu lama',
    color: 'text-gold-600',
    bg: 'bg-gold-50',
  },
]

export function TrustedSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-sans font-medium mb-4">
            Aman & Terpercaya
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-elegant mb-4">
            Bukan Link Sembarangan
          </h2>
          <p className="text-elegant/60 max-w-xl mx-auto font-sans leading-relaxed">
            Kami mengerti kekhawatiran tamu soal keamanan link digital.
            Invitely dirancang agar terlihat profesional dan terpercaya.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {trustedItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-elegant p-5 lg:p-6 group"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={18} className={item.color} />
              </div>
              <h3 className="font-sans font-semibold text-elegant text-sm mb-1.5">
                {item.title}
              </h3>
              <p className="text-elegant/50 text-xs leading-relaxed font-sans">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 glass-gold rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="font-sans font-semibold text-elegant text-sm">
                Terverifikasi & Aman Diakses
              </p>
              <p className="text-elegant/50 text-xs font-sans">
                invitely.id — domain resmi terdaftar Indonesia
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 font-sans">
              100% Aman Dibuka
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
