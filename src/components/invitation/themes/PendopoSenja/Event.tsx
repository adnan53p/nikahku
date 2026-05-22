"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1"
    >
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a1208 0%, #2d2010 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(201,169,110,0.15)",
          border: "1px solid rgba(201,169,110,0.12)",
        }}
      >
        <motion.div
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-[#C9A96E] text-2xl md:text-3xl font-light"
          style={{ fontFamily: "'Palatino Linotype', Palatino, serif", fontVariantNumeric: "tabular-nums" }}
        >
          {String(value).padStart(2, "0")}
        </motion.div>
        {/* Shimmer */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)" }} />
      </div>
      <span className="text-[#8a7a6a] text-[10px] tracking-[0.25em] uppercase">{label}</span>
    </motion.div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({
  type, venue, address, date, time, delay,
}: {
  type: string; venue: string; address: string; date: string; time: string; delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden p-8"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #faf6ef 100%)",
        boxShadow: "0 4px 40px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset",
        border: "1px solid rgba(201,169,110,0.12)",
      }}
    >
      {/* Background ornament */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="#C9A96E" strokeWidth="1" />
          <circle cx="60" cy="60" r="35" stroke="#C9A96E" strokeWidth="0.6" />
          <circle cx="60" cy="60" r="20" stroke="#C9A96E" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Type badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
        style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
        <span className="text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase">{type}</span>
      </div>

      <h3
        className="text-[#1a1208] mb-2"
        style={{
          fontFamily: "'Palatino Linotype', Palatino, serif",
          fontSize: "22px",
          fontWeight: 300,
          fontStyle: "italic",
        }}
      >
        {venue}
      </h3>
      <p className="text-[#8a7a6a] text-xs leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
        {address}
      </p>

      {/* Divider */}
      <div className="h-px mb-5" style={{ background: "linear-gradient(to right, rgba(201,169,110,0.3), transparent)" }} />

      {/* Date & Time */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[#C9A96E] text-[9px] tracking-[0.3em] uppercase mb-1">Tanggal</p>
          <p className="text-[#1a1208] text-sm" style={{ fontFamily: "Georgia, serif" }}>{date}</p>
        </div>
        <div className="w-px h-8" style={{ background: "rgba(201,169,110,0.2)" }} />
        <div>
          <p className="text-[#C9A96E] text-[9px] tracking-[0.3em] uppercase mb-1">Waktu</p>
          <p className="text-[#1a1208] text-sm" style={{ fontFamily: "Georgia, serif" }}>{time} WIB</p>
        </div>
      </div>

      {/* Maps button */}
      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-5 text-[11px] tracking-[0.2em] uppercase text-[#C9A96E] hover:opacity-70 transition-opacity"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        Lihat Lokasi
      </a>
    </motion.div>
  );
}

// ─── Love Story ───────────────────────────────────────────────────────────────

const loveStory = [
  {
    year: "2019",
    title: "Pertemuan Pertama",
    desc: "Takdir mempertemukan kami dalam sebuah acara seni budaya yang penuh makna. Sebuah pertemuan yang mengubah segalanya.",
    icon: "✦",
  },
  {
    year: "2021",
    title: "Jatuh Cinta",
    desc: "Perasaan itu tumbuh perlahan namun pasti, seperti bunga yang mekar di musim semi, mengisi setiap ruang dalam hati.",
    icon: "♡",
  },
  {
    year: "2023",
    title: "Lamaran",
    desc: "Dalam suasana yang hangat dan penuh cinta, sebuah pertanyaan sederhana mengubah dua perjalanan menjadi satu.",
    icon: "◇",
  },
  {
    year: "2025",
    title: "Menuju Pelaminan",
    desc: "Akhirnya, kami siap melangkah bersama dalam ikatan suci pernikahan, menuju babak baru yang indah.",
    icon: "♡",
  },
];

function TimelineItem({ item, index }: { item: typeof loveStory[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"} items-start`}
    >
      {/* Content */}
      <div className={`flex-1 pb-8 ${isLeft ? "text-right pr-4 md:pr-8" : "text-left pl-4 md:pl-8"}`}>
        <span className="text-[#C9A96E] text-[10px] tracking-[0.35em] uppercase block mb-1">{item.year}</span>
        <h4
          className="text-[#1a1208] mb-2"
          style={{ fontFamily: "'Palatino Linotype', Palatino, serif", fontSize: "18px", fontStyle: "italic", fontWeight: 300 }}
        >
          {item.title}
        </h4>
        <p className="text-[#8a7a6a] text-xs leading-relaxed max-w-[220px] inline-block" style={{ fontFamily: "Georgia, serif" }}>
          {item.desc}
        </p>
      </div>

      {/* Center dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#C9A96E] text-sm z-10"
          style={{
            background: "linear-gradient(135deg, #faf6ef, #f2ead8)",
            border: "1.5px solid rgba(201,169,110,0.4)",
            boxShadow: "0 2px 12px rgba(201,169,110,0.15)",
          }}
        >
          {item.icon}
        </div>
        {index < loveStory.length - 1 && (
          <motion.div
            className="w-px flex-1 mt-2"
            style={{ background: "linear-gradient(to bottom, rgba(201,169,110,0.3), transparent)", minHeight: "40px" }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
          />
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Event({ event }: { event?: any }) {
  const countdown = useCountdown("2025-09-13T08:00:00");
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true });

  return (
    <>
      {/* ── EVENT DETAILS ────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "#f5f0e8" }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-4">Rangkaian Acara</p>
            <h2
              className="text-[#1a1208]"
              style={{
                fontFamily: "'Palatino Linotype', Palatino, serif",
                fontSize: "clamp(28px, 6vw, 42px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Detail Pernikahan
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #C9A96E50)" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] opacity-60" />
              <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #C9A96E50)" }} />
            </div>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-5">
            <EventCard
              type="Akad Nikah"
              venue="Masjid Agung Keraton Yogyakarta"
              address="Jl. Rotowijayan No.1, Kraton, Kota Yogyakarta"
              date="Sabtu, 13 September 2025"
              time="08:00 — 10:00"
              delay={0.1}
            />
            <EventCard
              type="Resepsi Pernikahan"
              venue="Pendopo Agung Taman Sari"
              address="Jl. Taman, Patehan, Kec. Kraton, Kota Yogyakarta"
              date="Sabtu, 13 September 2025"
              time="11:00 — 15:00"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a1208 0%, #2d2010 50%, #1a1208 100%)" }}
      >
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-lg mx-auto text-center relative" ref={sectionRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-3 opacity-70">Menghitung Hari</p>
            <h2
              className="text-[#f2e8d6] mb-10"
              style={{
                fontFamily: "'Palatino Linotype', Palatino, serif",
                fontSize: "clamp(24px, 5vw, 36px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Menuju Hari Bahagia
            </h2>
          </motion.div>

          <div className="flex justify-center gap-4 md:gap-6">
            {[
              { value: countdown.d, label: "Hari" },
              { value: countdown.h, label: "Jam" },
              { value: countdown.m, label: "Menit" },
              { value: countdown.s, label: "Detik" },
            ].map((u, i) => (
              <CountdownUnit key={u.label} value={u.value} label={u.label} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[#5a5040] text-xs tracking-[0.2em] mt-10 italic"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "Setiap momen mendekat adalah rahmat yang patut disyukuri"
          </motion.p>
        </div>
      </section>

      {/* ── LOVE STORY ───────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "#faf7f2" }}>
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-4">Perjalanan Cinta</p>
            <h2
              className="text-[#1a1208]"
              style={{
                fontFamily: "'Palatino Linotype', Palatino, serif",
                fontSize: "clamp(28px, 6vw, 42px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Our Love Story
            </h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #C9A96E50)" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] opacity-60" />
              <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #C9A96E50)" }} />
            </div>
          </motion.div>

          <div className="relative">
            {loveStory.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
