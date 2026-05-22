'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, Palette, LogOut, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/services/auth.service'
import toast from 'react-hot-toast'

const adminNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/themes', icon: Palette, label: 'Themes' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Logged out')
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-ivory overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 bg-white border-r border-champagne/50 flex flex-col">
        <div className="p-5 border-b border-champagne/50">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-white font-display text-xs font-bold">I</span>
            </div>
            <div>
              <span className="font-display text-base font-semibold text-elegant block leading-none">Invitely</span>
              <span className="text-elegant/30 text-xs font-sans">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-item text-sm',
                  isActive && 'active'
                )}
              >
                <item.icon size={16} />
                {item.label}
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-champagne/50">
          <button
            onClick={handleSignOut}
            className="sidebar-item w-full text-sm text-red-400 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
