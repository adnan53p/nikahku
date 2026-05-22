'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Lock, Bell, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { updateProfile } from '@/services/auth.service'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile')
  const [showOldPw, setShowOldPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  const { register: regProfile, handleSubmit: handleProfile, formState: { isSubmitting: savingProfile } } = useForm({
    values: { full_name: user?.full_name || '' },
  })

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { isSubmitting: savingPw } } = useForm<{
    new_password: string
    confirm_password: string
  }>()

  const onSaveProfile = async (data: { full_name: string }) => {
    if (!user) return
    try {
      await updateProfile(user.id, { full_name: data.full_name })
      toast.success('Profil berhasil diperbarui!')
    } catch {
      toast.error('Gagal menyimpan')
    }
  }

  const onChangePassword = async (data: { new_password: string; confirm_password: string }) => {
    if (data.new_password !== data.confirm_password) {
      toast.error('Password tidak cocok')
      return
    }
    if (data.new_password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: data.new_password })
      if (error) throw error
      toast.success('Password berhasil diubah!')
      resetPw()
    } catch {
      toast.error('Gagal mengubah password')
    }
  }

  const tabs = [
    { id: 'profile' as const, icon: User, label: 'Profil' },
    { id: 'password' as const, icon: Lock, label: 'Password' },
    { id: 'notifications' as const, icon: Bell, label: 'Notifikasi' },
  ]

  const planColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-600',
    basic: 'bg-blue-50 text-blue-700',
    premium: 'bg-gold-50 text-gold-700',
    enterprise: 'bg-purple-50 text-purple-700',
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-elegant">Pengaturan</h1>
        <p className="text-elegant/50 text-sm font-sans mt-1">Kelola akun dan preferensi Anda</p>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elegant p-5 mb-6 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold flex-shrink-0">
          <span className="text-white text-xl font-bold font-sans">
            {user ? getInitials(user.full_name) : '?'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-elegant">{user?.full_name}</p>
          <p className="text-elegant/40 text-sm font-sans truncate">{user?.email}</p>
          <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-sans font-medium capitalize ${planColors[user?.plan || 'free']}`}>
            Paket {user?.plan || 'free'}
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium font-sans transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-elegant text-champagne shadow-elegant'
                : 'text-elegant/50 hover:text-elegant hover:bg-champagne/50'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elegant p-6"
        >
          <h3 className="font-sans font-semibold text-elegant text-sm mb-5">Informasi Profil</h3>
          <form onSubmit={handleProfile(onSaveProfile)} className="space-y-4">
            <div>
              <label className="label-elegant">Nama Lengkap</label>
              <input {...regProfile('full_name', { required: true })} className="input-elegant" />
            </div>
            <div>
              <label className="label-elegant">Email</label>
              <input value={user?.email || ''} disabled className="input-elegant opacity-50 cursor-not-allowed" />
              <p className="text-xs text-elegant/30 font-sans mt-1">Email tidak dapat diubah</p>
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="btn-gold disabled:opacity-60"
            >
              {savingProfile ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
              ) : (
                <><Save size={14} /> Simpan Profil</>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {/* Tab: Password */}
      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elegant p-6"
        >
          <h3 className="font-sans font-semibold text-elegant text-sm mb-5">Ubah Password</h3>
          <form onSubmit={handlePw(onChangePassword)} className="space-y-4">
            <div>
              <label className="label-elegant">Password Baru</label>
              <div className="relative">
                <input
                  {...regPw('new_password', { required: true, minLength: 8 })}
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="Min. 8 karakter"
                  className="input-elegant pr-12"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-elegant/40">
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label-elegant">Konfirmasi Password Baru</label>
              <input
                {...regPw('confirm_password', { required: true })}
                type={showNewPw ? 'text' : 'password'}
                placeholder="Ulangi password"
                className="input-elegant"
              />
            </div>
            <button type="submit" disabled={savingPw} className="btn-gold disabled:opacity-60">
              {savingPw ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengubah...</>
              ) : (
                <><Lock size={14} /> Ubah Password</>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elegant p-6"
        >
          <h3 className="font-sans font-semibold text-elegant text-sm mb-5">Preferensi Notifikasi</h3>
          <div className="space-y-4">
            {[
              { label: 'Email RSVP baru', desc: 'Terima notifikasi email setiap ada RSVP masuk' },
              { label: 'Laporan mingguan', desc: 'Ringkasan statistik undangan setiap minggu' },
              { label: 'Undangan dibuka', desc: 'Notifikasi saat tamu membuka undangan' },
            ].map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-champagne/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-elegant font-sans">{item.label}</p>
                  <p className="text-xs text-elegant/40 font-sans mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-champagne-dark peer-checked:bg-gold-500 rounded-full transition-colors duration-200 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
          <button className="btn-gold mt-4 text-sm">
            <Save size={14} /> Simpan Preferensi
          </button>
        </motion.div>
      )}
    </div>
  )
}
