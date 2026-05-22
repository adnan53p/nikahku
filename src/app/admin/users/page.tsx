'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield, User, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { User as UserType } from '@/types'

const planBadge = (plan: string) => {
  const map: Record<string, string> = {
    free: 'bg-gray-100 text-gray-600',
    basic: 'bg-blue-50 text-blue-700',
    premium: 'bg-gold-50 text-gold-700',
    enterprise: 'bg-purple-50 text-purple-700',
  }
  return map[plan] || 'bg-gray-100 text-gray-600'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const handleToggleRole = async (user: UserType) => {
    const newRole = user.role === 'admin' ? 'client' : 'admin'
    const supabase = createClient()
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', user.id)
    if (error) { toast.error('Gagal update role'); return }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    toast.success(`Role diubah ke ${newRole}`)
  }

  const handleChangePlan = async (userId: string, plan: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('users').update({ plan }).eq('id', userId)
    if (error) { toast.error('Gagal update plan'); return }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: plan as UserType['plan'] } : u))
    toast.success('Paket diperbarui')
  }

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-elegant">Manajemen User</h1>
        <p className="text-elegant/40 text-sm font-sans mt-1">
          {formatNumber(users.length)} pengguna terdaftar
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-elegant/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          className="input-elegant pl-10"
        />
      </div>

      {/* Table */}
      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-champagne/50">
                {['Pengguna', 'Email', 'Paket', 'Role', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs text-elegant/40 font-sans font-semibold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="skeleton h-4 w-24 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-champagne/10 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {user.full_name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-elegant font-sans whitespace-nowrap">
                        {user.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-elegant/50 font-sans">{user.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={user.plan}
                      onChange={e => handleChangePlan(user.id, e.target.value)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-sans font-medium cursor-pointer border-0 outline-none capitalize ${planBadge(user.plan)}`}
                    >
                      {['free', 'basic', 'premium', 'enterprise'].map(p => (
                        <option key={p} value={p} className="bg-white text-elegant capitalize">{p}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-sans font-medium ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-champagne text-elegant/60'
                    }`}>
                      {user.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-elegant/40 font-sans whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleRole(user)}
                      className="btn-ghost text-xs"
                      title={user.role === 'admin' ? 'Turunkan ke Client' : 'Jadikan Admin'}
                    >
                      {user.role === 'admin' ? (
                        <><User size={12} /> To Client</>
                      ) : (
                        <><Crown size={12} /> To Admin</>
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <User size={28} className="text-elegant/20 mx-auto mb-2" />
            <p className="text-elegant/40 text-sm font-sans">Tidak ada pengguna ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
