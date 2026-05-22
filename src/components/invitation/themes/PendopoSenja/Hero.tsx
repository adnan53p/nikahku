"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const FloralCorner = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 10 Q10 60 60 60 Q10 60 60 110" stroke="#C9A96E" strokeWidth="0.6" fill="none" opacity="0.5" />
    <path d="M10 10 Q40 10 40 60" stroke="#C9A96E" strokeWidth="0.6" fill="none" opacity="0.35" />
    <path d="M10 10 Q10 40 60 40" stroke="#C9A96E" strokeWidth="0.6" fill="none" opacity="0.35" />
    <circle cx="10" cy="10" r="3" fill="#C9A96E" opacity="0.4" />
    <circle cx="40" cy="10" r="1.5" fill="#C9A96E" opacity="0.3" />
    <circle cx="10" cy="40" r="1.5" fill="#C9A96E" opacity="0.3" />
    <circle cx="60" cy="60" r="2" fill="#C9A96E" opacity="0.25" />
    {/* leaf sprigs */}
    <path d="M25 10 Q30 18 25 26 Q20 18 25 10Z" fill="#C9A96E" opacity="0.2" />
    <path d="M10 25 Q18 30 26 25 Q18 20 10 25Z" fill="#C9A96E" opacity="0.2" />
  </svg>
);

const fallbackData = {
  bride: {
    name: "Sekar Arum",
    fullName: "Sekar Arum Lestari",
    parents: "Putri dari Bapak Haryono & Ibu Sri Wulandari",
    photo: null,
  },
  groom: {
    name: "Arjuna",
    fullName: "Arjuna Bagas Prabowo",
    parents: "Putra dari Bapak Bambang & Ibu Siti Rahayu",
    photo: null,
  },
};

function PersonCard({ person, side, delay }: { person: typeof fallbackData.bride; side: "bride" | "groom"; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      {/* Photo frame */}
      <div className="relative mb-6">
        {/* Outer ring ornament */}
        <motion.div
          className="absolute -inset-4 rounded-full border"
          style={{ borderColor: "rgba(201,169,110,0.15)" }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -inset-2 rounded-full border"
          style={{ borderColor: "rgba(201,169,110,0.08)", borderStyle: "dashed" }}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Photo circle */}
        <div
          className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #2a1f14 0%, #1a1208 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1.5px rgba(201,169,110,0.25)",
          }}
        >
          {person.photo ? (
            <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="text-5xl text-[#C9A96E] opacity-40"
                style={{ fontFamily: "'Palatino Linotype', Palatino, serif", fontStyle: "italic" }}
              >
                {person.name[0]}
              </span>
            </div>
          )}

          {/* Inner shimmer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }}
          />
        </div>

        {/* Corner florals on photo */}
        {side === "bride" && (
          <div className="absolute -top-2 -right-2 w-8 h-8 opacity-60">
            <FloralCorner />
          </div>
        )}
      </div>

      {/* Role label */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-3"
        style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)" }}
      >
        <span className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase">
          {side === "bride" ? "Mempelai Wanita" : "Mempelai Pria"}
        </span>
      </div>

      {/* Name */}
      <h3
        className="text-[#1a1208] mb-1"
        style={{
          fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
          fontSize: "clamp(22px, 5vw, 30px)",
          fontWeight: 300,
          fontStyle: "italic",
          letterSpacing: "0.02em",
        }}
      >
        {person.fullName}
      </h3>

      {/* Parents */}
      <p className="text-[#8a7a6a] text-xs leading-relaxed mt-2 max-w-[180px]" style={{ fontFamily: "Georgia, serif" }}>
        {person.parents}
      </p>
    </motion.div>
  );
}

export default function Hero({ event }: { event?: any }) {
  const data = {
    bride: {
      ...fallbackData.bride,
      name: event?.bride_name || fallbackData.bride.name,
      fullName: event?.bride_full_name || event?.bride_name || fallbackData.bride.fullName,
      parents: event?.bride_father || event?.bride_mother
        ? `Putri dari ${event?.bride_father || 'Bapak'} & ${event?.bride_mother || 'Ibu'}`
        : fallbackData.bride.parents,
      photo: event?.bride_photo_url || fallbackData.bride.photo,
    },
    groom: {
      ...fallbackData.groom,
      name: event?.groom_name || fallbackData.groom.name,
      fullName: event?.groom_full_name || event?.groom_name || fallbackData.groom.fullName,
      parents: event?.groom_father || event?.groom_mother
        ? `Putra dari ${event?.groom_father || 'Bapak'} & ${event?.groom_mother || 'Ibu'}`
        : fallbackData.groom.parents,
      photo: event?.groom_photo_url || fallbackData.groom.photo,
    },
  };
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} className="relative overflow-hidden py-24 md:py-32 bg-[#faf7f2]">
      {/* Subtle background texture */}
      <motion.div
        className="absolute inset-[-10%] pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, #C9A96E 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </motion.div>

      {/* Soft radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.06) 0%, transparent 70%)" }}
      />

      {/* Top corner ornament */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-30">
        <FloralCorner />
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-30 scale-x-[-1]">
        <FloralCorner />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-4">
            Dengan penuh rasa syukur kepada Allah SWT
          </p>
          <h2
            className="text-[#1a1208] mb-4"
            style={{
              fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
              fontSize: "clamp(32px, 7vw, 52px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.2,
            }}
          >
            Kami Bermaksud
            <br />
            <span className="text-[#C9A96E]">Melangsungkan Pernikahan</span>
          </h2>

          {/* Ornament line */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #C9A96E60)" }} />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="#C9A96E" opacity="0.6" />
              <circle cx="10" cy="10" r="7" fill="none" stroke="#C9A96E" strokeWidth="0.6" opacity="0.35" />
            </svg>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #C9A96E60)" }} />
          </div>
        </motion.div>

        {/* Couple cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-4 items-center">
          <PersonCard person={data.bride} side="bride" delay={0.1} />

          {/* Center ampersand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <div className="hidden md:block h-16 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.3))" }} />
            <span
              className="text-5xl md:text-6xl text-[#C9A96E]"
              style={{
                fontFamily: "'Palatino Linotype', Palatino, serif",
                fontStyle: "italic",
                fontWeight: 300,
                opacity: 0.7,
              }}
            >
              &amp;
            </span>
            <div className="hidden md:block h-16 w-px" style={{ background: "linear-gradient(to top, transparent, rgba(201,169,110,0.3))" }} />
          </motion.div>

          <PersonCard person={data.groom} side="groom" delay={0.2} />
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-16 px-6"
        >
          <p
            className="text-[#8a7a6a] text-sm md:text-base leading-loose italic"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
            <br className="hidden md:block" /> istri-istri dari jenismu sendiri…"
          </p>
          <p className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase mt-3">Q.S. Ar-Rum : 21</p>
        </motion.div>
      </div>
    </section>
  );
}
