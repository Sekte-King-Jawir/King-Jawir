'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@repo/ui'
import { authService } from '@/lib/api'
import type { User } from '@/types'
import { useRouter, usePathname } from 'next/navigation'

export function NavbarWrapper() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isHiddenRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/seller') ||
    pathname?.startsWith('/auth')

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        // Check auth status with API
        const response = await authService.me()
        if (response.success && response.data) {
          const apiUser = response.data.user
          setUser(apiUser)
        } else {
          // API says not logged in
          setUser(null)
        }
      } catch (error) {
        // API call failed, clear user
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Listen for auth-cleared event from ApiClient
    const handleAuthCleared = (): void => {
      setUser(null)
      router.push('/auth/login')
    }

    // Listen for auth-state-change event (login/logout from other components)
    const handleAuthChange = (): void => {
      void checkAuth()
    }

    window.addEventListener('auth-cleared', handleAuthCleared)
    window.addEventListener('auth-state-change', handleAuthChange)

    void checkAuth()

    return (): void => {
      window.removeEventListener('auth-cleared', handleAuthCleared)
      window.removeEventListener('auth-state-change', handleAuthChange)
    }
  }, [router])

  const handleLogout = (): void => {
    authService
      .logout()
      .catch(error => {
        console.error('Logout failed:', error)
      })
      .finally(() => {
        // Clear user state - cookies will be cleared by API
        setUser(null)
        router.push('/')
        router.refresh()
      })
  }

  if (isHiddenRoute) {
    return null
  }

  if (loading) {
    return <div className="h-16 lg:h-20" /> // Placeholder
  }

  return <Navbar user={user} onLogout={handleLogout} />
}
