'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heart, Send, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { rsvpSchema, type RsvpInput } from '@/lib/validations'
import { submitRsvp } from '@/services/event.service'
import type { Event, Guest } from '@/types'

interface Props {
  event: Event
  guest: Guest | null
}

export function RsvpSection({ event, guest }: Props) {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guest_name: guest?.name || '',
      is_attending: true,
      guest_count: 1,
      phone: guest?.phone || '',
      custom_answer: '',
    },
  })

  const isAttending = watch('is_attending')

  const onSubmit = async (data: RsvpInput) => {
    try {
      await submitRsvp({
        event_id: event.id,
        guest_id: guest?.id,
        ...data,
      })
      setSubmitted(true)
      toast.success('RSVP berhasil dikirim! Terima kasih 💌')
    } catch {
      toast.error('Gagal mengirim RSVP. Coba lagi.')
    }
  }

  return (
    <section className="py-20 bg-elegant relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-hero-pattern opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="relative max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans mb-3">Konfirmasi</p>
          <h2 className="font-display text-3xl font-bold italic text-champagne">RSVP</h2>
          <p className="text-champagne/40 font-sans text-sm mt-3">
            Mohon konfirmasi kehadiran Anda paling lambat 7 hari sebelum acara.
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto mb-4 flex items-center justify-center shadow-gold">
              <Check size={28} className="text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold italic text-champagne mb-2">
              Terima Kasih!
            </h3>
            <p className="text-champagne/50 font-sans text-sm">
              Konfirmasi kehadiran Anda telah diterima. Kami sangat menantikan kehadiran Anda!
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Name */}
            <div>
              <label className="text-champagne/60 text-xs font-sans mb-1.5 block">Nama Lengkap *</label>
              <input
                {...register('guest_name')}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-champagne/20 text-champagne placeholder:text-champagne/30 text-sm font-sans focus:outline-none focus:border-gold-400/50 focus:bg-white/15 transition-all"
                placeholder="Nama Anda"
              />
              {errors.guest_name && <p className="text-red-400 text-xs mt-1 font-sans">{errors.guest_name.message}</p>}
            </div>

            {/* Attendance toggle */}
            <div>
              <label className="text-champagne/60 text-xs font-sans mb-3 block">Konfirmasi Kehadiran *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('is_attending', true)}
                  className={`py-3.5 rounded-xl border text-sm font-sans font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isAttending
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'border-champagne/20 text-champagne/50 hover:border-champagne/40'
                  }`}
                >
                  <Heart size={14} fill={isAttending ? 'currentColor' : 'none'} />
                  Insya Allah Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setValue('is_attending', false)}
                  className={`py-3.5 rounded-xl border text-sm font-sans font-medium transition-all duration-200 ${
                    !isAttending
                      ? 'bg-white/20 border-champagne/50 text-champagne'
                      : 'border-champagne/20 text-champagne/50 hover:border-champagne/40'
                  }`}
                >
                  Tidak Hadir
                </button>
              </div>
            </div>

            {/* Guest count (only if attending) */}
            {isAttending && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-champagne/60 text-xs font-sans mb-1.5 block">Jumlah Tamu *</label>
                <select
                  {...register('guest_count', { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-champagne/20 text-champagne text-sm font-sans focus:outline-none focus:border-gold-400/50 transition-all appearance-none"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n} className="bg-elegant text-champagne">{n} orang</option>
                  ))}
                </select>
              </motion.div>
            )}

            {/* Message */}
            <div>
              <label className="text-champagne/60 text-xs font-sans mb-1.5 block">Doa & Ucapan (opsional)</label>
              <textarea
                {...register('message')}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-champagne/20 text-champagne placeholder:text-champagne/30 text-sm font-sans focus:outline-none focus:border-gold-400/50 transition-all resize-none"
                rows={3}
                placeholder="Tulis doa dan ucapan untuk kedua mempelai..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gold py-4 text-base disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send size={16} />
                  Kirim Konfirmasi
                </div>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
