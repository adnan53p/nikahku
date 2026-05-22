import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Invitely — Platform Undangan Digital Premium',
    template: '%s | Invitely',
  },
  description:
    'Buat undangan pernikahan digital premium yang elegan, modern, dan berkesan. Tanpa aplikasi, tanpa download. Dibuka langsung dari WhatsApp.',
  keywords: ['undangan digital', 'undangan pernikahan', 'wedding invitation', 'digital invitation'],
  authors: [{ name: 'Invitely' }],
  creator: 'Invitely',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Invitely — Platform Undangan Digital Premium',
    description: 'Buat undangan pernikahan digital premium yang elegan dan berkesan.',
    siteName: 'Invitely',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Invitely - Undangan Digital Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invitely — Platform Undangan Digital Premium',
    description: 'Buat undangan pernikahan digital premium yang elegan dan berkesan.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className="font-vars"
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1A1A2E',
              border: '1px solid #E8C99A',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(26, 26, 46, 0.12)',
              fontFamily: 'var(--font-outfit)',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#D4A017', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
            },
          }}
        />
      </body>
    </html>
  )
}
