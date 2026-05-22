'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'
import { resetPassword } from '@/services/auth.service'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await resetPassword(data.email)
      setSent(true)
    } catch {
      toast.error('Gagal mengirim email reset. Coba lagi.')
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-champagne/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-elegant/50 hover:text-elegant transition-colors mb-6 font-sans">
          <ArrowLeft size={14} /> Kembali ke login
        </Link>

        <div className="card-elegant p-8">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-gold-600" />
                </div>
                <h1 className="font-display text-2xl font-bold text-elegant mb-2">Lupa Password?</h1>
                <p className="text-elegant/50 text-sm font-sans">
                  Masukkan email Anda dan kami akan mengirimkan link reset password.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label-elegant">Email</label>
                  <input {...register('email')} type="email" placeholder="nama@email.com" className="input-elegant" />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-gold w-full py-3.5 disabled:opacity-60">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mail size={15} /> Kirim Link Reset
                    </div>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h2 className="font-display text-2xl font-bold text-elegant mb-2">Email Terkirim!</h2>
              <p className="text-elegant/50 text-sm font-sans mb-6">
                Periksa inbox email Anda dan klik link yang kami kirimkan untuk mereset password.
              </p>
              <p className="text-elegant/30 text-xs font-sans">
                Tidak menemukan email? Cek folder Spam.
              </p>
              <Link href="/auth/login" className="btn-gold mt-6 inline-flex">
                Kembali ke Login
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
