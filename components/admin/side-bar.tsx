'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Palette, Calendar, User, LogOut, ListIcon, Book, ExternalLink, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/service/authService'
import { ConfirmLogout } from './confirm-logout'

const navItems = [
  { title: 'Booking', href: '/booking', icon: Calendar },
  { title: 'Workshops', href: '/workshops', icon: Palette },
  { title: 'Pause Art', href: '/pause-art', icon: Palette },
  { title: 'Categories', href: '/categories', icon: ListIcon },
  { title: 'Blog', href: '/blog', icon: Book, newTab: true },
  { title: 'Profile', href: '/profile', icon: User },
]

export function SideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // State for mobile toggle

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      {/* --- MOBILE TRIGGER --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-sidebar border border-sidebar-border rounded-md md:hidden"
      >
        <Menu className="h-6 w-6 text-sidebar-foreground" />
      </button>

      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR ASIDE --- */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col transition-transform duration-300 ease-in-out",
        // Desktop: always visible. Mobile: translate off-screen unless isOpen
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="font-serif text-xl tracking-wide">La Ruche Studio</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <X className="h-6 w-6 text-sidebar-foreground" />
          </button>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close sidebar on click (mobile)
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
                {item.newTab && <ExternalLink className="ml-auto h-3 w-3 opacity-50" />}
              </Link>
            )
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmLogout
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </>
  )
}