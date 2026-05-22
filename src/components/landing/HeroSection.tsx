'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Shield, Smartphone, Zap } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const floatVariants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ivory">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-100" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-champagne/60 blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-gold-100/40 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-champagne/20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold border border-gold-500/20 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-xs font-medium text-gold-700 font-sans">
                Platform Undangan Digital #1 di Indonesia
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-elegant leading-[1.1] mb-6"
            >
              Undangan{' '}
              <span className="gold-text italic">Digital</span>
              <br />
              yang{' '}
              <span className="relative">
                Berkesan
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 4 120 2 198 6"
                    stroke="url(#goldGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#D4A017" />
                      <stop offset="1" stopColor="#E8C99A" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-elegant/60 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 font-sans"
            >
              Buat undangan pernikahan digital yang elegan, modern, dan mewah.
              Bagikan via WhatsApp dalam hitungan menit. Tanpa aplikasi, tanpa download.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/auth/register" className="btn-gold group text-base px-8 py-4">
                Buat Undangan Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <button className="btn-outline-gold group text-base px-8 py-4 flex items-center gap-2 justify-center">
                <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center group-hover:bg-gold-100 transition-colors duration-200">
                  <Play size={12} className="text-gold-600 ml-0.5" fill="currentColor" />
                </div>
                Lihat Demo
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start"
            >
              {[
                { icon: Shield, text: 'SSL Secure' },
                { icon: Smartphone, text: 'Tanpa Download' },
                { icon: Zap, text: 'Instan Live' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-elegant/50">
                  <Icon size={14} className="text-gold-500" />
                  <span className="font-sans">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '10.000+', label: 'Undangan Dibuat' },
                { value: '500+', label: 'Pasangan Bahagia' },
                { value: '4.9★', label: 'Rating Pengguna' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="font-display text-2xl font-bold text-elegant">{value}</div>
                  <div className="text-xs text-elegant/50 font-sans mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Invitation Preview Cards */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Main card */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 rounded-3xl overflow-hidden shadow-elegant-lg"
            >
              <div className="relative h-96 bg-elegant">
                <div className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(26,26,46,0.3) 0%, rgba(26,26,46,0.8) 100%)',
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                  <div className="text-center">
                    <p className="text-champagne/70 text-xs tracking-[0.3em] uppercase font-sans mb-3">
                      The Wedding of
                    </p>
                    <h3 className="font-display text-3xl text-champagne font-bold italic mb-1">
                      Adnan
                    </h3>
                    <div className="text-gold-400 text-2xl my-2">∞</div>
                    <h3 className="font-display text-3xl text-champagne font-bold italic mb-4">
                      Siti Rahma
                    </h3>
                    <div className="w-12 h-px bg-gold-500/50 mx-auto mb-4" />
                    <p className="text-champagne/60 text-xs font-sans">
                      Sabtu, 14 Februari 2026
                    </p>
                  </div>
                </div>
              </div>
              {/* Card bottom */}
              <div className="bg-white p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-elegant/40 font-sans">Dibuka oleh</p>
                  <p className="text-sm font-medium text-elegant font-sans">Budi Santoso</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-gold-50 border border-gold-200">
                  <p className="text-xs text-gold-700 font-sans font-medium">Hadir ✓</p>
                </div>
              </div>
            </motion.div>

            {/* Floating mini cards */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute top-16 left-0 w-52 glass rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                  <span className="text-white text-xs font-bold">RS</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-elegant font-sans">Rudi Setiawan</p>
                  <p className="text-xs text-elegant/40 font-sans">Hadir • 2 tamu</p>
                </div>
              </div>
              <p className="text-xs text-elegant/60 font-sans italic">
                "Selamat menempuh hidup baru! 🎉"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute bottom-24 right-0 w-48 glass rounded-2xl p-4 shadow-card"
            >
              <p className="text-xs text-elegant/40 font-sans mb-2">RSVP Stats</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-elegant font-display">87%</p>
                  <p className="text-xs text-elegant/40 font-sans">Konfirmasi Hadir</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-8 w-3 bg-gold-gradient rounded-sm" />
                  <div className="h-5 w-3 bg-champagne rounded-sm" />
                  <div className="h-12 w-3 bg-gold-gradient rounded-sm" />
                </div>
              </div>
            </motion.div>

            {/* Ornamental dots */}
            <div className="absolute top-8 right-8 w-24 h-24 opacity-20">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent" />
    </section>
  )
}
