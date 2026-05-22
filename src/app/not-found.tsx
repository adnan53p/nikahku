import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-champagne/30 blur-3xl" />

      <div className="relative text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-gold-gradient flex items-center justify-center mx-auto mb-6 shadow-gold">
          <Heart size={36} className="text-white" fill="currentColor" />
        </div>

        <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-3">
          404 — Halaman Tidak Ditemukan
        </p>

        <h1 className="font-display text-4xl font-bold text-elegant mb-4">
          Undangan Tidak Ditemukan
        </h1>

        <p className="text-elegant/50 font-sans text-sm leading-relaxed mb-8">
          Halaman yang Anda cari tidak tersedia. Mungkin link sudah berubah atau undangan belum dipublikasikan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-gold">
            <ArrowLeft size={15} /> Kembali ke Beranda
          </Link>
          <Link href="/auth/login" className="btn-outline-gold">
            Masuk ke Dashboard
          </Link>
        </div>

        <p className="text-elegant/30 text-xs font-sans mt-8">
          Butuh bantuan? Hubungi kami di WhatsApp
        </p>
      </div>
    </div>
  )
}
