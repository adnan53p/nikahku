'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Upload, Copy, Check, Trash2, MessageCircle, FileSpreadsheet, Plus, Share2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { getGuests, createGuests, deleteGuest } from '@/services/event.service'
import { getWhatsAppLink, generateWhatsAppMessage, formatDate, generateShareLink } from '@/lib/utils'
import type { Event, Guest, GuestImport } from '@/types'

export function GuestTab({ event, onUpdate }: { event: Event; onUpdate: () => void }) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const eventLink = generateShareLink(event.slug)
  const exampleGuestLink = generateShareLink(event.slug, 'Papik')

  const fetchGuests = async () => {
    setLoading(true)
    try {
      const data = await getGuests(event.id)
      setGuests(data as Guest[])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchGuests() }, [event.id])

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<{ nama?: string; Nama?: string; name?: string; Name?: string; telepon?: string; phone?: string }>(sheet)

      const guestImports: GuestImport[] = rows.map((row) => ({
        name: String(row.nama || row.Nama || row.name || row.Name || '').trim(),
        phone: String(row.telepon || row.phone || '').trim() || undefined,
      })).filter((g) => g.name.length > 0)

      if (!guestImports.length) { toast.error('File kosong atau format tidak sesuai'); return }

      await createGuests(event.id, event.slug, guestImports)
      toast.success(`${guestImports.length} tamu berhasil diimport!`)
      fetchGuests()
    } catch { toast.error('Gagal membaca file Excel') }
    finally { setImporting(false); e.target.value = '' }
  }

  const handleTextImport = async () => {
    const names = textInput.split('\n').map(n => n.trim()).filter(Boolean)
    if (!names.length) { toast.error('Daftar nama kosong'); return }
    setImporting(true)
    try {
      const guestImports: GuestImport[] = names.map(name => ({ name }))
      await createGuests(event.id, event.slug, guestImports)
      toast.success(`${names.length} tamu ditambahkan!`)
      setTextInput('')
      setShowImport(false)
      fetchGuests()
    } catch { toast.error('Gagal menambahkan tamu') }
    finally { setImporting(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteGuest(id)
      setGuests(prev => prev.filter(g => g.id !== id))
      toast.success('Tamu dihapus')
    } catch { toast.error('Gagal menghapus') }
  }

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Link disalin!')
  }

  const buildGuestMessage = (guest: Guest) => generateWhatsAppMessage(
    guest.name,
    `${event.bride_name} & ${event.groom_name}`,
    formatDate(event.event_date),
    guest.invitation_link || generateShareLink(event.slug, guest.name)
  )

  const handleWhatsApp = (guest: Guest) => {
    const msg = buildGuestMessage(guest)
    if (guest.phone) {
      window.open(getWhatsAppLink(guest.phone, msg), '_blank')
      return
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleNativeShare = async (guest: Guest) => {
    const link = guest.invitation_link || generateShareLink(event.slug, guest.name)
    const text = buildGuestMessage(guest)
    if (navigator.share) {
      await navigator.share({ title: `Undangan ${event.groom_name} & ${event.bride_name}`, text, url: link })
      return
    }
    await navigator.clipboard.writeText(text)
    toast.success('Pesan share disalin')
  }

  const copyExampleLink = async () => {
    await navigator.clipboard.writeText(exampleGuestLink)
    toast.success('Contoh guest link disalin')
  }

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([['nama', 'telepon'], ['Budi Santoso', '081234567890'], ['Sari Dewi', '087654321000']])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tamu')
    XLSX.writeFile(wb, 'template-tamu-invitely.xlsx')
  }

  return (
    <div className="space-y-4">
      {/* Import section */}
      <div className="card-elegant p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-sans font-semibold text-elegant text-sm">Daftar Tamu</h3>
            <p className="text-elegant/40 text-xs font-sans">{guests.length} tamu terdaftar</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadTemplate} className="btn-ghost text-xs">
              <FileSpreadsheet size={13} /> Template
            </button>
            <label className="btn-outline-gold text-xs cursor-pointer">
              <Upload size={13} /> Import Excel
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} className="hidden" />
            </label>
            <button onClick={() => setShowImport(!showImport)} className="btn-gold text-xs">
              <Plus size={13} /> Tambah Manual
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-2xl bg-champagne/35 border border-champagne-dark p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-elegant font-sans mb-1">Guest link otomatis</p>
              <p className="text-xs text-elegant/45 font-sans break-all">{exampleGuestLink}</p>
              <p className="text-[11px] text-elegant/35 font-sans mt-1">Format: link undangan + <b>?to=Nama Tamu</b>. Nama akan muncul di cover pembuka.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => navigator.clipboard.writeText(eventLink).then(() => toast.success('Link utama disalin'))} className="btn-ghost text-xs">
                <Copy size={13} /> Link Utama
              </button>
              <button onClick={copyExampleLink} className="btn-outline-gold text-xs">
                <ExternalLink size={13} /> Contoh ?to=Papik
              </button>
            </div>
          </div>
        </div>

        {/* Manual input */}
        <AnimatePresence>
          {showImport && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-champagne/30 rounded-xl"
            >
              <p className="text-xs text-elegant/50 font-sans mb-2">Satu nama per baris:</p>
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                className="input-elegant resize-none font-sans text-sm"
                rows={5}
                placeholder={"Budi Santoso\nSari Dewi\nAhmad Fauzi"}
              />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setShowImport(false)} className="btn-ghost text-xs flex-1">Batal</button>
                <button onClick={handleTextImport} disabled={importing} className="btn-gold text-xs flex-1">
                  {importing ? 'Memproses...' : 'Tambahkan'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <div className="skeleton w-9 h-9 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-4 w-28 rounded" />
                  <div className="skeleton h-3 w-48 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-10">
            <Users size={28} className="text-elegant/20 mx-auto mb-2" />
            <p className="text-elegant/40 text-sm font-sans">Belum ada tamu</p>
            <p className="text-elegant/30 text-xs font-sans mt-1">Import dari Excel atau tambah manual</p>
          </div>
        ) : (
          <div className="divide-y divide-champagne/50">
            {guests.map((guest, i) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 py-3"
              >
                <div className="w-9 h-9 rounded-xl bg-champagne flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gold-600 font-sans">
                    {guest.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-elegant font-sans truncate">{guest.name}</p>
                  <p className="text-xs text-elegant/30 font-sans truncate">{guest.invitation_link}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {guest.has_opened && (
                    <span className="text-xs text-emerald-600 font-sans bg-emerald-50 px-2 py-0.5 rounded-full">
                      Dibuka
                    </span>
                  )}
                  <button
                    onClick={() => handleCopyLink(guest.invitation_link, guest.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-champagne transition-colors text-elegant/40 hover:text-elegant"
                    title="Copy link"
                  >
                    {copiedId === guest.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => handleWhatsApp(guest)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-50 text-elegant/40 hover:text-green-600 transition-colors"
                    title={guest.phone ? 'Kirim WhatsApp ke nomor tamu' : 'Share WhatsApp tanpa nomor'}
                  >
                    <MessageCircle size={12} />
                  </button>
                  <button
                    onClick={() => handleNativeShare(guest)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blue-50 text-elegant/40 hover:text-blue-600 transition-colors"
                    title="Share / salin pesan"
                  >
                    <Share2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(guest.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-elegant/20 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
