'use client'

import type { Event } from '@/types'

export function ThemeStyleInjector({ event }: { event: Event }) {
  const e = event as any
  const primary = e.custom_primary_color || event.themes?.primary_color || event.theme?.primary_color || '#8c6a43'
  const secondary = e.custom_secondary_color || event.themes?.secondary_color || event.theme?.secondary_color || '#f8f5f1'
  const accent = e.custom_accent_color || event.themes?.accent_color || event.theme?.accent_color || '#d4a017'
  const heading = e.custom_heading_font || event.themes?.font_heading || event.theme?.font_heading || 'Playfair Display'
  const body = e.custom_body_font || event.themes?.font_body || event.theme?.font_body || 'Inter'

  return (
    <style jsx global>{`
      :root {
        --invite-primary: ${primary};
        --invite-secondary: ${secondary};
        --invite-accent: ${accent};
        --invite-heading-font: '${heading}', serif;
        --invite-body-font: '${body}', sans-serif;
      }

      .dynamic-theme h1,
      .dynamic-theme h2,
      .dynamic-theme h3,
      .dynamic-theme .font-display {
        font-family: var(--invite-heading-font);
      }

      .dynamic-theme,
      .dynamic-theme p,
      .dynamic-theme span,
      .dynamic-theme button,
      .dynamic-theme input,
      .dynamic-theme textarea {
        font-family: var(--invite-body-font);
      }

      .dynamic-theme .dynamic-primary {
        color: var(--invite-primary);
      }

      .dynamic-theme .dynamic-bg {
        background: var(--invite-secondary);
      }

      .dynamic-theme .dynamic-accent {
        color: var(--invite-accent);
      }

      .dynamic-theme .dynamic-button {
        background: var(--invite-primary);
        color: white;
      }
    `}</style>
  )
}
