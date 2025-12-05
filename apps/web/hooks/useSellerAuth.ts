'use client'

import { useState, useEffect, useCallback } from 'react'
import { API_ENDPOINTS } from '@/lib/config/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'

export interface SellerUser {
  id: string
  email: string
  name: string
  role: 'SELLER' | 'ADMIN'
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface SellerRegisterData {
  email: string
  password: string
  name: string
  storeName: string
  storeDescription?: string
}

export interface SellerLoginData {
  email: string
  password: string
}

interface AuthApiResponse {
  success: boolean
  message?: string
  data?: {
    user: SellerUser
    accessToken: string
    refreshToken: string
    store?: {
      id: string
      name: string
      slug: string
      description: string | null
    }
  }
  error?: {
    code: string
    message: string
  }
}

interface MeApiResponse {
  success: boolean
  data?: SellerUser
  error?: {
    code: string
    message: string
  }
}

export interface UseSellerAuthReturn {
  user: SellerUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isSeller: boolean
  error: string
  success: string
  login: (data: SellerLoginData) => Promise<boolean>
  register: (data: SellerRegisterData) => Promise<boolean>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  clearMessages: () => void
}

export function useSellerAuth(): UseSellerAuthReturn {
  const [user, setUser] = useState<SellerUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch current user on mount
  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER_AUTH.ME}`, {
        credentials: 'include',
      })

      const data = (await res.json()) as MeApiResponse

      if (data.success && data.data !== undefined) {
        setUser(data.data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUser()
  }, [fetchUser])

  const login = useCallback(async (loginData: SellerLoginData): Promise<boolean> => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER_AUTH.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      })

      const data = (await res.json()) as AuthApiResponse

      if (data.success && data.data !== undefined) {
        setUser(data.data.user)
        setSuccess(data.message ?? 'Login berhasil!')
        return true
      } else {
        setError(data.error?.message ?? data.message ?? 'Login gagal')
        return false
      }
    } catch (err) {
      setError('Gagal connect ke server')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (registerData: SellerRegisterData): Promise<boolean> => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER_AUTH.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(registerData),
      })

      const data = (await res.json()) as AuthApiResponse

      if (data.success && data.data !== undefined) {
        setUser(data.data.user)
        setSuccess(data.message ?? 'Register berhasil!')
        return true
      } else {
        setError(data.error?.message ?? data.message ?? 'Register gagal')
        return false
      }
    } catch {
      setError('Gagal connect ke server')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    setError('')
    setSuccess('')

    try {
      await fetch(`${API_URL}${API_ENDPOINTS.SELLER_AUTH.LOGOUT}`, {
        method: 'POST',
        credentials: 'include',
      })

      setUser(null)
      setSuccess('Logout berhasil')
    } catch {
      setError('Gagal logout')
    }
  }, [])

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isSeller: user !== null && (user.role === 'SELLER' || user.role === 'ADMIN'),
    error,
    success,
    login,
    register,
    logout,
    refresh: fetchUser,
    clearMessages,
  }
}
