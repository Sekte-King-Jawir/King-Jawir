'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import { resendVerificationAction } from './action'
import { initialState } from '../_shared/types'

export function ResendVerificationForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(resendVerificationAction, initialState)

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Kirim Ulang Verifikasi</h1>
        <p className={styles.subtitle}>Masukkan email Anda untuk mengirim ulang link verifikasi</p>

        {state.message !== '' && !state.success && (
          <div className={styles.error}>{state.message}</div>
        )}
        {state.message !== '' && state.success ? (
          <div className={styles.success}>{state.message}</div>
        ) : null}

        <form action={formAction} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="nama@email.com"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={isPending}>
            {isPending ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
          </button>
        </form>

        <p className={styles.footer}>
          Sudah verifikasi?{' '}
          <Link href="/login" className={styles.link}>
            Login sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
