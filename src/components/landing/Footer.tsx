import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-elegant text-champagne/60 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-white font-display text-sm font-bold">I</span>
              </div>
              <span className="font-display text-xl font-semibold text-champagne">Invitely</span>
            </div>
            <p className="text-sm leading-relaxed font-sans">
              Platform undangan digital premium untuk pernikahan impian Anda.
            </p>
          </div>

          <div>
            <h4 className="text-champagne text-sm font-semibold font-sans mb-4">Produk</h4>
            <ul className="space-y-2 text-sm font-sans">
              {['Fitur', 'Template', 'Harga', 'Demo'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="hover:text-champagne transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-champagne text-sm font-semibold font-sans mb-4">Dukungan</h4>
            <ul className="space-y-2 text-sm font-sans">
              {['FAQ', 'Panduan', 'Kontak', 'WhatsApp'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-champagne transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-champagne text-sm font-semibold font-sans mb-4">Legal</h4>
            <ul className="space-y-2 text-sm font-sans">
              {['Syarat & Ketentuan', 'Kebijakan Privasi', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-champagne transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-champagne/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-sans">
            © {new Date().getFullYear()} Invitely. Hak cipta dilindungi.
          </p>
          <p className="text-sm font-sans flex items-center gap-1.5">
            Dibuat dengan <Heart size={12} className="text-gold-400" fill="currentColor" /> untuk semua pasangan
          </p>
        </div>
      </div>
    </footer>
  )
}
