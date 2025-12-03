'use client'

import { useActionState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../../(auth)/auth.module.css'

interface ActionResult {
  success: boolean
  message: string
  redirectTo?: string
}

const initialState: ActionResult = {
  success: false,
  message: '',
}

async function resetPasswordAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const token = formData.get('token') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'

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

    const json = await response.json() as { success?: boolean; message?: string }

    if (json.success !== true) {
      return { 
        success: false, 
        message: typeof json.message === 'string' && json.message !== '' ? json.message : 'Gagal reset password' 
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

function InvalidToken(): React.JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        <div className={styles.error}>
          Token reset password tidak ditemukan atau tidak valid
        </div>
        <p className={styles.subtitle}>Silakan minta link reset password baru</p>
        <Link
          href="/forgot-password"
          className={styles.button}
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}
        >
          Minta Link Baru
        </Link>
        <p className={styles.footer}>
          <Link href="/login" className={styles.link}>
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}

function ResetPasswordFormContent({ token }: { token: string }): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState)

  useEffect(() => {
    if (state.success && state.redirectTo !== undefined && state.redirectTo !== '') {
      const redirectPath = state.redirectTo
      const timer = setTimeout(() => {
        router.push(redirectPath)
      }, 2000)
      return () => {
        clearTimeout(timer)
      }
    }
    return undefined
  }, [state, router])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Masukkan password baru Anda</p>

        {state.message !== '' && !state.success && (
          <div className={styles.error}>{state.message}</div>
        )}
        {state.message !== '' && state.success ? (
          <div className={styles.success}>{state.message}</div>
        ) : null}

        <form action={formAction} className={styles.form}>
          <input type="hidden" name="token" value={token} />

          <div className={styles.inputGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className={styles.input}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              placeholder="Ulangi password baru"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.button} disabled={isPending}>
            {isPending ? 'Memproses...' : 'Reset Password'}
          </button>
        </form>

        <p className={styles.footer}>
          <Link href="/login" className={styles.link}>
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage(): React.JSX.Element {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (token === null || token === '') {
    return <InvalidToken />
  }

  return <ResetPasswordFormContent token={token} />
}
