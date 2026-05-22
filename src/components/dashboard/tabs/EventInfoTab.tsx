'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, Camera, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { eventSchema, type EventInput } from '@/lib/validations'
import { updateEvent, uploadCoverImage, uploadBridePhoto, uploadGroomPhoto } from '@/services/event.service'
import type { Event } from '@/types'

export function EventInfoTab({ event, onUpdate }: { event: Event; onUpdate: () => void }) {
  const [uploading, setUploading] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      bride_name: event.bride_name,
      groom_name: event.groom_name,
      bride_parents: event.bride_parents || '',
      groom_parents: event.groom_parents || '',
      bride_full_name: event.bride_full_name || '',
      groom_full_name: event.groom_full_name || '',
      bride_address: event.bride_address || '',
      groom_address: event.groom_address || '',
      bride_instagram: event.bride_instagram || '',
      groom_instagram: event.groom_instagram || '',
      dinner_date: event.dinner_date || '',
      dinner_start_time: event.dinner_start_time || '',
      dinner_end_time: event.dinner_end_time || '',
      dinner_venue: event.dinner_venue || '',
      dinner_address: event.dinner_address || '',
      schedule_items_text: event.schedule_items_text || '',
      love_story_items_text: event.love_story_items_text || '',
      custom_rsvp_fields_text: event.custom_rsvp_fields_text || '',
      gift_is_collapsible: !!event.gift_is_collapsible,
      auto_scroll_enabled: !!event.auto_scroll_enabled,
      event_date: event.event_date,
      event_time: event.event_time,
      venue_name: event.venue_name,
      venue_address: event.venue_address,
      venue_maps_url: event.venue_maps_url || '',
      reception_date: event.reception_date || '',
      reception_time: event.reception_time || '',
      reception_venue: event.reception_venue || '',
    },
  })

  const onSubmit = async (data: EventInput) => {
    try {
      await updateEvent(event.id, data)
      toast.success('Berhasil disimpan!')
      onUpdate()
    } catch {
      toast.error('Gagal menyimpan')
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran file maks 5MB'); return }
    setUploading('cover')
    try {
      await uploadCoverImage(event.id, file)
      toast.success('Foto cover diperbarui!')
      onUpdate()
    } catch { toast.error('Gagal upload. Pastikan SQL migration sudah dijalankan dan bucket events aktif.') }
    finally { setUploading(null) }
  }


  const handlePersonPhotoUpload = async (type: 'bride' | 'groom', file?: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran file maks 5MB'); return }
    setUploading(type)
    try {
      if (type === 'bride') await uploadBridePhoto(event.id, file)
      if (type === 'groom') await uploadGroomPhoto(event.id, file)
      toast.success('Foto mempelai diperbarui!')
      onUpdate()
    } catch {
      toast.error('Gagal upload foto mempelai. Pastikan bucket events aktif.')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="card-elegant p-5">
        <h3 className="font-sans font-semibold text-elegant text-sm mb-4">Foto Cover</h3>
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-elegant flex-shrink-0">
            {event.cover_image_url ? (
              <img src={event.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera size={20} className="text-champagne/30" />
              </div>
            )}
            {uploading === 'cover' && (
              <div className="absolute inset-0 bg-elegant/70 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-elegant/60 font-sans mb-3">
              Upload foto cover undangan. Resolusi ideal 1200×800px, maks 5MB.
            </p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading === 'cover'}
              className="btn-outline-gold text-xs"
            >
              <Upload size={13} /> {uploading === 'cover' ? 'Mengunggah...' : 'Ganti Foto'}
            </button>
          </div>
        </div>
      </div>


      {/* Couple Photos */}
      <div className="card-elegant p-5">
        <h3 className="font-sans font-semibold text-elegant text-sm mb-4">Foto Mempelai</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { type: 'bride' as const, label: 'Foto Mempelai Wanita', url: event.bride_photo_url },
            { type: 'groom' as const, label: 'Foto Mempelai Pria', url: event.groom_photo_url },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-4 rounded-2xl border border-champagne/60 p-4">
              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-champagne flex-shrink-0">
                {item.url ? <img src={item.url} alt={item.label} className="w-full h-full object-cover" /> : <Camera size={20} className="text-elegant/25 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {uploading === item.type && <div className="absolute inset-0 bg-elegant/70 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-elegant font-sans mb-2">{item.label}</p>
                <label className="btn-outline-gold text-xs cursor-pointer inline-flex">
                  <Upload size={13} /> {uploading === item.type ? 'Mengunggah...' : 'Upload Foto'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePersonPhotoUpload(item.type, e.target.files?.[0])} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card-elegant p-5">
        <h3 className="font-sans font-semibold text-elegant text-sm mb-4">Detail Undangan</h3>
        <form onSubmit={handleSubmit(onSubmit)} id="info-form" className="space-y-5">
          <div>
            <label className="label-elegant">Judul Undangan *</label>
            <input {...register('title')} className="input-elegant" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-elegant">Mempelai Wanita *</label>
              <input {...register('bride_name')} className="input-elegant" />
              {errors.bride_name && <p className="text-red-500 text-xs mt-1">{errors.bride_name.message}</p>}
            </div>
            <div>
              <label className="label-elegant">Mempelai Pria *</label>
              <input {...register('groom_name')} className="input-elegant" />
              {errors.groom_name && <p className="text-red-500 text-xs mt-1">{errors.groom_name.message}</p>}
            </div>
            <div>
              <label className="label-elegant">Orang Tua Wanita</label>
              <input {...register('bride_parents')} className="input-elegant" placeholder="Putri dari..." />
            </div>
            <div>
              <label className="label-elegant">Orang Tua Pria</label>
              <input {...register('groom_parents')} className="input-elegant" placeholder="Putra dari..." />
            </div>
            <div>
              <label className="label-elegant">Nama Lengkap Wanita</label>
              <input {...register('bride_full_name')} className="input-elegant" placeholder="Nama lengkap mempelai wanita" />
            </div>
            <div>
              <label className="label-elegant">Nama Lengkap Pria</label>
              <input {...register('groom_full_name')} className="input-elegant" placeholder="Nama lengkap mempelai pria" />
            </div>
            <div>
              <label className="label-elegant">Instagram Wanita</label>
              <input {...register('bride_instagram')} className="input-elegant" placeholder="@username" />
            </div>
            <div>
              <label className="label-elegant">Instagram Pria</label>
              <input {...register('groom_instagram')} className="input-elegant" placeholder="@username" />
            </div>
            <div>
              <label className="label-elegant">Alamat Wanita</label>
              <textarea {...register('bride_address')} className="input-elegant resize-none" rows={2} placeholder="Alamat singkat mempelai wanita" />
            </div>
            <div>
              <label className="label-elegant">Alamat Pria</label>
              <textarea {...register('groom_address')} className="input-elegant resize-none" rows={2} placeholder="Alamat singkat mempelai pria" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-elegant">Tanggal Akad *</label>
              <input {...register('event_date')} type="date" className="input-elegant" />
            </div>
            <div>
              <label className="label-elegant">Waktu Akad *</label>
              <input {...register('event_time')} type="time" className="input-elegant" />
            </div>
          </div>

          <div>
            <label className="label-elegant">Nama Venue *</label>
            <input {...register('venue_name')} className="input-elegant" />
            {errors.venue_name && <p className="text-red-500 text-xs mt-1">{errors.venue_name.message}</p>}
          </div>

          <div>
            <label className="label-elegant">Alamat Venue *</label>
            <textarea {...register('venue_address')} className="input-elegant resize-none" rows={3} />
            {errors.venue_address && <p className="text-red-500 text-xs mt-1">{errors.venue_address.message}</p>}
          </div>

          <div>
            <label className="label-elegant">Google Maps URL</label>
            <input {...register('venue_maps_url')} className="input-elegant" placeholder="https://maps.google.com/..." />
          </div>

          <div className="border-t border-champagne/50 pt-4">
            <p className="text-xs text-elegant/40 font-sans mb-4">Resepsi (opsional)</p>
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
                <label className="label-elegant">Venue Resepsi</label>
                <input {...register('reception_venue')} className="input-elegant" />
              </div>
            </div>
          </div>

          <div className="border-t border-champagne/50 pt-4">
            <p className="text-xs text-elegant/40 font-sans mb-4">Makan Malam (opsional)</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-elegant">Tanggal Makan Malam</label>
                <input {...register('dinner_date')} type="date" className="input-elegant" />
              </div>
              <div>
                <label className="label-elegant">Jam Mulai</label>
                <input {...register('dinner_start_time')} type="time" className="input-elegant" />
              </div>
              <div>
                <label className="label-elegant">Jam Selesai</label>
                <input {...register('dinner_end_time')} type="time" className="input-elegant" />
              </div>
              <div>
                <label className="label-elegant">Venue Makan Malam</label>
                <input {...register('dinner_venue')} className="input-elegant" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-elegant">Alamat Makan Malam</label>
                <textarea {...register('dinner_address')} className="input-elegant resize-none" rows={2} />
              </div>
            </div>
          </div>

          <div className="border-t border-champagne/50 pt-4 space-y-4">
            <div>
              <label className="label-elegant">Susunan Acara / Timeline</label>
              <textarea
                {...register('schedule_items_text')}
                className="input-elegant resize-none font-mono text-xs"
                rows={5}
                placeholder={"08:00 - 09:00|Akad Nikah|Prosesi ijab kabul dan doa bersama\n11:00 - 14:00|Resepsi|Ramah tamah dan makan bersama"}
              />
              <p className="text-elegant/35 text-xs mt-1 font-sans">Format per baris: jam|judul|deskripsi</p>
            </div>
            <div>
              <label className="label-elegant">Kisah Cinta + Foto Cerita</label>
              <textarea
                {...register('love_story_items_text')}
                className="input-elegant resize-none font-mono text-xs"
                rows={5}
                placeholder={"2019|Pertama Bertemu|Cerita singkat pertemuan kami|https://url-foto.jpg\n2024|Menuju Pelaminan|Cerita menuju hari bahagia|https://url-foto.jpg"}
              />
              <p className="text-elegant/35 text-xs mt-1 font-sans">Format per baris: tahun|judul|cerita|url foto opsional</p>
            </div>
            <div>
              <label className="label-elegant">Pertanyaan Tambahan RSVP</label>
              <input {...register('custom_rsvp_fields_text')} className="input-elegant" placeholder="Contoh: Catatan makanan/alergi atau nama rombongan" />
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-champagne/60 p-4 cursor-pointer">
              <input type="checkbox" {...register('gift_is_collapsible')} className="w-4 h-4" />
              <span className="font-sans text-sm text-elegant">Amplop digital disembunyikan dulu dan muncul saat diklik</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-champagne/60 p-4 cursor-pointer">
              <input type="checkbox" {...register('auto_scroll_enabled')} className="w-4 h-4" />
              <span className="font-sans text-sm text-elegant">Aktifkan tombol auto scroll di undangan</span>
            </label>
          </div>
        </form>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          form="info-form"
          disabled={isSubmitting}
          className="btn-gold disabled:opacity-60"
        >
          {isSubmitting ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
          ) : (
            <><Save size={15} /> Simpan Perubahan</>
          )}
        </button>
      </div>
    </div>
  )
}
