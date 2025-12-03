'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'
import { resetPasswordAction } from './action'
import { initialState } from '../_shared/types'

export function ResetPasswordForm({ token }: { token: string }): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState)

  useEffect(() => {
    if (state.success && state.redirectTo !== undefined && state.redirectTo !== '') {
      const redirectPath = state.redirectTo
      const timer = setTimeout(() => {
        router.push(redirectPath)
      }, 3000)
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
