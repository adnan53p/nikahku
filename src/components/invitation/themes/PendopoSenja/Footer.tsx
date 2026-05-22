"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const FloralBottom = () => (
  <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-[0.08]">
    {/* Center arch */}
    <path d="M200 180 Q200 100 100 60 Q150 90 200 60 Q250 90 300 60 Q200 100 200 180Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" />
    {/* Left sprays */}
    <path d="M60 180 Q80 120 40 80" stroke="#C9A96E" strokeWidth="0.6" fill="none" />
    <path d="M60 180 Q100 140 80 90" stroke="#C9A96E" strokeWidth="0.6" fill="none" />
    <circle cx="40" cy="80" r="3" fill="#C9A96E" />
    <circle cx="80" cy="90" r="2" fill="#C9A96E" opacity="0.7" />
    {/* Right sprays */}
    <path d="M340 180 Q320 120 360 80" stroke="#C9A96E" strokeWidth="0.6" fill="none" />
    <path d="M340 180 Q300 140 320 90" stroke="#C9A96E" strokeWidth="0.6" fill="none" />
    <circle cx="360" cy="80" r="3" fill="#C9A96E" />
    <circle cx="320" cy="90" r="2" fill="#C9A96E" opacity="0.7" />
    {/* Horizontal line */}
    <path d="M0 178 Q200 165 400 178" stroke="#C9A96E" strokeWidth="0.4" />
  </svg>
);

const HeartOrb = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
    <circle cx="40" cy="40" r="36" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.3" />
    <circle cx="40" cy="40" r="26" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.2" />
    <text x="40" y="46" textAnchor="middle" fill="#C9A96E" fontSize="18" opacity="0.6" fontFamily="Georgia, serif">♡</text>
  </svg>
);

export default function Footer({ event, guestName }: { event?: any; guestName?: string | null }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [shareSuccess, setShareSuccess] = useState(false);
  const [waCopied, setWaCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `✨ Undangan Pernikahan\nSekar Arum & Arjuna Prabowo\n13 September 2025\n\n${url}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Undangan Pernikahan", text, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch {}
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const handleWA = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(`✨ Undangan Pernikahan Sekar Arum & Arjuna Prabowo\n13 September 2025\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const staggerVariant = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <footer
      className="relative overflow-hidden pt-20 pb-10 px-6"
      style={{ background: "linear-gradient(180deg, #1a1208 0%, #0e0b06 100%)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(201,169,110,0.08) 0%, transparent 60%)" }}
      />

      {/* Floral SVG top border */}
      <div className="absolute top-0 left-0 right-0 rotate-180">
        <FloralBottom />
      </div>

      <div className="max-w-lg mx-auto relative" ref={ref}>
        {/* Heart orb */}
        <motion.div {...staggerVariant(0)} className="flex justify-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeartOrb />
          </motion.div>
        </motion.div>

        {/* Names */}
        <motion.div {...staggerVariant(1)} className="text-center mb-6">
          <h2
            className="text-[#f2e8d6] mb-1"
            style={{
              fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
              fontSize: "clamp(28px, 7vw, 44px)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            Sekar Arum
          </h2>
          <div className="flex items-center justify-center gap-4 my-2">
            <div className="h-px w-10" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.4))" }} />
            <span className="text-[#C9A96E] text-2xl" style={{ fontFamily: "'Palatino Linotype', Palatino, serif", fontStyle: "italic" }}>&amp;</span>
            <div className="h-px w-10" style={{ background: "linear-gradient(to left, transparent, rgba(201,169,110,0.4))" }} />
          </div>
          <h2
            className="text-[#f2e8d6]"
            style={{
              fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
              fontSize: "clamp(28px, 7vw, 44px)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            Arjuna Prabowo
          </h2>
        </motion.div>

        {/* Date */}
        <motion.div {...staggerVariant(2)} className="text-center mb-10">
          <div
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full"
            style={{ border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}
          >
            <div className="w-1 h-1 rounded-full bg-[#C9A96E] opacity-60" />
            <span className="text-[#C9A96E] text-[11px] tracking-[0.3em] uppercase opacity-80">
              13 September 2025 · Yogyakarta
            </span>
            <div className="w-1 h-1 rounded-full bg-[#C9A96E] opacity-60" />
          </div>
        </motion.div>

        {/* Closing quote */}
        <motion.div {...staggerVariant(3)} className="text-center mb-12 px-4">
          <p
            className="text-[#8a7a6a] text-sm leading-loose italic"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Merupakan kehormatan dan kebahagiaan bagi kami
            <br />apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan
            <br />doa restu untuk kebahagiaan kami.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.25))" }} />
            <span className="text-[#C9A96E] opacity-40 text-lg">✦</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(201,169,110,0.25))" }} />
          </div>
        </motion.div>

        {/* Share buttons */}
        <motion.div {...staggerVariant(4)} className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <motion.button
            onClick={handleWA}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[12px] tracking-[0.2em]"
            style={{
              background: "linear-gradient(135deg, rgba(37,211,102,0.12) 0%, rgba(37,211,102,0.06) 100%)",
              border: "1px solid rgba(37,211,102,0.25)",
              color: "#5dc875",
              fontFamily: "Georgia, serif",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Bagikan via WhatsApp
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[12px] tracking-[0.2em]"
            style={{
              background: shareSuccess ? "rgba(201,169,110,0.12)" : "rgba(201,169,110,0.06)",
              border: `1px solid ${shareSuccess ? "rgba(201,169,110,0.4)" : "rgba(201,169,110,0.18)"}`,
              color: shareSuccess ? "#C9A96E" : "#8a7a6a",
              fontFamily: "Georgia, serif",
              transition: "all 0.3s ease",
            }}
          >
            {shareSuccess ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Link Tersalin!
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                </svg>
                Salin Link
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Closing thanks */}
        <motion.div {...staggerVariant(5)} className="text-center">
          <p className="text-[#C9A96E] text-[11px] tracking-[0.3em] uppercase mb-2 opacity-70">
            Dengan penuh cinta &amp; rasa syukur
          </p>
          <p
            className="text-[#5a5040] text-xs italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Sekar Arum &amp; Arjuna Prabowo beserta keluarga
          </p>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div
          {...staggerVariant(6)}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <div className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.15))" }} />
          <span className="text-[#3a3020] text-[10px] tracking-[0.2em]">Invitely</span>
          <div className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, rgba(201,169,110,0.15))" }} />
        </motion.div>
      </div>

      {/* Bottom floral */}
      <div className="absolute bottom-0 left-0 right-0">
        <FloralBottom />
      </div>
    </footer>
  );
}
