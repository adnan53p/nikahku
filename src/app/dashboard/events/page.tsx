'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, Eye, Edit3, Trash2, ExternalLink, Copy, Check, Heart, Search, Image, Gift, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { getEvents, deleteEvent, publishEvent } from '@/services/event.service'
import { formatDate, cn, generateWhatsAppMessage } from '@/lib/utils'
import { EventModal } from '@/components/dashboard/EventModal'
import type { EventRow } from '@/types'

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchEvents = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getEvents(user.id)
      setEvents(data as EventRow[])
    } catch {
      toast.error('Gagal memuat undangan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus undangan ini? Tindakan tidak bisa dibatalkan.')) return
    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
      toast.success('Undangan dihapus')
    } catch {
      toast.error('Gagal menghapus')
    }
  }

  const handleTogglePublish = async (event: EventRow) => {
    try {
      await publishEvent(event.id, !event.is_published)
      setEvents((prev) =>
        prev.map((e) => e.id === event.id ? { ...e, is_published: !e.is_published } : e)
      )
      toast.success(event.is_published ? 'Undangan disembunyikan' : 'Undangan dipublikasikan! 🎉')
    } catch {
      toast.error('Gagal memperbarui status')
    }
  }

  const getInvitationLink = (slug: string) => `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/u/${slug}`

  const handleCopyLink = (slug: string, id: string) => {
    const link = getInvitationLink(slug)
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    toast.success('Link disalin!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleShareWhatsApp = (event: EventRow) => {
    const msg = generateWhatsAppMessage(
      'Tamu Undangan',
      `${event.bride_name} & ${event.groom_name}`,
      formatDate(event.event_date),
      getInvitationLink(event.slug)
    )
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const filtered = events.filter((e) =>
    `${e.bride_name} ${e.groom_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-elegant">Undangan Saya</h1>
          <p className="text-elegant/50 text-sm font-sans mt-1">Kelola semua undangan digital Anda</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold">
          <Plus size={16} /> Buat Undangan Baru
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-elegant/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama mempelai..."
          className="input-elegant pl-10"
        />
      </motion.div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-elegant p-5 space-y-3">
              <div className="skeleton h-36 rounded-xl" />
              <div className="skeleton h-5 w-32 rounded" />
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-9 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-elegant p-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-champagne flex items-center justify-center mx-auto mb-4">
            <Calendar size={24} className="text-gold-500" />
          </div>
          <h3 className="font-display text-xl font-bold text-elegant mb-2">
            {search ? 'Tidak ditemukan' : 'Belum Ada Undangan'}
          </h3>
          <p className="text-elegant/40 text-sm font-sans mb-6">
            {search ? 'Coba kata kunci lain' : 'Mulai buat undangan digital pertama Anda'}
          </p>
          {!search && (
            <button onClick={() => setShowModal(true)} className="btn-gold">
              <Plus size={16} /> Buat Undangan
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="card-elegant overflow-hidden group"
              >
                {/* Cover placeholder */}
                <div className="relative h-36 bg-elegant overflow-hidden">
                  {event.cover_image_url ? (
                    <img
                      src={event.cover_image_url}
                      alt="Cover"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-elegant to-elegant-light flex items-center justify-center">
                      <div className="text-center">
                        <Heart size={24} className="text-champagne/30 mx-auto mb-1" />
                        <p className="text-champagne/30 text-xs font-display italic">
                          {event.bride_name} & {event.groom_name}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Status badge */}
                  <div className={cn(
                    'absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium font-sans',
                    event.is_published
                      ? 'bg-emerald-500 text-white'
                      : 'bg-black/50 text-white backdrop-blur-sm'
                  )}>
                    {event.is_published ? 'Live' : 'Draft'}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-elegant mb-0.5">
                    {event.bride_name} & {event.groom_name}
                  </h3>
                  <p className="text-elegant/40 text-xs font-sans mb-1">
                    {formatDate(event.event_date)}
                  </p>
                  <p className="text-elegant/30 text-xs font-sans truncate mb-4">
                    invitely.id/u/{event.slug}
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-champagne/50">
                    <div className="flex items-center gap-1.5 text-xs text-elegant/50 font-sans">
                      <Eye size={12} /> {event.view_count || 0}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="btn-ghost text-xs flex-1 justify-center"
                    >
                      <Edit3 size={13} /> Kelola
                    </Link>
                    <button
                      onClick={() => handleCopyLink(event.slug, event.id)}
                      className="btn-ghost text-xs flex-1 justify-center"
                    >
                      {copiedId === event.id ? (
                        <><Check size={13} className="text-emerald-500" /> Disalin</>
                      ) : (
                        <><Copy size={13} /> Salin Link</>
                      )}
                    </button>
                    <button
                      onClick={() => handleShareWhatsApp(event)}
                      className="btn-ghost text-xs justify-center"
                      title="Share WhatsApp"
                    >
                      <MessageCircle size={13} /> WA
                    </button>
                    <button
                      onClick={() => handleTogglePublish(event)}
                      className={cn(
                        'text-xs px-3 py-2 rounded-lg font-sans font-medium transition-all duration-200',
                        event.is_published
                          ? 'bg-champagne text-gold-700 hover:bg-gold-100'
                          : 'bg-gold-gradient text-white shadow-gold hover:shadow-gold-lg'
                      )}
                    >
                      {event.is_published ? 'Sembunyikan' : 'Publish'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href={`/dashboard/events/${event.id}?tab=info`} className="btn-outline-gold text-xs justify-center">
                      <Image size={13} /> Upload Foto
                    </Link>
                    <Link href={`/dashboard/events/${event.id}?tab=gift`} className="btn-outline-gold text-xs justify-center">
                      <Gift size={13} /> E-Gift/QRIS
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {event.is_published && (
                      <a
                        href={`/u/${event.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs flex-1 justify-center"
                      >
                        <ExternalLink size={13} /> Lihat
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="btn-ghost text-xs text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <EventModal
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); fetchEvents() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
