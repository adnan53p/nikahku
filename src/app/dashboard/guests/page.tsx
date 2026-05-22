'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, MessageCircle, BarChart3, UserCheck, UserX } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { formatNumber, getWhatsAppLink, generateWhatsAppMessage, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface GuestWithEvent {
  id: string
  name: string
  slug: string
  phone: string | null
  invitation_link: string
  has_opened: boolean
  created_at: string
  events: {
    id: string
    slug: string
    bride_name: string
    groom_name: string
    event_date: string
  }
}

export default function GuestsOverviewPage() {
  const { user } = useAuth()
  const [guests, setGuests] = useState<GuestWithEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return
    const fetchGuests = async () => {
      const supabase = createClient()
      // Get user's events first
      const { data: events } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)

      const eventIds = (events || []).map(e => e.id)
      if (!eventIds.length) { setLoading(false); return }

      const { data } = await supabase
        .from('guests')
        .select('*, events(id, slug, bride_name, groom_name, event_date)')
        .in('event_id', eventIds)
        .order('created_at', { ascending: false })

      setGuests(data || [])
      setLoading(false)
    }
    fetchGuests()
  }, [user])

  const totalOpened = guests.filter(g => g.has_opened).length
  const openedRate = guests.length > 0 ? Math.round((totalOpened / guests.length) * 100) : 0

  const handleWhatsApp = (guest: GuestWithEvent) => {
    if (!guest.phone) { toast.error('Nomor telepon tidak tersedia'); return }
    const msg = generateWhatsAppMessage(
      guest.name,
      `${guest.events.bride_name} & ${guest.events.groom_name}`,
      formatDate(guest.events.event_date),
      guest.invitation_link
    )
    window.open(getWhatsAppLink(guest.phone, msg), '_blank')
  }

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.events.bride_name + g.events.groom_name).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-elegant">Semua Tamu</h1>
        <p className="text-elegant/50 text-sm font-sans mt-1">Kelola daftar tamu di semua undangan</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: 'Total Tamu', value: formatNumber(guests.length), color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: UserCheck, label: 'Sudah Buka', value: formatNumber(totalOpened), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: BarChart3, label: 'Open Rate', value: `${openedRate}%`, color: 'text-gold-600', bg: 'bg-gold-50' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-elegant p-4"
          >
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon size={14} className={s.color} />
            </div>
            <p className="font-display text-xl font-bold text-elegant">{loading ? '—' : s.value}</p>
            <p className="text-xs text-elegant/40 font-sans">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Open rate bar */}
      {guests.length > 0 && (
        <div className="card-elegant p-4 mb-6">
          <div className="flex justify-between text-xs font-sans text-elegant/50 mb-1.5">
            <span>Tingkat Pembukaan Undangan</span>
            <span>{openedRate}%</span>
          </div>
          <div className="h-2 bg-champagne rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${openedRate}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gold-gradient rounded-full"
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-elegant/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama tamu..." className="input-elegant pl-10" />
      </div>

      {/* Guest list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card-elegant p-4 flex gap-3 items-center">
              <div className="skeleton w-9 h-9 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-3 w-48 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-elegant p-16 text-center">
          <Users size={28} className="text-elegant/20 mx-auto mb-3" />
          <p className="text-elegant/40 text-sm font-sans">
            {search ? 'Tidak ada tamu ditemukan' : 'Belum ada tamu. Tambahkan di halaman undangan.'}
          </p>
        </div>
      ) : (
        <div className="card-elegant overflow-hidden">
          <div className="divide-y divide-champagne/50">
            {filtered.map((guest, i) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-champagne/10 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  guest.has_opened ? 'bg-emerald-50' : 'bg-champagne'
                }`}>
                  {guest.has_opened
                    ? <UserCheck size={15} className="text-emerald-600" />
                    : <span className="text-xs font-bold text-gold-600 font-sans">{guest.name.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-elegant font-sans truncate">{guest.name}</p>
                  <p className="text-xs text-elegant/40 font-sans truncate">
                    {guest.events.bride_name} & {guest.events.groom_name}
                    {guest.has_opened && <span className="text-emerald-500 ml-2">· Sudah dibuka</span>}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {guest.phone && (
                    <button
                      onClick={() => handleWhatsApp(guest)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-50 text-elegant/30 hover:text-green-600 transition-colors"
                      title="Kirim via WhatsApp"
                    >
                      <MessageCircle size={13} />
                    </button>
                  )}
                  {!guest.has_opened && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-champagne text-gold-700 font-sans">
                      Belum dibuka
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
