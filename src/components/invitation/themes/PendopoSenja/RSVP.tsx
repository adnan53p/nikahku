"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

type Attendance = "hadir" | "tidak_hadir" | "ragu";

interface WishEntry {
  id: string;
  name: string;
  message: string;
  attendance: Attendance;
}

const initialWishes: WishEntry[] = [
  {
    id: "1",
    name: "Ibu Suhartini",
    message: "Semoga menjadi keluarga yang sakinah, mawaddah, wa rahmah. Barakallahu lakuma.",
    attendance: "hadir",
  },
  {
    id: "2",
    name: "Bapak Darmawan",
    message: "Selamat menempuh hidup baru. Semoga selalu dilimpahi keberkahan dalam setiap langkah.",
    attendance: "hadir",
  },
];

function WishCard({ wish, delay }: { wish: WishEntry; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #faf6ef 100%)",
        border: "1px solid rgba(201,169,110,0.1)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* Corner accent */}
      <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none opacity-30">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M16 0 L16 16 L0 16" stroke="#C9A96E" strokeWidth="1" />
        </svg>
      </div>

      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-light"
          style={{
            background: "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))",
            border: "1px solid rgba(201,169,110,0.25)",
            color: "#C9A96E",
            fontFamily: "'Palatino Linotype', Palatino, serif",
            fontStyle: "italic",
          }}
        >
          {wish.name[0]}
        </div>
        <div>
          <p className="text-[#1a1208] text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>
            {wish.name}
          </p>
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full mt-1"
            style={{
              background:
                wish.attendance === "hadir"
                  ? "rgba(201,169,110,0.12)"
                  : wish.attendance === "tidak_hadir"
                  ? "rgba(180,140,120,0.1)"
                  : "rgba(160,150,130,0.1)",
              border: `1px solid ${wish.attendance === "hadir" ? "rgba(201,169,110,0.25)" : "rgba(160,140,110,0.15)"}`,
            }}
          >
            <span className="text-[#C9A96E] text-[9px] tracking-[0.2em] uppercase">
              {wish.attendance === "hadir" ? "Hadir" : wish.attendance === "tidak_hadir" ? "Tidak Hadir" : "Masih Ragu"}
            </span>
          </div>
        </div>
      </div>

      <p
        className="text-[#6a5a4a] text-sm leading-relaxed italic"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        &ldquo;{wish.message}&rdquo;
      </p>
    </motion.div>
  );
}

