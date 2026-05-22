'use client'

import { useRef, useState } from 'react'
import { Check, Music, Pause, Play, Trash2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteMusic, uploadMusic } from '@/services/event.service'
import type { Event } from '@/types'

export function MusicTab({ event, onUpdate }: { event: Event; onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [isPreviewing, setIsPreviewing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeMusic = event.event_music?.find((m) => m.is_active)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!title.trim()) {
      toast.error('Isi judul lagu terlebih dahulu')
      e.target.value = ''
      return
    }
    if (!file.type.startsWith('audio/')) {
      toast.error('File harus berupa audio/MP3')
      e.target.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Maksimal 10MB')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      await uploadMusic(event.id, file, title.trim(), artist.trim() || undefined)
      toast.success('Musik berhasil diupload dan diaktifkan!')
      setTitle('')
      setArtist('')
      onUpdate()
    } catch (error) {
      console.error(error)
      toast.error('Gagal upload musik. Pastikan bucket music sudah ada.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const togglePreview = async () => {
    if (!activeMusic?.audio_url) return
    if (!audioRef.current) audioRef.current = new Audio(activeMusic.audio_url)

    if (isPreviewing) {
      audioRef.current.pause()
      setIsPreviewing(false)
      return
    }

    try {
      await audioRef.current.play()
      setIsPreviewing(true)
      audioRef.current.onended = () => setIsPreviewing(false)
    } catch {
      toast.error('Browser memblokir preview audio')
    }
  }

  const handleDelete = async () => {
    if (!activeMusic) return
    if (!confirm('Hapus musik aktif dari undangan ini?')) return
    setDeleting(true)
    try {
      audioRef.current?.pause()
      setIsPreviewing(false)
      await deleteMusic(activeMusic.id)
      toast.success('Musik dihapus')
      onUpdate()
    } catch (error) {
      console.error(error)
      toast.error('Gagal menghapus musik')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card-elegant p-5">
        <h3 className="font-sans font-semibold text-elegant text-sm mb-4">Musik Latar Undangan</h3>

        {activeMusic ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-champagne/50 rounded-xl mb-5">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold flex-shrink-0">
              <Music size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-elegant font-sans truncate">{activeMusic.title}</p>
              {activeMusic.artist && <p className="text-xs text-elegant/50 font-sans truncate">{activeMusic.artist}</p>}
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-sans mt-1">
                <Check size={12} /> Aktif di undangan
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={togglePreview} className="btn-outline-gold text-xs">
                {isPreviewing ? <Pause size={13} /> : <Play size={13} />}
                {isPreviewing ? 'Pause' : 'Preview'}
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn-ghost text-xs text-red-500 hover:bg-red-50">
                <Trash2 size={13} /> {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-champagne/40 border border-dashed border-champagne-dark mb-5 text-center">
            <Music size={24} className="text-elegant/25 mx-auto mb-2" />
            <p className="text-sm text-elegant/50 font-sans">Belum ada musik aktif</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="label-elegant">Judul Lagu *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-elegant" placeholder="A Thousand Years" />
          </div>
          <div>
            <label className="label-elegant">Artis / Keterangan</label>
            <input value={artist} onChange={(e) => setArtist(e.target.value)} className="input-elegant" placeholder="Christina Perri / Instrumen Islami" />
          </div>
          <input ref={fileRef} type="file" accept="audio/*,.mp3,.aac,.ogg" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading || !title.trim()} className="btn-gold text-sm w-full disabled:opacity-60">
            <Upload size={14} /> {uploading ? 'Mengunggah...' : activeMusic ? 'Ganti Musik Aktif' : 'Upload Musik MP3'}
          </button>
          <p className="text-xs text-elegant/40 font-sans">
            Format MP3/AAC/OGG, maksimal 10MB. Musik akan diputar setelah tamu menekan tombol buka undangan.
          </p>
        </div>
      </div>
    </div>
  )
}
