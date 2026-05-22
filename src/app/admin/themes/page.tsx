'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit3, Palette, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Theme } from '@/types'

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', primary_color: '#D4A017', secondary_color: '#F7E7CE',
    accent_color: '#1A1A2E', font_heading: 'Playfair Display',
    font_body: 'Cormorant Garamond', is_premium: false,
  })

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('themes').select('*').order('created_at', { ascending: false })
    setThemes(data || [])
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error('Nama tema wajib diisi'); return }
    const supabase = createClient()
    const { error } = await supabase.from('themes').insert({
      ...form,
      preview_image_url: '',
      is_active: true,
    })
    if (error) { toast.error('Gagal membuat tema'); return }
    toast.success('Tema berhasil dibuat!')
    setShowForm(false)
    setForm({ name: '', primary_color: '#D4A017', secondary_color: '#F7E7CE', accent_color: '#1A1A2E', font_heading: 'Playfair Display', font_body: 'Cormorant Garamond', is_premium: false })
    fetchThemes()
  }

  const handleToggleActive = async (theme: Theme) => {
    const supabase = createClient()
    await supabase.from('themes').update({ is_active: !theme.is_active }).eq('id', theme.id)
    setThemes(prev => prev.map(t => t.id === theme.id ? { ...t, is_active: !t.is_active } : t))
    toast.success(`Tema ${theme.is_active ? 'dinonaktifkan' : 'diaktifkan'}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus tema ini?')) return
    const supabase = createClient()
    await supabase.from('themes').delete().eq('id', id)
    setThemes(prev => prev.filter(t => t.id !== id))
    toast.success('Tema dihapus')
  }

  return (
    <div className="p-6 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-elegant">Tema Manager</h1>
          <p className="text-elegant/40 text-sm font-sans mt-1">{themes.length} tema tersedia</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold">
          <Plus size={15} /> Tambah Tema
        </button>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-elegant p-6 mb-6"
          >
            <h3 className="font-sans font-semibold text-elegant text-sm mb-4">Buat Tema Baru</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="label-elegant">Nama Tema *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-elegant"
                  placeholder="Champagne Gold"
                />
              </div>
              <div>
                <label className="label-elegant">Warna Utama</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-champagne-dark"
                  />
                  <input
                    value={form.primary_color}
                    onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
                    className="input-elegant flex-1"
                    placeholder="#D4A017"
                  />
                </div>
              </div>
              <div>
                <label className="label-elegant">Warna Sekunder</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.secondary_color}
                    onChange={e => setForm(f => ({ ...f, secondary_color: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-champagne-dark"
                  />
                  <input
                    value={form.secondary_color}
                    onChange={e => setForm(f => ({ ...f, secondary_color: e.target.value }))}
                    className="input-elegant flex-1"
                    placeholder="#F7E7CE"
                  />
                </div>
              </div>
              <div>
                <label className="label-elegant">Warna Aksen</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accent_color}
                    onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-champagne-dark"
                  />
                  <input
                    value={form.accent_color}
                    onChange={e => setForm(f => ({ ...f, accent_color: e.target.value }))}
                    className="input-elegant flex-1"
                    placeholder="#1A1A2E"
                  />
                </div>
              </div>
              <div>
                <label className="label-elegant">Font Heading</label>
                <select
                  value={form.font_heading}
                  onChange={e => setForm(f => ({ ...f, font_heading: e.target.value }))}
                  className="input-elegant"
                >
                  {['Playfair Display', 'Cormorant Garamond', 'Great Vibes', 'Cinzel'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-elegant">Font Body</label>
                <select
                  value={form.font_body}
                  onChange={e => setForm(f => ({ ...f, font_body: e.target.value }))}
                  className="input-elegant"
                >
                  {['Cormorant Garamond', 'Lora', 'Outfit', 'Inter'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_premium"
                  checked={form.is_premium}
                  onChange={e => setForm(f => ({ ...f, is_premium: e.target.checked }))}
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <label htmlFor="is_premium" className="text-sm font-sans text-elegant cursor-pointer">
                  Tema Premium
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${form.accent_color}, ${form.secondary_color})` }}>
              <div className="text-center">
                <p className="text-xs mb-1" style={{ color: form.primary_color, opacity: 0.7 }}>The Wedding of</p>
                <p className="text-xl font-bold italic" style={{ color: form.primary_color, fontFamily: form.font_heading }}>
                  Nama & Nama
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowForm(false)} className="btn-ghost flex-1">Batal</button>
              <button onClick={handleCreate} className="btn-gold flex-1">Simpan Tema</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Themes Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-elegant p-4 space-y-3">
              <div className="skeleton h-24 rounded-xl" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : themes.length === 0 ? (
        <div className="card-elegant p-16 text-center">
          <Palette size={28} className="text-elegant/20 mx-auto mb-3" />
          <p className="text-elegant/40 text-sm font-sans">Belum ada tema. Buat yang pertama!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="card-elegant overflow-hidden group"
            >
              {/* Preview */}
              <div
                className="h-28 flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${theme.accent_color} 0%, ${theme.secondary_color} 100%)` }}
              >
                <div className="text-center px-4">
                  <p className="text-xs mb-1 opacity-60" style={{ color: theme.primary_color }}>The Wedding of</p>
                  <p className="text-xl font-bold italic" style={{ color: theme.primary_color, fontFamily: theme.font_heading }}>
                    {theme.name}
                  </p>
                </div>
                {!theme.is_active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-sans bg-black/50 px-2 py-1 rounded-full">Nonaktif</span>
                  </div>
                )}
                {theme.is_premium && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-sans font-medium bg-gold-gradient text-white shadow-gold">
                    Premium
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="font-sans font-semibold text-elegant text-sm mb-1">{theme.name}</p>
                <div className="flex items-center gap-1.5 mb-3">
                  {[theme.primary_color, theme.secondary_color, theme.accent_color].map((color, ci) => (
                    <div
                      key={ci}
                      className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0"
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                  <span className="text-elegant/30 text-xs font-sans ml-1">{theme.font_heading}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(theme)}
                    className={`btn-ghost text-xs flex-1 justify-center ${theme.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                  >
                    {theme.is_active ? <><EyeOff size={12} /> Nonaktifkan</> : <><Eye size={12} /> Aktifkan</>}
                  </button>
                  <button
                    onClick={() => handleDelete(theme.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-elegant/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
