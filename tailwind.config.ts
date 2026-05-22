import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdfaf0',
          100: '#faf3d6',
          200: '#f4e4a8',
          300: '#ecd072',
          400: '#e2b93d',
          500: '#d4a017',
          600: '#b8840f',
          700: '#946510',
          800: '#784f13',
          900: '#634113',
          950: '#382107',
        },
        champagne: {
          DEFAULT: '#F7E7CE',
          light: '#FDF6ED',
          dark: '#E8C99A',
        },
        ivory: {
          DEFAULT: '#FAFAF8',
          dark: '#F5F5F0',
        },
        elegant: {
          DEFAULT: '#1A1A2E',
          light: '#2D2D44',
          muted: '#6B6B80',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A017 0%, #E8C99A 50%, #D4A017 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 160, 23, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212, 160, 23, 0)' },
        },
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(212, 160, 23, 0.25)',
        'gold-lg': '0 8px 40px rgba(212, 160, 23, 0.35)',
        'elegant': '0 4px 24px rgba(26, 26, 46, 0.12)',
        'elegant-lg': '0 16px 64px rgba(26, 26, 46, 0.16)',
        'glass': '0 8px 32px rgba(26, 26, 46, 0.08)',
        'card': '0 2px 16px rgba(26, 26, 46, 0.08), 0 1px 4px rgba(26, 26, 46, 0.06)',
        'card-hover': '0 8px 32px rgba(26, 26, 46, 0.12), 0 2px 8px rgba(26, 26, 46, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}

export default config
