'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Save, Calendar, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { eventSchema, type EventInput } from '@/lib/validations'
import { createEvent, updateEvent } from '@/services/event.service'
import { useAuth } from '@/hooks/useAuth'
import type { EventRow } from '@/types'

interface EventModalProps {
  event?: EventRow
  onClose: () => void
  onSuccess: () => void
}

export function EventModal({ event, onClose, onSuccess }: EventModalProps) {
  const { user } = useAuth()
  const isEdit = !!event

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      title: event.title,
      bride_name: event.bride_name,
      groom_name: event.groom_name,
      bride_parents: event.bride_parents || '',
      groom_parents: event.groom_parents || '',
      event_date: event.event_date,
      event_time: event.event_time,
      venue_name: event.venue_name,
      venue_address: event.venue_address,
      venue_maps_url: event.venue_maps_url || '',
      reception_date: event.reception_date || '',
      reception_time: event.reception_time || '',
      reception_venue: event.reception_venue || '',
    } : {},
  })

  const onSubmit = async (data: EventInput) => {
    if (!user) return
    try {
      if (isEdit) {
        await updateEvent(event.id, data)
        toast.success('Undangan berhasil diperbarui!')
      } else {
        await createEvent(user.id, data)
        toast.success('Undangan berhasil dibuat! 🎉')
      }
      onSuccess()
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'Terjadi kesalahan')
    }
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-elegant/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl shadow-elegant-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-champagne/50">
          <div>
            <h2 className="font-display text-xl font-bold text-elegant">
              {isEdit ? 'Edit Undangan' : 'Buat Undangan Baru'}
            </h2>
            <p className="text-elegant/40 text-xs font-sans mt-0.5">
              {isEdit ? 'Perbarui detail undangan Anda' : 'Isi detail untuk undangan pernikahan'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-champagne transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <form id="event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Mempelai */}
            <section>
              <h3 className="text-xs font-semibold text-elegant/50 uppercase tracking-wider font-sans mb-4">
                Data Mempelai
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-elegant">Nama Mempelai Wanita *</label>
                  <input {...register('bride_name')} className="input-elegant" placeholder="Siti Rahma" />
                  {errors.bride_name && <p className="text-red-500 text-xs mt-1">{errors.bride_name.message}</p>}
                </div>
                <div>
                  <label className="label-elegant">Nama Mempelai Pria *</label>
                  <input {...register('groom_name')} className="input-elegant" placeholder="Adnan Pratama" />
                  {errors.groom_name && <p className="text-red-500 text-xs mt-1">{errors.groom_name.message}</p>}
                </div>
                <div>
                  <label className="label-elegant">Orang Tua Mempelai Wanita</label>
                  <input {...register('bride_parents')} className="input-elegant" placeholder="Putri dari Bpk. A & Ibu B" />
                </div>
                <div>
                  <label className="label-elegant">Orang Tua Mempelai Pria</label>
                  <input {...register('groom_parents')} className="input-elegant" placeholder="Putra dari Bpk. C & Ibu D" />
                </div>
              </div>
            </section>

            {/* Judul */}
            <section>
              <label className="label-elegant">Judul Undangan *</label>
              <input
                {...register('title')}
                className="input-elegant"
                placeholder="The Wedding of Adnan & Siti"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </section>

            {/* Akad */}
            <section>
              <h3 className="text-xs font-semibold text-elegant/50 uppercase tracking-wider font-sans mb-4 flex items-center gap-2">
                <Calendar size={12} /> Akad Nikah *
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-elegant">Tanggal *</label>
                  <input {...register('event_date')} type="date" className="input-elegant" />
                  {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date.message}</p>}
                </div>
                <div>
                  <label className="label-elegant">Waktu *</label>
                  <input {...register('event_time')} type="time" className="input-elegant" />
                  {errors.event_time && <p className="text-red-500 text-xs mt-1">{errors.event_time.message}</p>}
                </div>
              </div>
            </section>

            {/* Resepsi */}
            <section>
              <h3 className="text-xs font-semibold text-elegant/50 uppercase tracking-wider font-sans mb-4">
                Resepsi (opsional)
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-elegant">Tanggal Resepsi</label>
                  <input {...register('reception_date')} type="date" className="input-elegant" />
                </div>
                <div>
                  <label className="label-elegant">Waktu Resepsi</label>
                  <input {...register('reception_time')} type="time" className="input-elegant" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-elegant">Nama Venue Resepsi</label>
                  <input {...register('reception_venue')} className="input-elegant" placeholder="Hotel Grand Ballroom" />
                </div>
              </div>
            </section>

            {/* Venue */}
            <section>
              <h3 className="text-xs font-semibold text-elegant/50 uppercase tracking-wider font-sans mb-4 flex items-center gap-2">
                <MapPin size={12} /> Lokasi Akad *
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="label-elegant">Nama Venue *</label>
                  <input {...register('venue_name')} className="input-elegant" placeholder="Masjid Al-Azhar" />
                  {errors.venue_name && <p className="text-red-500 text-xs mt-1">{errors.venue_name.message}</p>}
                </div>
                <div>
                  <label className="label-elegant">Alamat Lengkap *</label>
                  <textarea
                    {...register('venue_address')}
                    className="input-elegant resize-none"
                    rows={3}
                    placeholder="Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan"
                  />
                  {errors.venue_address && <p className="text-red-500 text-xs mt-1">{errors.venue_address.message}</p>}
                </div>
                <div>
                  <label className="label-elegant">Link Google Maps</label>
                  <input {...register('venue_maps_url')} className="input-elegant" placeholder="https://maps.google.com/..." />
                  {errors.venue_maps_url && <p className="text-red-500 text-xs mt-1">{errors.venue_maps_url.message}</p>}
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-champagne/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">Batal</button>
          <button
            type="submit"
            form="event-form"
            disabled={isSubmitting}
            className="btn-gold disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </div>
            ) : (
              <><Save size={15} /> {isEdit ? 'Perbarui' : 'Buat Undangan'}</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
