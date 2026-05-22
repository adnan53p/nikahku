'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Palette, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import type { Theme } from '@/types'

type EventOption = {
  id: string
  title: string
  slug: string
  bride_name: string
  groom_name: string
  theme_id: string | null
  theme_slug: string | null
}

export default function ThemesPage() {
  const { user } = useAuth()
  const [themes, setThemes] = useState<Theme[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      setLoading(true)
      const supabase = createClient()
      const [{ data: themeData }, { data: eventData }] = await Promise.all([
        supabase.from('themes').select('*').eq('is_active', true).order('is_premium', { ascending: true }),
        supabase.from('events').select('id,title,slug,bride_name,groom_name,theme_id,theme_slug').eq('user_id', user.id).eq('is_active', true).order('created_at', { ascending: false }),
      ])
      setThemes(themeData || [])
      setEvents((eventData || []) as EventOption[])
      setSelectedEventId((eventData || [])[0]?.id || '')
      setLoading(false)
    }
    fetchData()
  }, [user?.id])

  const selectedEvent = events.find((event) => event.id === selectedEventId)
  const isPremium = user?.plan === 'premium' || user?.plan === 'enterprise'

  const handleApplyTheme = async (theme: Theme) => {
    if (!selectedEventId) {
      toast.error('Buat/pilih undangan terlebih dahulu')
      return
    }
    if (theme.is_premium && !isPremium) {
      toast.error('Tema premium membutuhkan paket premium')
      return
    }

    setApplying(theme.id)
    const supabase = createClient()
    const { error } = await supabase
      .from('events')
      .update({ theme_id: theme.id, theme_slug: theme.slug })
      .eq('id', selectedEventId)

    if (error) {
      toast.error('Gagal menerapkan tema')
    } else {
      setEvents((prev) => prev.map((event) => event.id === selectedEventId ? { ...event, theme_id: theme.id, theme_slug: theme.slug } : event))
      toast.success('Tema berhasil diterapkan!')
    }
    setApplying(null)
  }

  const upgradeWhatsapp = () => {
    const message = 'Halo admin, saya ingin upgrade paket premium Invitely.'
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285179950857'}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-elegant">Pilih Tema</h1>
        <p className="text-elegant/50 text-sm font-sans mt-1">Pilih undangan, lalu terapkan template yang ingin digunakan.</p>
      </motion.div>

      <div className="card-elegant p-5 mb-6">
        <label className="label-elegant">Pilih Undangan</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className="input-elegant flex-1">
            {events.length === 0 && <option value="">Belum ada undangan</option>}
            {events.map((event) => <option key={event.id} value={event.id}>{event.title || `${event.groom_name} & ${event.bride_name}`}</option>)}
          </select>
          {selectedEvent && (
            <a href={`/u/${selectedEvent.slug}`} target="_blank" className="btn-outline-gold justify-center">
              <ExternalLink size={14} /> Preview
            </a>
          )}
        </div>
      </div>

      {!isPremium && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-elegant rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold-500/10 -translate-y-12 translate-x-12" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1"><Crown size={16} className="text-gold-400" /><p className="text-champagne font-sans font-semibold text-sm">Upgrade ke Premium</p></div>
            <p className="text-champagne/50 text-xs font-sans">Akses semua tema eksklusif, tanpa watermark, dan fitur premium lainnya.</p>
          </div>
          <button onClick={upgradeWhatsapp} className="btn-gold text-sm flex-shrink-0 relative">Upgrade Sekarang</button>
        </motion.div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card-elegant overflow-hidden"><div className="skeleton h-40 w-full" /><div className="p-4"><div className="skeleton h-9 rounded-xl" /></div></div>)}</div>
      ) : themes.length === 0 ? (
        <div className="card-elegant p-16 text-center"><Palette size={32} className="text-elegant/20 mx-auto mb-3" /><p className="text-elegant/40 text-sm font-sans">Belum ada tema tersedia</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {themes.map((theme, i) => {
            const isLocked = theme.is_premium && !isPremium
            const isSelected = selectedEvent?.theme_id === theme.id || selectedEvent?.theme_slug === theme.slug
            return (
              <motion.div key={theme.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="card-elegant overflow-hidden group">
                <div className="h-40 relative flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.accent_color} 0%, ${theme.secondary_color} 100%)` }}>
                  <div className="text-center px-6 z-10">
                    <p className="text-xs mb-2 opacity-60" style={{ color: theme.primary_color }}>The Wedding of</p>
                    <p className="text-2xl font-bold italic leading-tight" style={{ color: theme.primary_color, fontFamily: theme.font_heading }}>Adnan & Siti</p>
                    <div className="w-10 h-px mt-2 mx-auto opacity-50" style={{ background: theme.primary_color }} />
                  </div>
                  {isLocked && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20"><div className="text-center"><Crown size={20} className="text-gold-400 mx-auto mb-1" /><p className="text-white text-xs font-sans">Premium</p></div></div>}
                  {isSelected && <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg z-20"><Check size={13} className="text-white" /></div>}
                  {theme.is_premium && <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-gold-gradient text-white shadow-gold z-20">Premium</div>}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {[theme.primary_color, theme.secondary_color, theme.accent_color].map((c, ci) => <div key={ci} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ background: c }} />)}
                    <p className="text-elegant font-sans font-semibold text-sm ml-1">{theme.name}</p>
                  </div>
                  <p className="text-elegant/40 text-xs font-sans mb-3">{theme.slug}</p>
                  <button onClick={() => handleApplyTheme(theme)} disabled={isLocked || applying === theme.id || !selectedEventId} className={`w-full py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${isLocked ? 'bg-champagne text-elegant/30 cursor-not-allowed' : isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gold-gradient text-white shadow-gold hover:shadow-gold-lg hover:scale-[1.02]'}`}>
                    {applying === theme.id ? 'Menerapkan...' : isLocked ? '🔒 Upgrade untuk Akses' : isSelected ? '✓ Diterapkan' : 'Terapkan Tema'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
