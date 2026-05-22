import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateGuestSlug(name: string): string {
  return slugify(name)
}

export function generateInvitationLink(eventSlug: string, guestName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/u/${eventSlug}?kpd=${encodeURIComponent(guestName)}`
}

export function generateGuestPathLink(eventSlug: string, guestSlug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/u/${eventSlug}/${guestSlug}`
}

export function generateShareLink(eventSlug: string, guestName?: string | null): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/u/${eventSlug}`
  return guestName ? `${url}?kpd=${encodeURIComponent(guestName)}` : url
}

export function formatDate(date: string, locale = 'id-ID'): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'WIB' : 'WIB'
  return `${hours}:${minutes} ${ampm}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '')
  const normalized = cleaned.startsWith('0') ? '62' + cleaned.slice(1) : cleaned
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function generateWhatsAppMessage(
  guestName: string,
  coupleName: string,
  eventDate: string,
  invitationLink: string
): string {
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nYth. Bapak/Ibu/Saudara/i\n*${guestName}*\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami:\n\n💒 *${coupleName}*\n📅 ${eventDate}\n\nUntuk informasi lengkap dan konfirmasi kehadiran, silakan buka undangan digital kami:\n\n🔗 ${invitationLink}\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh`
}

export function timeUntilEvent(eventDate: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
} {
  const now = new Date().getTime()
  const target = new Date(eventDate).getTime()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
