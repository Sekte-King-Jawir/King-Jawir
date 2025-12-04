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
    const checkAuth = async () => {
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

    void checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if API fails, clear local state
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/')
    }
  }

  if (loading) {
    return <div className="h-16 lg:h-20" /> // Placeholder
  }

  return <Navbar user={user} onLogout={handleLogout} />
}
