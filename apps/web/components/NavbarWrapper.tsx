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
        // First, check if user data exists in localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as User
            setUser(parsedUser)
            setLoading(false) // Show navbar immediately with cached user
          } catch (e) {
            console.error('Failed to parse stored user:', e)
          }
        }

        // Then verify with API
        const response = await authService.me()
        if (response.success && response.data) {
          const apiUser = response.data.user
          setUser(apiUser)
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(apiUser))
        } else {
          // API says not logged in, clear cached user
          setUser(null)
          localStorage.removeItem('user')
        }
      } catch (error) {
        // API call failed, clear user
        console.error('Auth check failed:', error)
        setUser(null)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    // Listen for auth-cleared event from ApiClient
    const handleAuthCleared = (): void => {
      setUser(null)
      router.push('/auth/login')
    }

    window.addEventListener('auth-cleared', handleAuthCleared)

    void checkAuth()

    return (): void => {
      window.removeEventListener('auth-cleared', handleAuthCleared)
    }
  }, [router])

  const handleLogout = (): void => {
    authService
      .logout()
      .catch((error) => {
        console.error('Logout failed:', error)
      })
      .finally(() => {
        // Clear user state and localStorage regardless of API call result
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
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
