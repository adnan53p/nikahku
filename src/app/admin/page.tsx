'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Heart, Eye, TrendingUp, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatNumber } from '@/lib/utils'

interface AdminStats {
  totalUsers: number
  totalEvents: number
  totalRsvp: number
  totalViews: number
  activeEvents: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalEvents: 0, totalRsvp: 0, totalViews: 0, activeEvents: 0 })
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      const [usersRes, eventsRes, rsvpRes] = await Promise.all([
        supabase.from('users').select('id, full_name, email, plan, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('events').select('id, is_published, view_count').eq('is_active', true),
        supabase.from('rsvp').select('id'),
      ])

      const events = eventsRes.data || []
      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalEvents: events.length,
        totalRsvp: rsvpRes.data?.length || 0,
        totalViews: events.reduce((s, e) => s + (e.view_count || 0), 0),
        activeEvents: events.filter(e => e.is_published).length,
      })
      setRecentUsers(usersRes.data?.slice(0, 5) || [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total User', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Undangan', value: stats.totalEvents, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Undangan Aktif', value: stats.activeEvents, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total RSVP', value: stats.totalRsvp, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total View', value: stats.totalViews, icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-elegant">Admin Dashboard</h1>
        <p className="text-elegant/50 text-sm font-sans mt-1">Statistik dan manajemen platform</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-elegant p-5"
          >
            {loading ? (
              <div className="space-y-2">
                <div className="skeleton h-8 w-8 rounded-xl" />
                <div className="skeleton h-7 w-14 rounded" />
              </div>
            ) : (
              <>
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <card.icon size={16} className={card.color} />
                </div>
                <p className="font-display text-2xl font-bold text-elegant">{formatNumber(card.value)}</p>
                <p className="text-xs text-elegant/40 font-sans mt-0.5">{card.label}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Users */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-sans font-semibold text-elegant mb-4">Pengguna Terbaru</h2>
        <div className="card-elegant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-champagne/50">
                <th className="text-left px-5 py-3 text-xs text-elegant/40 font-sans font-medium uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3 text-xs text-elegant/40 font-sans font-medium uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs text-elegant/40 font-sans font-medium uppercase tracking-wider">Paket</th>
                <th className="text-left px-5 py-3 text-xs text-elegant/40 font-sans font-medium uppercase tracking-wider hidden sm:table-cell">Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne/50">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-champagne/20 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-elegant font-sans">{user.full_name}</p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <p className="text-xs text-elegant/50 font-sans">{user.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-sans font-medium capitalize ${
                      user.plan === 'premium' ? 'bg-gold-50 text-gold-700' :
                      user.plan === 'enterprise' ? 'bg-purple-50 text-purple-700' :
                      'bg-champagne text-elegant/60'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <p className="text-xs text-elegant/40 font-sans">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
