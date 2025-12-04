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

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (token === '') {
    return { success: false, message: 'Token verifikasi tidak ditemukan' }
  }

  try {
    const response = await fetch(
      `${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const json: unknown = await response.json()
    const data = parseApiResponse(json)

    if (data === null) {
      return { success: false, message: 'Response tidak valid dari server' }
    }

    if (data.success === false) {
      return { success: false, message: data.message !== '' ? data.message : 'Verifikasi gagal' }
    }

    return {
      success: true,
      message: data.message !== '' ? data.message : 'Email berhasil diverifikasi!',
    }
  } catch (err) {
    console.error('Verify email error:', err)
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}
