'use server'

import { cookies } from 'next/headers'
import { API_URL } from '../_shared/api'
import type { ActionResult } from '../_shared/types'

interface LoginData {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
  }
}

interface LoginApiResponse {
  success: boolean
  message: string
  data?: LoginData
}

function parseApiResponse(value: unknown): LoginApiResponse | null {
  if (typeof value !== 'object' || value === null) return null
  const obj = value as Record<string, unknown>
  if (typeof obj.success !== 'boolean' || typeof obj.message !== 'string') return null
  
  const parsedData = parseLoginData(obj.data)
  
  if (parsedData === undefined) {
    return {
      success: obj.success,
      message: obj.message,
    }
  }
  
  return {
    success: obj.success,
    message: obj.message,
    data: parsedData,
  }
}

function parseLoginData(value: unknown): LoginData | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const obj = value as Record<string, unknown>
  
  if (
    typeof obj.accessToken !== 'string' ||
    typeof obj.refreshToken !== 'string' ||
    typeof obj.user !== 'object' ||
    obj.user === null
  ) {
    return undefined
  }
  
  const userObj = obj.user as Record<string, unknown>
  if (
    typeof userObj.id !== 'string' ||
    typeof userObj.email !== 'string' ||
    typeof userObj.name !== 'string'
  ) {
    return undefined
  }
  
  return {
    accessToken: obj.accessToken,
    refreshToken: obj.refreshToken,
    user: {
      id: userObj.id,
      email: userObj.email,
      name: userObj.name,
    },
  }
}

export async function loginAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (email === '' || password === '') {
    return { success: false, message: 'Email dan password harus diisi' }
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const json: unknown = await response.json()
    const data = parseApiResponse(json)
    
    if (data === null) {
      return { success: false, message: 'Response tidak valid dari server' }
    }

    if (data.success === false) {
      // Cek apakah message mengandung kata "verifikasi" untuk redirect
      const msgLower = data.message.toLowerCase()
      if (msgLower.includes('verifikasi') || msgLower.includes('verified')) {
        return { 
          success: false, 
          message: data.message !== '' ? data.message : 'Email belum diverifikasi',
          redirectTo: '/resend-verification'
        }
      }
      
      return { success: false, message: data.message !== '' ? data.message : 'Login gagal' }
    }

    // Set cookies untuk token
    if (data.data !== undefined) {
      const loginData = data.data
      const cookieStore = await cookies()
      cookieStore.set('accessToken', loginData.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      })
      cookieStore.set('refreshToken', loginData.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      cookieStore.set('user', JSON.stringify(loginData.user), {
        httpOnly: false,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      })
    }

    return { success: true, message: 'Login berhasil!', redirectTo: '/' }
  } catch (err) {
    console.error('Login error:', err)
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}
