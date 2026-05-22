'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, X, Zap } from 'lucide-react'
import type { PricingPlan } from '@/types'
import { formatCurrency } from '@/lib/utils'

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 149000,
    period: 'per acara',
    description: 'Sempurna untuk pasangan dengan kebutuhan dasar',
    maxEvents: 1,
    maxGuests: 100,
    features: [
      { name: '1 Undangan Digital', included: true },
      { name: 'Hingga 100 Tamu', included: true },
      { name: 'RSVP Realtime', included: true },
      { name: 'Google Maps Embed', included: true },
      { name: 'Gallery Foto (10 foto)', included: true },
      { name: 'Musik Latar', included: false },
      { name: 'Import Excel Tamu', included: false },
      { name: 'Amplop Digital', included: false },
      { name: 'Statistik Lengkap', included: false },
      { name: 'Domain Custom', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299000,
    period: 'per acara',
    description: 'Pilihan terbaik untuk pernikahan yang tak terlupakan',
    maxEvents: 1,
    maxGuests: 500,
    isPopular: true,
    features: [
      { name: '1 Undangan Digital', included: true },
      { name: 'Hingga 500 Tamu', included: true },
      { name: 'RSVP Realtime', included: true },
      { name: 'Google Maps Embed', included: true },
      { name: 'Gallery Foto (50 foto)', included: true },
      { name: 'Musik Latar', included: true },
      { name: 'Import Excel Tamu', included: true },
      { name: 'Amplop Digital', included: true },
      { name: 'Statistik Lengkap', included: true },
      { name: 'Domain Custom', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 599000,
    period: 'per acara',
    description: 'Untuk resepsi mewah dan event berskala besar',
    maxEvents: 1,
    maxGuests: 9999,
    features: [
      { name: '1 Undangan Digital', included: true },
      { name: 'Tamu Tak Terbatas', included: true },
      { name: 'RSVP Realtime', included: true },
      { name: 'Google Maps Embed', included: true },
      { name: 'Gallery Foto (Unlimited)', included: true },
      { name: 'Musik Latar', included: true },
      { name: 'Import Excel Tamu', included: true },
      { name: 'Amplop Digital', included: true },
      { name: 'Statistik Lengkap', included: true },
      { name: 'Domain Custom', included: true },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-champagne/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-100/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-sans font-medium mb-4">
            Harga Transparan
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-elegant mb-4">
            Investasi Kenangan Seumur Hidup
          </h2>
          <p className="text-elegant/60 max-w-xl mx-auto font-sans leading-relaxed">
            Harga sekali bayar per acara. Tidak ada biaya langganan bulanan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.isPopular
                  ? 'bg-elegant text-champagne shadow-elegant-lg scale-[1.02]'
                  : 'card-elegant'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-gradient rounded-full shadow-gold">
                    <Zap size={12} className="text-white" fill="currentColor" />
                    <span className="text-white text-xs font-medium font-sans">
                      Paling Populer
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-display text-xl font-bold mb-1 ${plan.isPopular ? 'text-champagne' : 'text-elegant'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm font-sans ${plan.isPopular ? 'text-champagne/60' : 'text-elegant/50'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className={`font-display text-4xl font-bold ${plan.isPopular ? 'text-champagne' : 'text-elegant'}`}>
                    {formatCurrency(plan.price)}
                  </span>
                </div>
                <p className={`text-sm font-sans mt-1 ${plan.isPopular ? 'text-champagne/50' : 'text-elegant/40'}`}>
                  {plan.period}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.isPopular ? 'bg-gold-500/20' : 'bg-gold-50'
                      }`}>
                        <Check size={11} className="text-gold-500" />
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.isPopular ? 'bg-white/5' : 'bg-gray-50'
                      }`}>
                        <X size={11} className={plan.isPopular ? 'text-champagne/20' : 'text-elegant/20'} />
                      </div>
                    )}
                    <span className={`text-sm font-sans ${
                      feature.included
                        ? plan.isPopular ? 'text-champagne/90' : 'text-elegant/80'
                        : plan.isPopular ? 'text-champagne/30' : 'text-elegant/30'
                    }`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`block w-full text-center py-3.5 rounded-xl font-medium text-sm font-sans transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-gold-gradient text-white shadow-gold hover:shadow-gold-lg hover:scale-[1.02]'
                    : 'border border-elegant/20 text-elegant hover:bg-champagne hover:border-elegant/30'
                }`}
              >
                Pilih {plan.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Free trial note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-elegant/40 text-sm font-sans mt-8"
        >
          Coba gratis terlebih dahulu. Tidak perlu kartu kredit.
        </motion.p>
      </div>
    </section>
  )
}
