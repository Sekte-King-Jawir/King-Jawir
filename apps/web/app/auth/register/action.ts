'use server'

import { API_URL } from '../_shared/api'
import type { ActionResult } from '../_shared/types'

interface ApiResponse {
  success: boolean
  message: string
}

function parseApiResponse(value: unknown): ApiResponse | null {
  if (typeof value !== 'object' || value === null) return null
  const obj = value as Record<string, unknown>
  if (typeof obj.success !== 'boolean' || typeof obj.message !== 'string') return null
  return { success: obj.success, message: obj.message }
}

export async function registerAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (name === '' || email === '' || password === '' || confirmPassword === '') {
    return { success: false, message: 'Semua field harus diisi' }
  }

  if (password !== confirmPassword) {
    return { success: false, message: 'Password dan konfirmasi password tidak cocok' }
  }

  if (password.length < 6) {
    return { success: false, message: 'Password minimal 6 karakter' }
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const json: unknown = await response.json()
    const data = parseApiResponse(json)

    if (data === null) {
      return { success: false, message: 'Response tidak valid dari server' }
    }

    if (data.success === false) {
      return { success: false, message: data.message !== '' ? data.message : 'Registrasi gagal' }
    }

    return {
      success: true,
      message: 'Registrasi berhasil! Silakan cek email untuk verifikasi akun.',
      redirectTo: '/auth/login',
    }
  } catch (err) {
    console.error('Register error:', err)
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}
