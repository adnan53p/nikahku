'use client'

import { useEffect, useState } from 'react'
import { Save, Palette, Type, Sparkles, Wand2, Mic, LayoutTemplate } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

type EventOption = {
  id: string
  title: string
  bride_name: string
  groom_name: string
  slug: string
  theme_slug?: string | null
}

const templates = [
  { slug: 'classic-elegant', name: 'Classic Elegant' },
  { slug: 'islamic-luxury', name: 'Islamic Luxury' },
  { slug: 'pendopo-senja', name: 'Pendopo Senja' },
  { slug: 'blue-serenity-indonesia', name: 'Blue Serenity Indonesia' },
  { slug: 'royal-garden', name: 'Royal Garden' },
  { slug: 'modern-minimal', name: 'Modern Minimal' },
  { slug: 'cinematic-gold', name: 'Cinematic Gold' },
]

const fonts = ['Playfair Display', 'Cormorant Garamond', 'Poppins', 'Inter', 'Montserrat', 'Lora', 'Merriweather']

export default function PremiumEditorPage() {
  const [events, setEvents] = useState<EventOption[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    theme_slug: 'classic-elegant',
    custom_primary_color: '#8c6a43',
    custom_secondary_color: '#f8f5f1',
    custom_accent_color: '#d4a017',
    custom_heading_font: 'Playfair Display',
    custom_body_font: 'Inter',
    particle_mode: 'gold-dust',
    auto_scroll_enabled: true,
    voice_narration_enabled: true,
    ai_invitation_enabled: true,
    opening_text: '',
    closing_text: '',
    ai_invitation_text: '',
    voice_narration_text: '',
  })

  useEffect(() => {
    const loadEvents = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('events')
        .select('id,title,bride_name,groom_name,slug,theme_slug')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setEvents(data || [])
      if (data?.[0]) setSelectedId(data[0].id)
    }

    loadEvents()
  }, [])

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const save = async () => {
    if (!selectedId) {
      toast.error('Pilih undangan dulu')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('events')
      .update(form as any)
      .eq('id', selectedId)

    setLoading(false)

    if (error) {
      toast.error('Gagal menyimpan. Jalankan migration SQL tahap 2-3 dulu.')
      return
    }

    toast.success('Pengaturan premium berhasil disimpan')
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-gold-500 text-xs tracking-[0.3em] uppercase font-sans mb-2">Tahap 2 & 3</p>
        <h1 className="font-display text-3xl font-bold text-elegant">Premium Invitation Editor</h1>
        <p className="text-elegant/50 text-sm mt-2">Edit semua teks, warna, font, partikel, template, AI text, voice narration, dan cinematic mode.</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="card-elegant p-5 h-fit">
          <label className="text-xs uppercase tracking-wider text-elegant/40">Pilih Undangan</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="input-elegant mt-2">
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.bride_name} & {event.groom_name}
              </option>
            ))}
          </select>

          <button onClick={save} disabled={loading} className="mt-5 w-full rounded-2xl bg-elegant text-champagne py-3 flex items-center justify-center gap-2">
            <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="card-elegant p-5">
            <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2"><LayoutTemplate size={18}/> Multi Template</h2>
            <select value={form.theme_slug} onChange={(e) => updateField('theme_slug', e.target.value)} className="input-elegant mt-4">
              {templates.map((template) => (
                <option key={template.slug} value={template.slug}>{template.name}</option>
              ))}
            </select>
          </div>

          <div className="card-elegant p-5">
            <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2"><Palette size={18}/> Custom Warna</h2>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {[
                ['custom_primary_color', 'Warna Utama'],
                ['custom_secondary_color', 'Background'],
                ['custom_accent_color', 'Aksen'],
              ].map(([key, label]) => (
                <label key={key} className="text-sm text-elegant/60">
                  {label}
                  <input type="color" value={(form as any)[key]} onChange={(e) => updateField(key, e.target.value)} className="w-full h-12 mt-2 rounded-xl" />
                </label>
              ))}
            </div>
          </div>

          <div className="card-elegant p-5">
            <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2"><Type size={18}/> Custom Font</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <select value={form.custom_heading_font} onChange={(e) => updateField('custom_heading_font', e.target.value)} className="input-elegant">
                {fonts.map((font) => <option key={font} value={font}>{font}</option>)}
              </select>
              <select value={form.custom_body_font} onChange={(e) => updateField('custom_body_font', e.target.value)} className="input-elegant">
                {fonts.map((font) => <option key={font} value={font}>{font}</option>)}
              </select>
            </div>
          </div>

          <div className="card-elegant p-5">
            <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2"><Sparkles size={18}/> Particle System</h2>
            <select value={form.particle_mode} onChange={(e) => updateField('particle_mode', e.target.value)} className="input-elegant mt-4">
              <option value="gold-dust">Gold Dust</option>
              <option value="sparkle">Sparkle</option>
              <option value="flower">Flower</option>
              <option value="hearts">Hearts</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="card-elegant p-5">
            <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2"><Wand2 size={18}/> Edit Semua Teks + AI Generator</h2>
            <textarea value={form.opening_text} onChange={(e) => updateField('opening_text', e.target.value)} placeholder="Teks pembuka undangan..." className="input-elegant mt-4 min-h-24" />
            <textarea value={form.closing_text} onChange={(e) => updateField('closing_text', e.target.value)} placeholder="Teks penutup undangan..." className="input-elegant mt-4 min-h-24" />
            <textarea value={form.ai_invitation_text} onChange={(e) => updateField('ai_invitation_text', e.target.value)} placeholder="Teks AI invitation generator..." className="input-elegant mt-4 min-h-32" />
            <label className="mt-4 flex items-center gap-2 text-sm text-elegant/60">
              <input type="checkbox" checked={form.ai_invitation_enabled} onChange={(e) => updateField('ai_invitation_enabled', e.target.checked)} />
              Aktifkan AI invitation text
            </label>
          </div>

          <div className="card-elegant p-5">
            <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2"><Mic size={18}/> Voice Narration + Cinematic Mode</h2>
            <textarea value={form.voice_narration_text} onChange={(e) => updateField('voice_narration_text', e.target.value)} placeholder="Teks narasi suara..." className="input-elegant mt-4 min-h-28" />
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <label className="flex items-center gap-2 text-sm text-elegant/60">
                <input type="checkbox" checked={form.voice_narration_enabled} onChange={(e) => updateField('voice_narration_enabled', e.target.checked)} />
                Aktifkan voice narration
              </label>
              <label className="flex items-center gap-2 text-sm text-elegant/60">
                <input type="checkbox" checked={form.auto_scroll_enabled} onChange={(e) => updateField('auto_scroll_enabled', e.target.checked)} />
                Aktifkan cinematic auto scroll
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