export default function RSVP({ event, guestName }: { event?: any; guestName?: string | null }) {
  const [form, setForm] = useState({ name: guestName || "", message: "", attendance: "hadir" as Attendance });
  const [submitted, setSubmitted] = useState(false);
  const [wishes, setWishes] = useState<WishEntry[]>(initialWishes);
  const [focused, setFocused] = useState<string | null>(null);
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.message.trim()) return;
    setWishes(prev => [{
      id: String(Date.now()),
      name: form.name,
      message: form.message,
      attendance: form.attendance,
    }, ...prev]);
    setSubmitted(true);
  };

  const attendanceOptions: { value: Attendance; label: string }[] = [
    { value: "hadir", label: "Hadir" },
    { value: "tidak_hadir", label: "Tidak Hadir" },
    { value: "ragu", label: "Masih Ragu" },
  ];

  const inputBase = (field: string) => ({
    background: focused === field ? "rgba(201,169,110,0.04)" : "rgba(255,255,255,0.6)",
    border: `1px solid ${focused === field ? "rgba(201,169,110,0.5)" : "rgba(201,169,110,0.15)"}`,
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused === field ? "0 0 0 3px rgba(201,169,110,0.06)" : "none",
  });

  return (
    <>
      {/* ── RSVP FORM ──────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a1208 0%, #2d2010 60%, #1a1208 100%)" }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.07) 0%, transparent 65%)" }}
        />

        {/* Fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-lg mx-auto relative" ref={headerRef}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-4 opacity-70">Konfirmasi Kehadiran</p>
            <h2
              className="text-[#f2e8d6]"
              style={{
                fontFamily: "'Palatino Linotype', Palatino, serif",
                fontSize: "clamp(28px, 6vw, 42px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              RSVP
            </h2>
            <p
              className="text-[#8a7a6a] text-xs mt-4 leading-relaxed"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Merupakan kehormatan bagi kami atas kehadiran Anda
              <br />di hari yang paling berbahagia ini.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.35))" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] opacity-40" />
              <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, rgba(201,169,110,0.35))" }} />
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-7 md:p-9"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(201,169,110,0.12)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-8"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
                    style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.25)" }}
                  >
                    ♡
                  </div>
                  <h3
                    className="text-[#f2e8d6] text-xl mb-3"
                    style={{ fontFamily: "'Palatino Linotype', Palatino, serif", fontStyle: "italic" }}
                  >
                    Terima Kasih
                  </h3>
                  <p className="text-[#8a7a6a] text-sm italic" style={{ fontFamily: "Georgia, serif" }}>
                    Konfirmasi dan ucapan doa Anda telah kami terima.
                    <br />Kami sangat menantikan kehadiran Anda.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      placeholder="Tulis nama Anda"
                      className="w-full px-4 py-3.5 rounded-xl text-sm text-[#f2e8d6] placeholder-[#5a5040]"
                      style={{ ...inputBase("name"), fontFamily: "Georgia, serif" }}
                    />
                  </div>

                  {/* Attendance */}
                  <div>
                    <label className="block text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase mb-2">
                      Kehadiran
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {attendanceOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setForm(p => ({ ...p, attendance: opt.value }))}
                          className="py-2.5 px-2 rounded-xl text-[11px] tracking-[0.15em] transition-all duration-300"
                          style={{
                            background:
                              form.attendance === opt.value
                                ? "rgba(201,169,110,0.18)"
                                : "rgba(255,255,255,0.03)",
                            border: `1px solid ${form.attendance === opt.value ? "rgba(201,169,110,0.5)" : "rgba(201,169,110,0.1)"}`,
                            color: form.attendance === opt.value ? "#C9A96E" : "#5a5040",
                            fontFamily: "Georgia, serif",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[#C9A96E] text-[10px] tracking-[0.3em] uppercase mb-2">
                      Ucapan &amp; Doa
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      placeholder="Tuliskan ucapan terbaik Anda..."
                      className="w-full px-4 py-3.5 rounded-xl text-sm text-[#f2e8d6] placeholder-[#5a5040] resize-none"
                      style={{ ...inputBase("message"), fontFamily: "Georgia, serif" }}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!form.name.trim() || !form.message.trim()}
                    className="w-full py-4 rounded-xl text-[13px] tracking-[0.2em] transition-all duration-300"
                    style={{
                      background:
                        form.name.trim() && form.message.trim()
                          ? "linear-gradient(135deg, #C9A96E 0%, #e8c98a 50%, #C9A96E 100%)"
                          : "rgba(201,169,110,0.08)",
                      color: form.name.trim() && form.message.trim() ? "#1a1208" : "#5a5040",
                      fontFamily: "'Palatino Linotype', Palatino, serif",
                      fontStyle: "italic",
                      border: "1px solid rgba(201,169,110,0.2)",
                      boxShadow:
                        form.name.trim() && form.message.trim()
                          ? "0 8px 32px rgba(201,169,110,0.2)"
                          : "none",
                      cursor: form.name.trim() && form.message.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    Kirim Konfirmasi
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── WISHES WALL ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#faf7f2" }}>
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-3">Pesan &amp; Doa</p>
            <h3
              className="text-[#1a1208]"
              style={{
                fontFamily: "'Palatino Linotype', Palatino, serif",
                fontSize: "clamp(22px, 5vw, 32px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Ucapan Tamu
            </h3>
          </motion.div>

          <div className="space-y-4">
            <AnimatePresence>
              {wishes.map((wish, i) => (
                <WishCard key={wish.id} wish={wish} delay={i * 0.05} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── WEDDING GIFT ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f5f0e8" }}>
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase mb-4">Hadiah Pernikahan</p>
            <h2
              className="text-[#1a1208] mb-4"
              style={{
                fontFamily: "'Palatino Linotype', Palatino, serif",
                fontSize: "clamp(26px, 5vw, 38px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Wedding Gift
            </h2>
            <p className="text-[#8a7a6a] text-xs leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih,
              dapat melalui rekening berikut:
            </p>
          </motion.div>

          {[
            { bank: "BCA", number: "1234 5678 90", name: "Sekar Arum Lestari" },
            { bank: "Mandiri", number: "0987 6543 21", name: "Arjuna Bagas Prabowo" },
          ].map((acc, i) => (
            <GiftCard key={i} acc={acc} delay={i * 0.12} />
          ))}
        </div>
      </section>
    </>
  );
}

function GiftCard({ acc, delay }: { acc: { bank: string; number: string; name: string }; delay: number }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(acc.number.replace(/\s/g, "")); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-6 mb-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #faf6ef 100%)",
        border: "1px solid rgba(201,169,110,0.14)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Soft shimmer */}
      <div
        className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(circle at center, #C9A96E, transparent)" }}
      />

      <div className="flex items-start justify-between">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.18)" }}
          >
            <span className="text-[#C9A96E] text-[10px] tracking-[0.25em] font-medium uppercase">{acc.bank}</span>
          </div>
          <p
            className="text-[#1a1208] text-xl tracking-[0.12em] mb-1"
            style={{ fontFamily: "'Palatino Linotype', Palatino, serif" }}
          >
            {acc.number}
          </p>
          <p className="text-[#8a7a6a] text-xs" style={{ fontFamily: "Georgia, serif" }}>
            {acc.name}
          </p>
        </div>

        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] tracking-[0.15em] transition-all duration-300"
          style={{
            background: copied ? "rgba(201,169,110,0.15)" : "rgba(201,169,110,0.07)",
            border: `1px solid ${copied ? "rgba(201,169,110,0.4)" : "rgba(201,169,110,0.15)"}`,
            color: copied ? "#C9A96E" : "#8a7a6a",
            fontFamily: "Georgia, serif",
          }}
        >
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tersalin
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Salin
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
