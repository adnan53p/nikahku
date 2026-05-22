'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ImageIcon, X } from 'lucide-react'
import { getGalleryImage, SectionTitle } from './shared'
import { useState } from 'react'

export default function Gallery({ event }: { event: any }) {
  const galleries = event.galleries || []
  const [activeImage, setActiveImage] = useState<string | null>(null)

  return (
    <section className="relative bg-[#20364d] px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.18),transparent_34%)]" />
      <div className="relative mx-auto max-w-5xl">
        <SectionTitle eyebrow="Galeri" title="Momen Bahagia" dark />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {galleries.map((item: any, index: number) => {
            const image = getGalleryImage(item)
            return (
              <button key={item.id || index} onClick={() => image && setActiveImage(image)} className="group relative h-48 overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 md:h-64">
                {image ? (
                  <img src={image} alt={item.caption || 'Gallery'} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/50"><ImageIcon /></div>
                )}
                <div className="absolute inset-0 bg-[#20364d]/0 transition group-hover:bg-[#20364d]/25" />
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#142436]/95 p-4"
            onClick={() => setActiveImage(null)}
          >
            <button className="absolute right-5 top-5 text-white" onClick={() => setActiveImage(null)}>
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              src={activeImage}
              alt="Preview"
              className="max-h-[86vh] max-w-full rounded-3xl border border-white/25 object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
