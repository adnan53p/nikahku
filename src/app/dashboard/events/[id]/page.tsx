'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Edit3, Image, Music, Gift, Users, BarChart3, Share2, ExternalLink, Copy, Check, Eye, EyeOff, LayoutTemplate } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/types'
import { EventInfoTab } from '@/components/dashboard/tabs/EventInfoTab'
import { GalleryTab } from '@/components/dashboard/tabs/GalleryTab'
import { MusicTab } from '@/components/dashboard/tabs/MusicTab'
import { GiftTab } from '@/components/dashboard/tabs/GiftTab'
import { GuestTab } from '@/components/dashboard/tabs/GuestTab'
import { RsvpTab } from '@/components/dashboard/tabs/RsvpTab'
import { cn, generateWhatsAppMessage, formatDate, generateShareLink } from '@/lib/utils'
import { publishEvent } from '@/services/event.service'

const tabs = [
  { id: 'info', label: 'Data & Foto Cover', icon: Edit3 },
  { id: 'gallery', label: 'Upload Galeri', icon: Image },
  { id: 'music', label: 'Musik', icon: Music },
  { id: 'gift', label: 'E-Gift / QRIS', icon: Gift },
  { id: 'guests', label: 'Tamu & Link', icon: Users },
  { id: 'rsvp', label: 'RSVP', icon: BarChart3 },
]

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info')
  const [publishing, setPublishing] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchEvent = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*, themes(*), galleries(*), gift_accounts(*), event_music(*)')
      .eq('id', id)
      .single()

    if (error) toast.error('Gagal memuat undangan')
    setEvent(data as Event)
    setLoading(false)
  }

  useEffect(() => { fetchEvent() }, [id])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.some((item) => item.id === tab)) setActiveTab(tab)
  }, [searchParams])

  const invitationLink = event ? generateShareLink(event.slug) : ''

  const handleShare = () => {
    if (!event) return
    const msg = generateWhatsAppMessage(
      'Tamu Undangan',
      `${event.bride_name} & ${event.groom_name}`,
      formatDate(event.event_date),
      invitationLink
    )
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleCopy = async () => {
    if (!event) return
    await navigator.clipboard.writeText(invitationLink)
    setCopied(true)
    toast.success('Link undangan disalin')
    setTimeout(() => setCopied(false), 1800)
  }

  const handleTogglePublish = async () => {
    if (!event) return
    setPublishing(true)
    try {
      const next = !event.is_published
      await publishEvent(event.id, next)
      setEvent({ ...event, is_published: next })
      toast.success(next ? 'Undangan dipublish dan bisa dibuka tamu' : 'Undangan menjadi draft')
    } catch {
      toast.error('Gagal mengubah status publish')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-4">
        <div className="skeleton h-8 w-64 rounded-xl" />
        <div className="skeleton h-4 w-40 rounded" />
        <div className="flex gap-2 mt-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-10 w-28 rounded-xl" />)}
        </div>
        <div className="skeleton h-64 rounded-2xl mt-4" />
      </div>
    )
  }

  if (!event) return (
    <div className="p-8 text-center">
      <p className="text-elegant/40 font-sans">Undangan tidak ditemukan</p>
    </div>
  )

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-6"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="font-display text-2xl font-bold text-elegant">
              {event.bride_name} & {event.groom_name}
            </h1>
            <span className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold font-sans',
              event.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            )}>
              {event.is_published ? 'LIVE / Published' : 'DRAFT'}
            </span>
          </div>
          <p className="text-elegant/40 text-sm font-sans mt-0.5">
            {invitationLink} · {formatDate(event.event_date)}
          </p>
          <p className="text-elegant/35 text-xs font-sans mt-1">
            Link tamu otomatis: {invitationLink}?to=Papik
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleTogglePublish} disabled={publishing} className={cn(
            'text-sm px-4 py-2 rounded-xl font-sans font-semibold inline-flex items-center gap-2 transition-all',
            event.is_published ? 'bg-champagne text-gold-700 hover:bg-gold-100' : 'bg-gold-gradient text-white shadow-gold'
          )}>
            {event.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
            {publishing ? 'Memproses...' : event.is_published ? 'Jadikan Draft' : 'Publish'}
          </button>
          <button onClick={handleCopy} className="btn-outline-gold text-sm">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Disalin' : 'Salin Link'}
          </button>
          <button onClick={handleShare} className="btn-outline-gold text-sm">
            <Share2 size={14} /> Share WhatsApp
          </button>
          {event.is_published && (
            <>
              <a href={`/u/${event.slug}?edit=1`} target="_blank" rel="noopener noreferrer" className="btn-outline-gold text-sm">
                <LayoutTemplate size={14} /> Editor Template Aktif
              </a>
              <a href={`/u/${event.slug}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                <ExternalLink size={14} /> Lihat
              </a>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <button onClick={() => setActiveTab('info')} className="card-elegant p-4 text-left hover:shadow-elegant transition">
          <p className="text-xs text-elegant/40 font-sans">Step 1</p>
          <p className="font-sans font-semibold text-elegant text-sm">Upload cover & foto mempelai</p>
        </button>
        <button onClick={() => setActiveTab('gallery')} className="card-elegant p-4 text-left hover:shadow-elegant transition">
          <p className="text-xs text-elegant/40 font-sans">Step 2</p>
          <p className="font-sans font-semibold text-elegant text-sm">Upload galeri foto</p>
        </button>
        <button onClick={() => setActiveTab('gift')} className="card-elegant p-4 text-left hover:shadow-elegant transition">
          <p className="text-xs text-elegant/40 font-sans">Step 3</p>
          <p className="font-sans font-semibold text-elegant text-sm">Rekening & QRIS</p>
        </button>
        <button onClick={() => setActiveTab('guests')} className="card-elegant p-4 text-left hover:shadow-elegant transition">
          <p className="text-xs text-elegant/40 font-sans">Step 4</p>
          <p className="font-sans font-semibold text-elegant text-sm">Guest link ?to=Nama</p>
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium font-sans whitespace-nowrap transition-all duration-200',
              activeTab === tab.id
                ? 'bg-elegant text-champagne shadow-elegant'
                : 'text-elegant/50 hover:text-elegant hover:bg-champagne/50'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'info' && <EventInfoTab event={event} onUpdate={fetchEvent} />}
        {activeTab === 'gallery' && <GalleryTab event={event} onUpdate={fetchEvent} />}
        {activeTab === 'music' && <MusicTab event={event} onUpdate={fetchEvent} />}
        {activeTab === 'gift' && <GiftTab event={event} onUpdate={fetchEvent} />}
        {activeTab === 'guests' && <GuestTab event={event} onUpdate={fetchEvent} />}
        {activeTab === 'rsvp' && <RsvpTab event={event} />}
      </motion.div>
    </div>
  )
}
