'use client'

import { Gift, MessageCircle, Share2, Sparkles } from 'lucide-react'
import { BatikCloudPattern, CopyButton, SectionTitle } from './shared'

export default function Footer({ event, guestName }: { event: any; guestName: string }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappText = `Assalamu’alaikum, dengan penuh rasa syukur kami mengundang ${guestName} untuk hadir di acara pernikahan ${event.bride_name} & ${event.groom_name}.\n\n${shareUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`
  const giftAccounts = event.gift_accounts || []

  return (
    <>
      <section className="relative bg-[#20364d] px-6 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.16),transparent_34%)]" />
        <div className="relative mx-auto max-w-xl">
          <SectionTitle eyebrow="Hadiah Digital" title="E-Gift" dark />
          <div className="space-y-4">
            {giftAccounts.map((account: any, index: number) => (
              <div key={account.id || index} className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <div className="mb-4 flex items-center gap-3 text-blue-100"><Gift size={18} /><span className="text-xs uppercase tracking-[0.24em]">{account.bank_name}</span></div>
                <p className="mb-1 font-serif text-2xl text-white">{account.account_number}</p>
                <p className="mb-4 text-sm text-blue-100/65">a/n {account.account_name}</p>
                <CopyButton text={account.account_number || ''} />
              </div>
            ))}
            {event.qris_image_url && (
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 text-center backdrop-blur-md">
                <img src={event.qris_image_url} alt="QRIS" className="mx-auto max-w-[220px] rounded-2xl bg-white p-3" />
                <p className="mt-3 text-xs text-blue-100/65">Scan QRIS untuk mengirim hadiah digital.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="blue-paper px-6 py-20 text-center soft-grain">
        <div className="mx-auto max-w-xl">
          <SectionTitle eyebrow="Bagikan" title="Kirim Undangan" />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#20364d] px-6 py-4 text-xs uppercase tracking-[0.22em] text-white">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#9ab7d1]/70 bg-white/55 px-6 py-4 text-xs uppercase tracking-[0.22em] text-[#345b7c]">
              <Share2 size={16} /> Salin Link
            </button>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-[#20364d] px-6 py-24 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.16),transparent_34%)]" />
        <BatikCloudPattern className="absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 text-white/10" />
        <div className="relative mx-auto max-w-xl">
          <Sparkles className="mx-auto mb-7 text-blue-100/70" size={30} />
          <p className="mb-6 text-sm leading-7 text-blue-100/70">
            Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
          <h2 className="font-serif text-5xl italic text-white">{event.bride_name} & {event.groom_name}</h2>
          <p className="mt-8 text-[10px] uppercase tracking-[0.28em] text-blue-100/45">Powered by Invitely</p>
        </div>
      </footer>
    </>
  )
}
