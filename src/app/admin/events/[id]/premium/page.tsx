'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Save, Sparkles, Wand2, Volume2, Palette, Type, LayoutTemplate } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { defaultPremiumSettings, generateInvitationText, type PremiumInvitationSettings } from '@/lib/invitationPremium'

const templateOptions = [
  { slug: 'classic-elegant', name: 'Classic Elegant' },
  { slug: 'islamic-luxury', name: 'Islamic Luxury' },
  { slug: 'pendopo-senja', name: 'Pendopo Senja' },
  { slug: 'blue-serenity-indonesia', name: 'Blue Serenity Indonesia' },
]

const fonts = [
  'Playfair Display',
  'Cormorant Garamond',
  'Great Vibes',
  'Poppins',
  'Inter',
  'Lora',
  'Merriweather',
  'Montserrat',
]

export default function PremiumEventEditorPage() {
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [settings, setSettings] = useState<PremiumInvitationSettings>(defaultPremiumSettings)

  useEffect(() => {
    if (!id) return

    const load = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()

      if (error) {
        toast.error('Gagal membuka data undangan')
        setLoading(false)
        return
      }

      let parsed = {}

      try {
        parsed = data?.premium_settings_json ? JSON.parse(data.premium_settings_json) : {}
      } catch {}

      setEvent(data)
      setSettings({
        ...defaultPremiumSettings,
        ...parsed,
        primaryColor: data?.custom_primary_color || (parsed as any).primaryColor || defaultPremiumSettings.primaryColor,
        secondaryColor: data?.custom_secondary_color || (parsed as any).secondaryColor || defaultPremiumSettings.secondaryColor,
        accentColor: data?.custom_accent_color || (parsed as any).accentColor || defaultPremiumSettings.accentColor,
        headingFont: data?.custom_heading_font || (parsed as any).headingFont || defaultPremiumSettings.headingFont,
        bodyFont: data?.custom_body_font || (parsed as any).bodyFont || defaultPremiumSettings.bodyFont,
        particleMode: data?.particle_mode || (parsed as any).particleMode || defaultPremiumSettings.particleMode,
      })

      setLoading(false)
    }

    load()
  }, [id])

  const updateSetting = <K extends keyof PremiumInvitationSettings>(key: K, value: PremiumInvitationSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const aiText = () => {
    if (!event) return

    const result = generateInvitationText({
      brideName: event.bride_name,
      groomName: event.groom_name,
      style: 'islami',
    })

    setSettings((prev) => ({
      ...prev,
      openingText: result.openingText,
      closingText: result.closingText,
      voiceText: result.voiceText,
    }))

    toast.success('Teks undangan berhasil dibuat otomatis')
  }

  const save = async () => {
    if (!event) return

    setSaving(true)
    const supabase = createClient()

    const payload = {
      premium_settings_json: JSON.stringify(settings),
      custom_primary_color: settings.primaryColor,
      custom_secondary_color: settings.secondaryColor,
      custom_accent_color: settings.accentColor,
      custom_heading_font: settings.headingFont,
      custom_body_font: settings.bodyFont,
      particle_mode: settings.particleMode,
      auto_scroll_enabled: settings.cinematicMode,
      theme_slug: event.theme_slug,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('events').update(payload).eq('id', event.id)
    setSaving(false)

    if (error) {
      toast.error('Gagal menyimpan. Pastikan migration SQL sudah dijalankan.')
      return
    }

    toast.success('Pengaturan premium tersimpan')
  }

  if (loading) return <div className="p-8">Memuat editor premium...</div>
  if (!event) return <div className="p-8">Data undangan tidak ditemukan.</div>

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-elegant">Editor Premium</h1>
          <p className="text-elegant/50 text-sm mt-1">
            Edit semua teks, warna, font, partikel, template, narasi, dan cinematic mode.
          </p>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 justify-center">
          <Save size={16} />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card-elegant p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2">
            <Sparkles size={18} /> Teks Undangan
          </h2>

          <button onClick={aiText} className="btn-secondary flex items-center gap-2">
            <Wand2 size={16} /> Buat Kata-kata Otomatis
          </button>

          {[
            ['openingGreeting', 'Salam Pembuka'],
            ['openingText', 'Teks Pembuka'],
            ['invitationText', 'Kalimat Undangan'],
            ['quranText', 'Ayat / Kutipan'],
            ['closingText', 'Teks Penutup'],
            ['closingGreeting', 'Salam Penutup'],
            ['buttonOpenText', 'Teks Tombol Buka'],
            ['loveStoryTitle', 'Judul Love Story'],
            ['galleryTitle', 'Judul Galeri'],
            ['rsvpTitle', 'Judul RSVP'],
            ['giftTitle', 'Judul Gift'],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider">{label}</span>
              <textarea
                value={(settings as any)[key] || ''}
                onChange={(e) => updateSetting(key as any, e.target.value as any)}
                className="input-elegant mt-1 min-h-[82px]"
              />
            </label>
          ))}
        </section>

        <section className="card-elegant p-6 space-y-5">
          <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2">
            <Palette size={18} /> Warna & Font
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['primaryColor', 'Warna Utama'],
              ['secondaryColor', 'Warna Background'],
              ['accentColor', 'Warna Emas/Aksen'],
              ['buttonTextColor', 'Warna Teks Tombol'],
              ['backgroundColor', 'Warna Latar Undangan'],
              ['coverOverlayColor', 'Warna Overlay Cover'],
            ].map(([key, label]) => (
              <label key={key}>
                <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider">{label}</span>
                <input
                  type="color"
                  value={(settings as any)[key] || '#000000'}
                  onChange={(e) => updateSetting(key as any, e.target.value as any)}
                  className="w-full h-12 rounded-xl border border-champagne mt-1"
                />
              </label>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider flex gap-1 items-center">
                <Type size={13} /> Font Judul
              </span>
              <select
                value={settings.headingFont}
                onChange={(e) => updateSetting('headingFont', e.target.value)}
                className="input-elegant mt-1"
              >
                {fonts.map((font) => (
                  <option key={font}>{font}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider flex gap-1 items-center">
                <Type size={13} /> Font Isi
              </span>
              <select
                value={settings.bodyFont}
                onChange={(e) => updateSetting('bodyFont', e.target.value)}
                className="input-elegant mt-1"
              >
                {fonts.map((font) => (
                  <option key={font}>{font}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider">Ukuran Font</span>
            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.05"
              value={settings.fontScale || 1}
              onChange={(e) => updateSetting('fontScale', Number(e.target.value))}
              className="w-full"
            />
          </label>

          <h2 className="font-display text-xl font-bold text-elegant flex items-center gap-2 pt-4">
            <LayoutTemplate size={18} /> Template & Efek
          </h2>

          <label className="block">
            <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider">Template</span>
            <select
              value={event.theme_slug || 'classic-elegant'}
              onChange={(e) => setEvent({ ...event, theme_slug: e.target.value })}
              className="input-elegant mt-1"
            >
              {templateOptions.map((template) => (
                <option key={template.slug} value={template.slug}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider">Partikel Cover</span>
            <select
              value={settings.particleMode || 'sparkle'}
              onChange={(e) => updateSetting('particleMode', e.target.value as any)}
              className="input-elegant mt-1"
            >
              <option value="none">Tidak Ada</option>
              <option value="sparkle">Sparkle</option>
              <option value="flower">Bunga</option>
              <option value="goldDust">Debu Emas</option>
              <option value="heart">Love</option>
              <option value="snow">Salju</option>
            </select>
          </label>

          <label className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-champagne/30">
            <span>
              <b className="block text-elegant">Cinematic Mode</b>
              <small className="text-elegant/50">Auto scroll, efek layar film, dan flow premium.</small>
            </span>
            <input
              type="checkbox"
              checked={!!settings.cinematicMode}
              onChange={(e) => updateSetting('cinematicMode', e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-champagne/30">
            <span>
              <b className="block text-elegant flex items-center gap-2">
                <Volume2 size={15} /> Voice Narration
              </b>
              <small className="text-elegant/50">Narasi suara otomatis dari browser.</small>
            </span>
            <input
              type="checkbox"
              checked={!!settings.voiceNarration}
              onChange={(e) => updateSetting('voiceNarration', e.target.checked)}
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-elegant/50 uppercase tracking-wider">Teks Narasi Suara</span>
            <textarea
              value={settings.voiceText || ''}
              onChange={(e) => updateSetting('voiceText', e.target.value)}
              className="input-elegant mt-1 min-h-[120px]"
            />
          </label>
        </section>
      </div>
    </div>
  )
}