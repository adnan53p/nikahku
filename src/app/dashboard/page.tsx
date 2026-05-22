'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Users, Heart, Eye, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { formatNumber } from '@/lib/utils'
import type { DashboardStats } from '@/types'

const statCards = (stats: DashboardStats) => [
  {
    label: 'Total Undangan',
    value: formatNumber(stats.totalEvents),
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    change: '+1 bulan ini',
  },
  {
    label: 'Total Tamu',
    value: formatNumber(stats.totalGuests),
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    change: `${formatNumber(stats.totalAttending)} konfirmasi`,
  },
  {
    label: 'Total RSVP',
    value: formatNumber(stats.totalRsvp),
    icon: Heart,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    change: `${stats.totalRsvp > 0 ? Math.round((stats.totalAttending / stats.totalRsvp) * 100) : 0}% hadir`,
  },
  {
    label: 'Total Dilihat',
    value: formatNumber(stats.totalViews),
    icon: Eye,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    change: 'Semua undangan',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalGuests: 0,
    totalRsvp: 0,
    totalAttending: 0,
    totalViews: 0,
  })
  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const supabase = createClient()

      const [eventsRes, guestsRes, rsvpRes] = await Promise.all([
        supabase.from('events').select('id, title, slug, bride_name, groom_name, event_date, view_count, is_published').eq('user_id', user.id).eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('guests').select('id, event_id').in('event_id', []),
        supabase.from('rsvp').select('id, is_attending, event_id'),
      ])

      const events = eventsRes.data || []
      setRecentEvents(events.slice(0, 3))

      const eventIds = events.map((e) => e.id)
      if (eventIds.length > 0) {
        const [guestsData, rsvpData] = await Promise.all([
          supabase.from('guests').select('id').in('event_id', eventIds),
          supabase.from('rsvp').select('id, is_attending').in('event_id', eventIds),
        ])

        const rsvp = rsvpData.data || []
        setStats({
          totalEvents: events.length,
          totalGuests: guestsData.data?.length || 0,
          totalRsvp: rsvp.length,
          totalAttending: rsvp.filter((r) => r.is_attending).length,
          totalViews: events.reduce((sum, e) => sum + (e.view_count || 0), 0),
        })
      } else {
        setStats((s) => ({ ...s, totalEvents: events.length }))
      }

      setLoading(false)
    }

    fetchData()
  }, [user])

  const cards = statCards(stats)

  return (
    <div className="p-6 sm:p-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-elegant mb-1">
          Selamat datang, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-elegant/50 text-sm font-sans">
          Pantau dan kelola semua undangan digital Anda
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-elegant p-5"
          >
            {loading ? (
              <div className="space-y-3">
                <div className="skeleton h-9 w-9 rounded-xl" />
                <div className="skeleton h-7 w-16 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
            ) : (
              <>
                <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <card.icon size={16} className={card.color} />
                </div>
                <p className="font-display text-2xl font-bold text-elegant">{card.value}</p>
                <p className="text-xs text-elegant/40 font-sans mt-0.5">{card.label}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={10} className="text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-sans">{card.change}</span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid sm:grid-cols-2 gap-6 mb-8"
      >
        {/* Create new */}
        <div className="bg-elegant rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold-500/10 -translate-y-8 translate-x-8" />
          <p className="text-champagne/60 text-xs font-sans mb-2">Siap mulai?</p>
          <h3 className="font-display text-xl font-bold text-champagne mb-4">
            Buat Undangan Baru
          </h3>
          <Link href="/dashboard/events" className="btn-gold text-sm group">
            <Plus size={15} />
            Buat Sekarang
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats summary */}
        <div className="card-elegant p-6">
          <h3 className="font-sans font-semibold text-elegant mb-4 text-sm">Ringkasan RSVP</h3>
          {stats.totalRsvp === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 text-center">
              <p className="text-elegant/30 text-xs font-sans">Belum ada konfirmasi RSVP</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-elegant/60 font-sans">Akan Hadir</span>
                <span className="font-semibold text-elegant font-sans">{formatNumber(stats.totalAttending)}</span>
              </div>
              <div className="h-2 bg-champagne rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-gradient rounded-full transition-all duration-1000"
                  style={{ width: `${stats.totalRsvp > 0 ? (stats.totalAttending / stats.totalRsvp) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-elegant/60 font-sans">Tidak Hadir</span>
                <span className="font-semibold text-elegant font-sans">
                  {formatNumber(stats.totalRsvp - stats.totalAttending)}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-elegant">Undangan Terbaru</h2>
          <Link href="/dashboard/events" className="text-sm text-gold-600 hover:text-gold-700 font-sans transition-colors flex items-center gap-1">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elegant p-4 flex gap-4">
                <div className="skeleton w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-3 w-48 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="card-elegant p-12 text-center">
            <Calendar size={32} className="text-elegant/20 mx-auto mb-3" />
            <p className="text-elegant/40 text-sm font-sans">Belum ada undangan. Buat yang pertama!</p>
            <Link href="/dashboard/events" className="btn-gold text-sm mt-4 inline-flex">
              <Plus size={14} /> Buat Undangan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="card-elegant p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
                  <Heart size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-elegant text-sm truncate">
                    {event.bride_name} & {event.groom_name}
                  </p>
                  <p className="text-elegant/40 text-xs font-sans">{event.event_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium ${
                    event.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-champagne text-gold-700'
                  }`}>
                    {event.is_published ? 'Aktif' : 'Draft'}
                  </div>
                  <Link href={`/dashboard/events/${event.id}`} className="btn-ghost text-xs">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
