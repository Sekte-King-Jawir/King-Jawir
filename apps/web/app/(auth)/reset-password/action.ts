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

export async function resetPasswordAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = formData.get('token') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (token === '') {
    return { success: false, message: 'Token tidak ditemukan' }
  }

  if (newPassword === '' || confirmPassword === '') {
    return { success: false, message: 'Password harus diisi' }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: 'Password dan konfirmasi password tidak cocok' }
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'Password minimal 6 karakter' }
  }

  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    const json: unknown = await response.json()
    const data = parseApiResponse(json)

    if (data === null) {
      return { success: false, message: 'Response tidak valid dari server' }
    }

    if (data.success === false) {
      return {
        success: false,
        message: data.message !== '' ? data.message : 'Gagal reset password',
      }
    }

    return {
      success: true,
      message: 'Password berhasil direset!',
      redirectTo: '/login',
    }
  } catch (err) {
    console.error('Reset password error:', err)
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}
