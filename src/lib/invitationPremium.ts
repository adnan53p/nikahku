import type { Event } from '@/types'

export type PremiumInvitationSettings = {
  openingGreeting?: string
  openingText?: string
  invitationText?: string
  quranText?: string
  closingText?: string
  closingGreeting?: string
  buttonOpenText?: string
  coupleLabel?: string
  loveStoryTitle?: string
  galleryTitle?: string
  rsvpTitle?: string
  giftTitle?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  buttonTextColor?: string
  backgroundColor?: string
  coverOverlayColor?: string
  coverOverlayOpacity?: number
  headingFont?: string
  bodyFont?: string
  fontScale?: number
  particleMode?: 'none' | 'sparkle' | 'flower' | 'goldDust' | 'heart' | 'snow'
  cinematicMode?: boolean
  voiceNarration?: boolean
  voiceText?: string
}

export const defaultPremiumSettings: PremiumInvitationSettings = {
  openingGreeting: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
  openingText:
    'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.',
  invitationText:
    'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.',
  quranText:
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram kepadanya.',
  closingText:
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
  closingGreeting: 'Wassalamu’alaikum Warahmatullahi Wabarakatuh',
  buttonOpenText: 'Buka Undangan',
  coupleLabel: 'Mempelai',
  loveStoryTitle: 'Kisah Cinta Kami',
  galleryTitle: 'Galeri Bahagia',
  rsvpTitle: 'Konfirmasi Kehadiran',
  giftTitle: 'Kirim Kado',
  primaryColor: '#8c6a43',
  secondaryColor: '#f8f5f1',
  accentColor: '#d4a017',
  buttonTextColor: '#fff8e7',
  backgroundColor: '#fffaf0',
  coverOverlayColor: '#000000',
  coverOverlayOpacity: 55,
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  fontScale: 1,
  particleMode: 'sparkle',
  cinematicMode: true,
  voiceNarration: false,
}

function safeJsonParse(value: unknown) {
  if (!value || typeof value !== 'string') return {}
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

export function getPremiumSettings(event: Event): PremiumInvitationSettings {
  const fromJson = safeJsonParse((event as any).premium_settings_json)
  return {
    ...defaultPremiumSettings,
    ...fromJson,
    primaryColor: (event as any).custom_primary_color || (fromJson as any).primaryColor || defaultPremiumSettings.primaryColor,
    secondaryColor: (event as any).custom_secondary_color || (fromJson as any).secondaryColor || defaultPremiumSettings.secondaryColor,
    accentColor: (event as any).custom_accent_color || (fromJson as any).accentColor || defaultPremiumSettings.accentColor,
    headingFont: (event as any).custom_heading_font || (fromJson as any).headingFont || defaultPremiumSettings.headingFont,
    bodyFont: (event as any).custom_body_font || (fromJson as any).bodyFont || defaultPremiumSettings.bodyFont,
    particleMode: (event as any).particle_mode || (fromJson as any).particleMode || defaultPremiumSettings.particleMode,
  }
}

export function premiumStyleVars(settings: PremiumInvitationSettings) {
  return {
    '--inv-primary': settings.primaryColor,
    '--inv-secondary': settings.secondaryColor,
    '--inv-accent': settings.accentColor,
    '--inv-button-text': settings.buttonTextColor,
    '--inv-bg': settings.backgroundColor,
    '--inv-heading-font': settings.headingFont,
    '--inv-body-font': settings.bodyFont,
    '--inv-font-scale': String(settings.fontScale || 1),
  } as React.CSSProperties
}

export function generateInvitationText(input: {
  brideName: string
  groomName: string
  style?: 'islami' | 'elegan' | 'romantis' | 'singkat'
}) {
  const style = input.style || 'islami'
  const names = `${input.brideName} & ${input.groomName}`

  if (style === 'romantis') {
    return {
      openingText: `Sebuah kisah indah mempertemukan dua hati dalam waktu yang tepat. Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk menjadi bagian dari hari bahagia ${names}.`,
      closingText: `Doa dan kehadiran Bapak/Ibu/Saudara/i akan menjadi hadiah terindah bagi perjalanan baru kami.`,
      voiceText: `Selamat datang di undangan pernikahan ${names}. Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir dan memberikan doa restu.`,
    }
  }

  if (style === 'elegan') {
    return {
      openingText: `Dengan penuh rasa syukur dan hormat, kami bermaksud menyelenggarakan acara pernikahan ${names}.`,
      closingText: `Atas perhatian, kehadiran, dan doa restu Bapak/Ibu/Saudara/i, kami mengucapkan terima kasih.`,
      voiceText: `Selamat datang. Anda diundang dalam acara pernikahan ${names}. Semoga kehadiran dan doa restu Anda menjadi keberkahan bagi kedua mempelai.`,
    }
  }

  if (style === 'singkat') {
    return {
      openingText: `Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan ${names}.`,
      closingText: `Terima kasih atas doa restu dan kehadiran Bapak/Ibu/Saudara/i.`,
      voiceText: `Selamat datang di undangan pernikahan ${names}.`,
    }
  }

  return {
    openingText: `Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan ${names}.`,
    closingText: `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`,
    voiceText: `Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di undangan pernikahan ${names}. Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk hadir dan memberikan doa restu.`,
  }
}
