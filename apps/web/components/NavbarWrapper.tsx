'use client'

import { Navbar } from '@repo/ui'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

export function NavbarWrapper() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()

  const isHiddenRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/seller') ||
    pathname?.startsWith('/auth')

  if (isHiddenRoute) {
    return null
  }

  if (loading) {
    return <div className="h-16 lg:h-20" /> // Placeholder
  }

  return <Navbar user={user} onLogout={logout} />
}
