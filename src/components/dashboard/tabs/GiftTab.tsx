'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Gift, CreditCard, Upload, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'
import { addGiftAccount, deleteGiftAccount, uploadQrisImage } from '@/services/event.service'
import type { Event } from '@/types'

export function GiftTab({ event, onUpdate }: { event: Event; onUpdate: () => void }) {
  const [adding, setAdding] = useState(false)
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadingQris, setUploadingQris] = useState(false)

  const gifts = event.gift_accounts || []

  const handleAdd = async () => {
    if (!bankName || !accountNumber || !accountName) {
      toast.error('Lengkapi semua field rekening')
      return
    }
    setLoading(true)
    try {
      await addGiftAccount(event.id, {
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
      })
      toast.success('Rekening ditambahkan!')
      setBankName('')
      setAccountNumber('')
      setAccountName('')
      setAdding(false)
      onUpdate()
    } catch {
      toast.error('Gagal menambahkan rekening')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus rekening ini?')) return
    try {
      await deleteGiftAccount(id)
      toast.success('Rekening dihapus')
      onUpdate()
    } catch {
      toast.error('Gagal menghapus rekening')
    }
  }

  const handleQrisUpload = async (file?: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran QRIS maks 5MB')
      return
    }
    setUploadingQris(true)
    try {
      await uploadQrisImage(event.id, file)
      toast.success('QRIS berhasil diupload!')
      onUpdate()
    } catch {
      toast.error('Gagal upload QRIS. Pastikan bucket events sudah ada dan SQL migration sudah dijalankan.')
    } finally {
      setUploadingQris(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="card-elegant p-5 border-2 border-gold-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-sans font-semibold text-elegant text-sm flex items-center gap-2">
              <CreditCard size={16} className="text-gold-600" /> Rekening Amplop Digital
            </h3>
            <p className="text-elegant/40 text-xs font-sans mt-1">
              Rekening ini akan tampil di bagian Wedding Gift undangan.
            </p>
          </div>
          <button onClick={() => setAdding(true)} className="btn-gold text-xs">
            <Plus size={13} /> Tambah Rekening
          </button>
        </div>

        {gifts.length === 0 && !adding ? (
          <div className="text-center py-10 bg-champagne/20 rounded-2xl">
            <Gift size={30} className="text-elegant/20 mx-auto mb-2" />
            <p className="text-elegant/45 text-sm font-sans">Belum ada rekening</p>
            <p className="text-elegant/30 text-xs font-sans mt-1">Klik Tambah Rekening untuk mulai.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {gifts.map((gift) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-champagne/30 rounded-xl border border-champagne/70"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
                    <CreditCard size={16} className="text-gold-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-elegant font-sans">{gift.bank_name}</p>
                    <p className="text-xs text-elegant/60 font-sans truncate">{gift.account_number} · {gift.account_name}</p>
                  </div>
                  <button onClick={() => handleDelete(gift.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-elegant/30 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {adding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border border-champagne-dark rounded-xl space-y-3 bg-white"
            >
              <p className="text-xs font-semibold text-elegant/50 font-sans uppercase tracking-wider">Tambah Rekening</p>
              <div>
                <label className="label-elegant">Nama Bank *</label>
                <input value={bankName} onChange={e => setBankName(e.target.value)} className="input-elegant" placeholder="BCA, Mandiri, BRI..." />
              </div>
              <div>
                <label className="label-elegant">Nomor Rekening *</label>
                <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="input-elegant" placeholder="1234567890" />
              </div>
              <div>
                <label className="label-elegant">Nama Pemilik *</label>
                <input value={accountName} onChange={e => setAccountName(e.target.value)} className="input-elegant" placeholder="Atas nama..." />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAdding(false)} className="btn-ghost flex-1">Batal</button>
                <button onClick={handleAdd} disabled={loading} className="btn-gold flex-1 disabled:opacity-60">
                  {loading ? 'Menyimpan...' : 'Simpan Rekening'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="card-elegant p-5 border-2 border-gold-100/70">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-36 h-36 rounded-2xl bg-champagne/50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-champagne-dark">
            {event.qris_image_url ? (
              <img src={event.qris_image_url} alt="QRIS" className="w-full h-full object-contain bg-white p-2" />
            ) : (
              <QrCode size={42} className="text-elegant/20" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-sans font-semibold text-elegant text-sm mb-2 flex items-center gap-2">
              <QrCode size={16} className="text-gold-600" /> QRIS / Kado Digital
            </h3>
            <p className="text-elegant/45 text-sm font-sans mb-4">
              Upload gambar QRIS agar tamu bisa memberi hadiah digital langsung dari halaman undangan.
            </p>
            <label className="btn-outline-gold text-xs cursor-pointer inline-flex">
              <Upload size={13} /> {uploadingQris ? 'Mengunggah...' : event.qris_image_url ? 'Ganti QRIS' : 'Upload QRIS'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleQrisUpload(e.target.files?.[0])} />
            </label>
            <p className="text-elegant/30 text-xs font-sans mt-3">Format JPG/PNG/WEBP, maksimal 5MB.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
