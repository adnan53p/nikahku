'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, ArrowLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { signUp } from '@/services/auth.service'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    try {
      await signUp(data)
      toast.success('Akun berhasil dibuat! Selamat datang 🎉')
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'Gagal membuat akun')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-champagne/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gold-100/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-elegant/50 hover:text-elegant transition-colors mb-6 font-sans"
        >
          <ArrowLeft size={14} />
          Kembali ke beranda
        </Link>

        <div className="card-elegant p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-white font-display font-bold">I</span>
              </div>
              <span className="font-display text-2xl font-semibold text-elegant">Invitely</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-elegant mb-2">
              Buat Akun Gratis
            </h1>
            <p className="text-elegant/50 text-sm font-sans">
              Mulai perjalanan undangan digital Anda
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-champagne/50 rounded-xl p-4 mb-6">
            <p className="text-xs font-medium text-elegant/70 font-sans mb-2">Yang Anda dapatkan:</p>
            {['Akun gratis selamanya', '1 undangan percobaan', 'Akses semua fitur dasar'].map((item) => (
              <div key={item} className="flex items-center gap-2 mt-1.5">
                <div className="w-4 h-4 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                  <Check size={9} className="text-white" />
                </div>
                <span className="text-xs text-elegant/70 font-sans">{item}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-elegant">Nama Lengkap</label>
              <input
                {...register('full_name')}
                type="text"
                placeholder="Nama lengkap Anda"
                className="input-elegant"
              />
              {errors.full_name && (
                <p className="text-red-500 text-xs mt-1 font-sans">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="label-elegant">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="nama@email.com"
                className="input-elegant"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-sans">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label-elegant">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 karakter"
                  className="input-elegant pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-elegant/40 hover:text-elegant transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-sans">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="label-elegant">Konfirmasi Password</label>
              <input
                {...register('confirm_password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Ulangi password"
                className="input-elegant"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1 font-sans">{errors.confirm_password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Membuat akun...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Daftar Gratis
                </div>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-elegant/40 font-sans mt-4">
            Dengan mendaftar, Anda menyetujui{' '}
            <Link href="#" className="text-gold-600 hover:underline">Syarat & Ketentuan</Link>{' '}
            dan{' '}
            <Link href="#" className="text-gold-600 hover:underline">Kebijakan Privasi</Link>
          </p>

          <p className="text-center text-sm text-elegant/50 font-sans mt-4">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-gold-600 hover:text-gold-700 font-medium transition-colors">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
