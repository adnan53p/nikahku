"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Dummy gallery items — replace image_url with actual photos
const fallbackGalleryItems = [
  { id: 1, url: null, ratio: "portrait", caption: "Momen pertama kami" },
  { id: 2, url: null, ratio: "landscape", caption: "Perjalanan indah" },
  { id: 3, url: null, ratio: "portrait", caption: "Senyum bahagia" },
  { id: 4, url: null, ratio: "landscape", caption: "Bersama selamanya" },
  { id: 5, url: null, ratio: "portrait", caption: "Cinta yang tulus" },
  { id: 6, url: null, ratio: "landscape", caption: "Kenangan abadi" },
];

const gradients = [
  "linear-gradient(135deg, #3d2e1e 0%, #2a1f14 100%)",
  "linear-gradient(135deg, #2a2016 0%, #1e1710 100%)",
  "linear-gradient(135deg, #352818 0%, #261c0e 100%)",
  "linear-gradient(135deg, #2e2414 0%, #221a0c 100%)",
  "linear-gradient(135deg, #3a2c1a 0%, #2c2010 100%)",
  "linear-gradient(135deg, #281e10 0%, #1c150a 100%)",
];

function GalleryCard({
  item,
  index,
  onOpen,
}: {
  item: typeof fallbackGalleryItems[0];
  index: number;
  onOpen: (item: typeof fallbackGalleryItems[0]) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${
        item.ratio === "portrait" ? "row-span-2" : ""
      }`}
      style={{
        aspectRatio: item.ratio === "portrait" ? "3/4" : "4/3",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.12)"
          : "0 4px 24px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.4s ease",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(item)}
    >
      {/* Background / image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: gradients[index % gradients.length] }}
      >
        {item.url ? (
          <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
        ) : (
          <>
            {/* Placeholder pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 50% 50%, rgba(201,169,110,0.6) 0%, transparent 60%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-[#C9A96E] opacity-20"
                style={{ fontFamily: "'Palatino Linotype', serif", fontSize: "60px", fontStyle: "italic" }}
              >
                {String.fromCharCode(9825)}
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{ background: "linear-gradient(to top, rgba(10,7,4,0.75) 0%, rgba(10,7,4,0.2) 50%, transparent 100%)" }}
      />

      {/* Caption */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4"
        animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-[#f2e8d6] text-xs"
          style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
        >
          {item.caption}
        </p>
      </motion.div>

      {/* Gold corner accent */}
      <div className="absolute top-3 left-3 w-6 h-6 pointer-events-none opacity-50">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M0 12 L0 0 L12 0" stroke="#C9A96E" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none opacity-50">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M20 8 L20 20 L8 20" stroke="#C9A96E" strokeWidth="1.2" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Gallery({ event }: { event?: any }) {
  const uploadedItems = (event?.galleries || [])
    .filter((item: any) => item?.image_url || item?.url)
    .map((item: any, index: number) => ({
      id: item.id || index + 1,
      url: item.image_url || item.url,
      ratio: index % 3 === 0 ? "portrait" : "landscape",
      caption: item.caption || `Momen ${index + 1}`,
    }));
  const galleryItems = uploadedItems.length ? uploadedItems : fallbackGalleryItems;
  const [lightboxItem, setLightboxItem] = useState<typeof fallbackGalleryItems[0] | null>(null);

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#f5f0e8" }}>
      {/* Soft background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.05) 0%, transparent 60%)" }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-4">Kenangan Kami</p>
          <h2
            className="text-[#1a1208]"
            style={{
              fontFamily: "'Palatino Linotype', Palatino, serif",
              fontSize: "clamp(28px, 6vw, 42px)",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            Galeri Foto
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #C9A96E50)" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] opacity-60" />
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #C9A96E50)" }} />
          </div>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryItems.map((item: any, i: number) => (
            <GalleryCard key={item.id} item={item} index={i} onOpen={setLightboxItem} />
          ))}
        </div>

        {/* Quote below gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-12"
        >
          <p className="text-[#8a7a6a] text-xs italic" style={{ fontFamily: "Georgia, serif" }}>
            Setiap foto menyimpan seribu kata yang tak terucap
          </p>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(8,6,4,0.96)" }}
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-lg w-full rounded-2xl overflow-hidden"
              style={{
                background: gradients[galleryItems.indexOf(lightboxItem) % gradients.length],
                aspectRatio: lightboxItem.ratio === "portrait" ? "3/4" : "4/3",
                boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
              }}
              onClick={e => e.stopPropagation()}
            >
              {lightboxItem.url ? (
                <img src={lightboxItem.url} alt={lightboxItem.caption} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="text-[#C9A96E] opacity-20"
                    style={{ fontFamily: "'Palatino Linotype', serif", fontSize: "100px", fontStyle: "italic" }}
                  >
                    ♡
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                <p className="text-[#f2e8d6] text-sm italic" style={{ fontFamily: "Georgia, serif" }}>
                  {lightboxItem.caption}
                </p>
              </div>
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-[#C9A96E] hover:opacity-70 transition-opacity"
              style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
