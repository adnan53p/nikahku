'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, Image, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadGalleryImage, deleteGalleryImage } from '@/services/event.service'
import type { Event } from '@/types'

export function GalleryTab({ event, onUpdate }: { event: Event; onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const galleries = event.galleries || []

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (galleries.length + files.length > 50) { toast.error('Maksimal 50 foto'); return }
    setUploading(true)
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) continue
        await uploadGalleryImage(event.id, file)
      }
      toast.success(`${files.length} foto berhasil diupload!`)
      onUpdate()
    } catch { toast.error('Gagal upload') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  const handleDelete = async (galleryId: string) => {
    try {
      await deleteGalleryImage(galleryId)
      toast.success('Foto dihapus')
      onUpdate()
    } catch { toast.error('Gagal menghapus') }
  }

  return (
    <div className="space-y-4">
      <div className="card-elegant p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-sans font-semibold text-elegant text-sm">Galeri Foto</h3>
            <p className="text-elegant/40 text-xs font-sans">{galleries.length}/50 foto</p>
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-gold text-sm"
            >
              <Plus size={14} /> {uploading ? 'Mengunggah...' : 'Upload Foto'}
            </button>
          </div>
        </div>

        {/* Upload area */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-champagne-dark hover:border-gold-400 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-colors duration-200 group mb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-champagne group-hover:bg-gold-50 flex items-center justify-center transition-colors duration-200">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-gold-400/30 border-t-gold-500 rounded-full animate-spin" />
            ) : (
              <Upload size={20} className="text-gold-500" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-elegant font-sans">
              {uploading ? 'Mengunggah foto...' : 'Klik atau seret foto ke sini'}
            </p>
            <p className="text-xs text-elegant/40 font-sans">PNG, JPG, WEBP — maks 5MB per foto</p>
          </div>
        </button>

        {/* Gallery grid */}
        {galleries.length === 0 ? (
          <div className="text-center py-8">
            <Image size={32} className="text-elegant/20 mx-auto mb-2" />
            <p className="text-elegant/40 text-sm font-sans">Belum ada foto</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            <AnimatePresence>
              {galleries.map((gallery) => (
                <motion.div
                  key={gallery.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={gallery.image_url}
                    alt={gallery.caption || 'Gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(gallery.id)}
                      className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
