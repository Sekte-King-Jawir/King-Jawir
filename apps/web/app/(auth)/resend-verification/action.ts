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

export async function resendVerificationAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get('email') as string

  if (email === '') {
    return { success: false, message: 'Email harus diisi' }
  }

  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const json: unknown = await response.json()
    const data = parseApiResponse(json)

    if (data === null) {
      return { success: false, message: 'Response tidak valid dari server' }
    }

    if (data.success === false) {
      return {
        success: false,
        message: data.message !== '' ? data.message : 'Gagal mengirim email verifikasi',
      }
    }

    return {
      success: true,
      message: data.message !== '' ? data.message : 'Email verifikasi telah dikirim ulang!',
    }
  } catch (err) {
    console.error('Resend verification error:', err)
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}
