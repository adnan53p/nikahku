'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Apakah undangan digital ini aman dibuka tamu?',
    a: 'Ya, 100% aman. Kami menggunakan domain resmi invitely.id dengan enkripsi HTTPS/SSL. Tampilan kami dirancang profesional agar tidak terlihat seperti link phishing atau spam.',
  },
  {
    q: 'Apakah tamu perlu download aplikasi?',
    a: 'Tidak perlu sama sekali. Undangan dibuka langsung dari browser smartphone, baik Chrome, Safari, maupun browser lainnya.',
  },
  {
    q: 'Bagaimana cara kirim ke ratusan tamu?',
    a: 'Upload file Excel berisi nama dan nomor tamu. Sistem akan otomatis generate link unik per tamu lengkap dengan nama mereka. Tersedia tombol share WhatsApp satu klik.',
  },
  {
    q: 'Apakah ada batas waktu akses undangan?',
    a: 'Undangan aktif selama minimal 1 tahun setelah tanggal pernikahan, sehingga tamu masih bisa melihat kenangan dan foto.',
  },
  {
    q: 'Bisakah saya ubah desain setelah publish?',
    a: 'Bisa. Anda bisa mengubah data, foto, musik, dan tema kapan saja melalui dashboard. Perubahan langsung tampil di undangan.',
  },
  {
    q: 'Bagaimana cara tamu konfirmasi kehadiran?',
    a: 'Di halaman undangan tersedia form RSVP. Tamu cukup isi nama, status kehadiran, jumlah tamu, dan ucapan. Data langsung masuk ke dashboard Anda secara realtime.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-sans font-medium mb-4">
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-elegant">
            Pertanyaan Umum
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-elegant overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-sans font-medium text-elegant text-sm pr-4">
                  {faq.q}
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${open === i ? 'bg-gold-gradient' : 'bg-champagne'}`}>
                  {open === i
                    ? <Minus size={12} className="text-white" />
                    : <Plus size={12} className="text-gold-600" />
                  }
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="px-5 pb-5 text-elegant/60 text-sm leading-relaxed font-sans">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
