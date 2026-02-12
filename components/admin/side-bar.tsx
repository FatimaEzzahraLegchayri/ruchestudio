'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Palette, Calendar, User, LogOut, ListIcon, Book, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/service/authService'
import { ConfirmLogout } from './confirm-logout'

const navItems = [
  {
    title: 'Booking',
    href: '/booking',
    icon: Calendar,
  },
  {
    title: 'Workshops',
    href: '/workshops',
    icon: Palette,
  },
  {
    title: 'Pause Art',
    href: '/pause-art',
    icon: Palette,
  },
  {
    title: 'Categories',
    href: '/categories',
    icon: ListIcon,
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: Book,
    newTab: true,
  },

  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
]

export function SideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

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
      <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-6 flex flex-col">
        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
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
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              'text-destructive hover:bg-destructive/10 hover:text-destructive'
            )}
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
