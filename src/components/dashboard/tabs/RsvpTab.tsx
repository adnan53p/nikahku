'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, UserX, Users, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatNumber } from '@/lib/utils'
import type { Event, Rsvp } from '@/types'

export function RsvpTab({ event }: { event: Event }) {
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const fetch = async () => {
      const { data } = await supabase
        .from('rsvp')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false })
      setRsvps(data || [])
      setLoading(false)
    }
    fetch()

    // Realtime subscription
    const sub = supabase
      .channel('rsvp-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvp', filter: `event_id=eq.${event.id}` },
        (payload) => setRsvps(prev => [payload.new as Rsvp, ...prev])
      )
      .subscribe()

    return () => { supabase.removeChannel(sub) }
  }, [event.id])

  const attending = rsvps.filter(r => r.is_attending)
  const notAttending = rsvps.filter(r => !r.is_attending)
  const totalGuests = attending.reduce((sum, r) => sum + r.guest_count, 0)
  const attendRate = rsvps.length > 0 ? Math.round((attending.length / rsvps.length) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Heart, label: 'Akan Hadir', value: attending.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: UserX, label: 'Tidak Hadir', value: notAttending.length, color: 'text-red-500', bg: 'bg-red-50' },
          { icon: Users, label: 'Total Tamu', value: totalGuests, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: MessageSquare, label: 'Total RSVP', value: rsvps.length, color: 'text-gold-600', bg: 'bg-gold-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-elegant p-4"
          >
            <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
              <stat.icon size={14} className={stat.color} />
            </div>
            <p className="font-display text-2xl font-bold text-elegant">{formatNumber(stat.value)}</p>
            <p className="text-xs text-elegant/40 font-sans">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      {rsvps.length > 0 && (
        <div className="card-elegant p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-sans text-elegant/60">Tingkat Kehadiran</span>
            <span className="font-display text-lg font-bold text-elegant">{attendRate}%</span>
          </div>
          <div className="h-2.5 bg-champagne rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${attendRate}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full bg-gold-gradient rounded-full"
            />
          </div>
        </div>
      )}

      {/* RSVP list */}
      <div className="card-elegant p-5">
        <h3 className="font-sans font-semibold text-elegant text-sm mb-4">
          Ucapan & Konfirmasi{' '}
          <span className="text-elegant/40 font-normal">({rsvps.length})</span>
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : rsvps.length === 0 ? (
          <div className="text-center py-10">
            <Heart size={28} className="text-elegant/20 mx-auto mb-2" />
            <p className="text-elegant/40 text-sm font-sans">Belum ada RSVP masuk</p>
            <p className="text-elegant/30 text-xs font-sans mt-1">Data akan muncul realtime saat tamu mengisi form</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {rsvps.map((rsvp, i) => (
              <motion.div
                key={rsvp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex gap-3 p-3 rounded-xl bg-champagne/30 hover:bg-champagne/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${rsvp.is_attending ? 'bg-emerald-100' : 'bg-red-50'}`}>
                  {rsvp.is_attending
                    ? <Heart size={13} className="text-emerald-600" fill="currentColor" />
                    : <UserX size={13} className="text-red-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-elegant font-sans">{rsvp.guest_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${rsvp.is_attending ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                      {rsvp.is_attending ? `Hadir • ${rsvp.guest_count} tamu` : 'Tidak Hadir'}
                    </span>
                  </div>
                  {rsvp.message && (
                    <p className="text-xs text-elegant/50 font-sans mt-1 italic">"{rsvp.message}"</p>
                  )}
                  <p className="text-xs text-elegant/30 font-sans mt-0.5">
                    {new Date(rsvp.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
