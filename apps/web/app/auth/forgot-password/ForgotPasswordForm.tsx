'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import styles from '../auth.module.css'
import { forgotPasswordAction } from './action'
import { initialState } from '../_shared/types'

export function ForgotPasswordForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState)

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Lupa Password</h1>
        <p className={styles.subtitle}>Masukkan email Anda untuk menerima link reset password</p>

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
            {isPending ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>

        <p className={styles.footer}>
          Ingat password?{' '}
          <Link href="/auth/login" className={styles.link}>
            Login sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
