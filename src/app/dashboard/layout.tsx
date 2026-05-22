'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Users, Palette, Settings,
  LogOut, Menu, X, ChevronRight, Bell
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/services/auth.service'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/events', icon: Calendar, label: 'Undangan' },
  { href: '/dashboard/guests', icon: Users, label: 'Tamu' },
  { href: '/dashboard/themes', icon: Palette, label: 'Tema' },
  { href: '/dashboard/settings', icon: Settings, label: 'Pengaturan' },
]

function Sidebar({ isMobile, onClose }: { isMobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Sampai jumpa!')
    router.push('/')
  }

  return (
    <div className={cn(
      'flex flex-col h-full',
      isMobile ? 'bg-white' : 'bg-white border-r border-champagne/50'
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-champagne/50">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-white font-display text-sm font-bold">I</span>
            </div>
            <span className="font-display text-xl font-semibold text-elegant">Invitely</span>
          </Link>
          {isMobile && (
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-champagne transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'sidebar-item',
                isActive && 'active'
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-champagne/50">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-champagne/50 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
            <span className="text-white text-sm font-bold font-sans">
              {user ? getInitials(user.full_name) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-elegant truncate font-sans">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-elegant/40 truncate font-sans">
              Paket {user?.plan || 'Free'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-elegant/30 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Keluar"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-ivory overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0">
        <div className="w-full">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-elegant/30 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 md:hidden shadow-elegant-lg"
            >
              <Sidebar isMobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-champagne/50 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-champagne transition-colors"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 md:flex-none" />

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-champagne transition-colors relative">
              <Bell size={16} className="text-elegant/60" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
