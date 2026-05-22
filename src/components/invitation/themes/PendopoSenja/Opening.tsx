"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

interface OpeningProps {
  onOpen: () => void;
  guestName?: string;
  event?: any;
}

const FloralSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M100 20 C100 20 110 50 100 80 C90 50 100 20 100 20Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.6" />
    <path d="M100 20 C100 20 130 40 120 70 C100 55 100 20 100 20Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.5" />
    <path d="M100 20 C100 20 70 40 80 70 C100 55 100 20 100 20Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.5" />
    <path d="M100 20 C100 20 145 55 130 85 C112 63 100 20 100 20Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.4" />
    <path d="M100 20 C100 20 55 55 70 85 C88 63 100 20 100 20Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.4" />
    <circle cx="100" cy="20" r="5" fill="#C9A96E" opacity="0.6" />
    <circle cx="100" cy="80" r="3" fill="#C9A96E" opacity="0.4" />
    {/* small buds */}
    {[60, 90, 120, 150].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x = 100 + 55 * Math.cos(rad);
      const y = 80 + 55 * Math.sin(rad);
      return (
        <g key={i}>
          <circle cx={x} cy={y} r="2.5" fill="#C9A96E" opacity="0.3" />
          <circle cx={x} cy={y} r="5" fill="none" stroke="#C9A96E" strokeWidth="0.5" opacity="0.2" />
        </g>
      );
    })}
    {/* ring */}
    <circle cx="100" cy="100" r="75" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.15" strokeDasharray="2 6" />
  </svg>
);

const RingsSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="25" cy="20" r="16" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
    <circle cx="55" cy="20" r="16" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
    <circle cx="25" cy="20" r="12" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.4" />
    <circle cx="55" cy="20" r="12" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.4" />
  </svg>
);

export default function Opening({ onOpen, guestName, event }: OpeningProps) {
  const [leaving, setLeaving] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [-1, 1], [-12, 12]);
  const bgY = useTransform(mouseY, [-1, 1], [-12, 12]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const handleOpen = () => {
    setLeaving(true);
    setTimeout(onOpen, 1100);
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: 0.8 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const brideName = event?.bride_name || "Sekar Arum";
  const groomName = event?.groom_name || "Arjuna Prabowo";
  const weddingDate = event?.akad_date || event?.wedding_date || "2025-09-13";
  const coverImage = event?.cover_image_url || "";
  const formattedDate = (() => {
    const date = new Date(weddingDate);
    if (Number.isNaN(date.getTime())) return weddingDate;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  })();

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div
          key="opening"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "#0d0b08" }}
        >
          {/* Cinematic background image layer */}
          <motion.div
            className="absolute inset-[-5%]"
            style={{ x: bgX, y: bgY }}
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          >
            {coverImage ? (
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 60%, #3d2e1e 0%, #1a1208 40%, #080604 100%)",
                }}
              />
            )}
            {/* Grain texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          </motion.div>

          {/* Gradient vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 20%, rgba(8,6,4,0.7) 70%, rgba(4,3,2,0.95) 100%)",
            }}
          />
          {/* Bottom gradient for text legibility */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3"
            style={{ background: "linear-gradient(to top, rgba(8,6,4,0.92) 0%, transparent 100%)" }}
          />

          {/* Floating floral top-left */}
          <motion.div
            className="absolute top-[-60px] left-[-60px] w-[260px] h-[260px] pointer-events-none"
            animate={{ rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          >
            <FloralSVG className="w-full h-full opacity-25" />
          </motion.div>

          {/* Floating floral bottom-right */}
          <motion.div
            className="absolute bottom-[-60px] right-[-60px] w-[240px] h-[240px] pointer-events-none rotate-180"
            animate={{ rotate: [180, 172, 180], scale: [1, 1.06, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <FloralSVG className="w-full h-full opacity-20" />
          </motion.div>

          {/* Floating top-right */}
          <motion.div
            className="absolute top-10 right-[-30px] w-[160px] h-[160px] pointer-events-none rotate-90"
            animate={{ rotate: [90, 98, 90], y: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <FloralSVG className="w-full h-full opacity-15" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
            {/* Date badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full border"
                style={{ borderColor: "rgba(201,169,110,0.3)", background: "rgba(201,169,110,0.06)" }}
              >
                <div className="w-1 h-1 rounded-full bg-[#C9A96E]" />
                <span className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase font-light">
                  {formattedDate}
                </span>
                <div className="w-1 h-1 rounded-full bg-[#C9A96E]" />
              </div>
            </motion.div>

            {/* Guest greeting */}
            {guestName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mb-6"
              >
                <p className="text-[#b8a48a] text-xs tracking-[0.2em]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Kepada Yth.
                </p>
                <p className="text-[#e8dcc8] text-base mt-1" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  {guestName}
                </p>
              </motion.div>
            )}

            {/* Couple names with letter animation */}
            <div className="mb-2">
              <div className="flex justify-center flex-wrap gap-[2px] overflow-hidden mb-1">
                {brideName.split("").map((char: string, i: number) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-[#f2e8d6] leading-none"
                    style={{
                      fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
                      fontSize: "clamp(28px, 8vw, 48px)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center gap-3 my-3"
              >
                <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, #C9A96E)" }} />
                <RingsSVG className="w-10 h-5 opacity-70" />
                <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, #C9A96E)" }} />
              </motion.div>

              <div className="flex justify-center flex-wrap gap-[2px] overflow-hidden">
                {groomName.split("").map((char: string, i: number) => (
                  <motion.span
                    key={i}
                    custom={i + brideName.length + 2}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-[#f2e8d6] leading-none"
                    style={{
                      fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
                      fontSize: "clamp(28px, 8vw, 48px)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1.2 }}
              className="text-[#8a7a6a] text-[11px] tracking-[0.3em] uppercase mt-5 mb-10"
            >
              Pernikahan — Wedding Invitation
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                onClick={handleOpen}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative group overflow-hidden px-10 py-4 rounded-full text-[13px] tracking-[0.25em] uppercase"
                style={{
                  background: "linear-gradient(135deg, #C9A96E 0%, #e8c98a 50%, #C9A96E 100%)",
                  backgroundSize: "200% 200%",
                  color: "#1a1208",
                  fontFamily: "'Palatino Linotype', Palatino, serif",
                  letterSpacing: "0.25em",
                  boxShadow: "0 4px 40px rgba(201,169,110,0.25), 0 1px 0 rgba(255,255,255,0.1) inset",
                }}
              >
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)" }}
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">Buka Undangan</span>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6, duration: 1 }}
                className="text-[#5a5040] text-[10px] tracking-[0.2em] mt-4"
              >
                Dengan penuh rasa syukur, kami mengundang kehadiran Anda
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom ornament line */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1.2 }}
          >
            <div className="w-12 h-px" style={{ background: "linear-gradient(to right, transparent, #C9A96E40)" }} />
            <div className="w-1 h-1 rounded-full bg-[#C9A96E] opacity-40" />
            <div className="w-24 h-px" style={{ background: "linear-gradient(to right, #C9A96E40, transparent)" }} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
