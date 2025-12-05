'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService, type LoginRequest, type RegisterRequest, isApiError } from '@/lib/api'
import type { User } from '@/types'

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; user: User | null; error?: string }>
  register: (
    data: RegisterRequest
  ) => Promise<{ success: boolean; user: User | null; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  checkAuth: () => Promise<User | null>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = useCallback(async () => {
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
      return { success: false, user: null, error: response.message }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Login failed'
      setError(message)
      return { success: false, user: null, error: message }
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
      return { success: false, user: null, error: response.message }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Registration failed'
      setError(message)
      return { success: false, user: null, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await authService.logout()
      return { success: true }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Logout failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setUser(null)
      router.push('/')
      router.refresh()
      setLoading(false)
    }
  }, [router])

  // Initial auth check
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Listen for auth-cleared event from ApiClient
  useEffect(() => {
    const handleAuthCleared = (): void => {
      setUser(null)
      router.push('/auth/login')
    }

    window.addEventListener('auth-cleared', handleAuthCleared)
    return () => window.removeEventListener('auth-cleared', handleAuthCleared)
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
