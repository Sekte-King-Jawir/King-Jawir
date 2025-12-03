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

export async function forgotPasswordAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get('email') as string

  if (email === '') {
    return { success: false, message: 'Email harus diisi' }
  }

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
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
        message: data.message !== '' ? data.message : 'Gagal mengirim link reset password',
      }
    }

    return {
      success: true,
      message:
        data.message !== '' ? data.message : 'Link reset password telah dikirim ke email Anda!',
    }
  } catch (err) {
    console.error('Forgot password error:', err)
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}
