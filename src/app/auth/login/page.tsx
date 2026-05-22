'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { signIn } from '@/services/auth.service'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      await signIn(data)
      toast.success('Selamat datang kembali! 🎉')
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-champagne/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gold-100/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-elegant/50 hover:text-elegant transition-colors duration-200 mb-6 font-sans"
        >
          <ArrowLeft size={14} />
          Kembali ke beranda
        </Link>

        <div className="card-elegant p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-white font-display font-bold">I</span>
              </div>
              <span className="font-display text-2xl font-semibold text-elegant">Invitely</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-elegant mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-elegant/50 text-sm font-sans">
              Masuk ke dashboard undangan Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  placeholder="••••••••"
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

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gold-600 hover:text-gold-700 font-sans transition-colors"
              >
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn size={16} />
                  Masuk
                </div>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-elegant/50 font-sans mt-6">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-gold-600 hover:text-gold-700 font-medium transition-colors">
              Daftar gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
