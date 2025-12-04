import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authService, type LoginRequest, type RegisterRequest, isApiError } from '@/lib/api'
import type { User } from '@/types'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials)

      if (response.success && response.data) {
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      }

      setError(response.message)
      return { success: false, error: response.message }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.register(data)

      if (response.success && response.data) {
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      }

      setError(response.message)
      return { success: false, error: response.message }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Registration failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await authService.logout()
      setUser(null)
      router.push('/')
      return { success: true }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Logout failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [router])

  const checkAuth = useCallback(async () => {
    setLoading(true)

    try {
      const response = await authService.me()

      if (response.success && response.data) {
        setUser(response.data.user)
        return response.data.user
      }

      setUser(null)
      return null
    } catch (err) {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  }
}
