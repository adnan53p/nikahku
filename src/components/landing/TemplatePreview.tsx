'use client'

import { motion } from 'framer-motion'

export function TemplatePreview() {
  const templates = [
    { name: 'Champagne', bg: 'from-champagne to-gold-100', accent: '#D4A017' },
    { name: 'Midnight', bg: 'from-elegant to-elegant-light', accent: '#E8C99A' },
    { name: 'Blush Rose', bg: 'from-rose-50 to-pink-100', accent: '#E9A5A5' },
    { name: 'Forest', bg: 'from-emerald-50 to-teal-100', accent: '#6B9E7A' },
  ]

  return (
    <section id="templates" className="py-24 bg-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-sans font-medium mb-4">
            Desain Premium
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-elegant mb-4">
            Template Eksklusif
          </h2>
          <p className="text-elegant/60 max-w-xl mx-auto font-sans">
            Pilih dari koleksi template undangan premium yang dirancang oleh desainer profesional
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {templates.map((template, i) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group cursor-pointer"
            >
              <div className={`h-64 rounded-2xl bg-gradient-to-br ${template.bg} relative overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300`}>
                {/* Mock invitation content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-8 h-px mb-3" style={{ background: template.accent }} />
                  <p className="font-display text-xs italic" style={{ color: template.accent }}>
                    The Wedding of
                  </p>
                  <p className="font-display text-lg font-bold mt-1 text-elegant/80">Adnan & Siti</p>
                  <div className="w-8 h-px mt-3" style={{ background: template.accent }} />
                  <p className="text-xs font-sans text-elegant/50 mt-3">14 Feb 2026</p>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
              </div>
              <p className="text-center text-sm font-medium text-elegant/70 font-sans mt-3">
                {template.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
