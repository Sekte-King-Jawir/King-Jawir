'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@repo/ui'
import { authService } from '@/lib/api'
import type { User } from '@/types'
import { useRouter } from 'next/navigation'

export function NavbarWrapper() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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

    window.addEventListener('auth-cleared', handleAuthCleared)

    void checkAuth()

    return (): void => {
      window.removeEventListener('auth-cleared', handleAuthCleared)
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

  if (loading) {
    return <div className="h-16 lg:h-20" /> // Placeholder
  }

  return <Navbar user={user} onLogout={handleLogout} />
}
