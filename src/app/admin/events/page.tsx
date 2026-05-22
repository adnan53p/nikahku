'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink, Trash2, Eye, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AdminEvent {
  id: string
  slug: string
  bride_name: string
  groom_name: string
  event_date: string
  is_published: boolean
  is_active: boolean
  view_count: number
  created_at: string
  users?: { full_name: string; email: string }
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('events')
        .select('*, users(full_name, email)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      setEvents(data || [])
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const handleDeactivate = async (id: string) => {
    if (!confirm('Nonaktifkan undangan ini?')) return
    const supabase = createClient()
    const { error } = await supabase.from('events').update({ is_active: false }).eq('id', id)
    if (error) { toast.error('Gagal menonaktifkan'); return }
    setEvents(prev => prev.filter(e => e.id !== id))
    toast.success('Undangan dinonaktifkan')
  }

  const filtered = events.filter(e =>
    `${e.bride_name} ${e.groom_name} ${e.slug}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-elegant">Semua Undangan</h1>
        <p className="text-elegant/40 text-sm font-sans mt-1">
          {formatNumber(events.length)} total undangan
        </p>
      </motion.div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-elegant/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari undangan..." className="input-elegant pl-10" />
      </div>

      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-champagne/50">
                {['Mempelai', 'Pemilik', 'Tanggal', 'Views', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs text-elegant/40 font-sans font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-champagne/50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="skeleton h-4 w-20 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((event, i) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-champagne/10 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gold-50 flex items-center justify-center flex-shrink-0">
                        <Heart size={11} className="text-gold-500" fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-elegant font-sans whitespace-nowrap">
                          {event.bride_name} & {event.groom_name}
                        </p>
                        <p className="text-xs text-elegant/30 font-sans">/u/{event.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-elegant/60 font-sans">{event.users?.full_name}</p>
                    <p className="text-xs text-elegant/30 font-sans">{event.users?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-elegant/50 font-sans whitespace-nowrap">
                      {new Date(event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-xs text-elegant/50 font-sans">
                      <Eye size={11} /> {formatNumber(event.view_count || 0)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-sans font-medium ${
                      event.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-champagne text-gold-700'
                    }`}>
                      {event.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <a
                        href={`/u/${event.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-champagne text-elegant/40 hover:text-elegant transition-colors"
                      >
                        <ExternalLink size={12} />
                      </a>
                      <button
                        onClick={() => handleDeactivate(event.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-elegant/30 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-elegant/40 text-sm font-sans">Tidak ada undangan ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
