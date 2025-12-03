'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'
import { loginAction } from './action'
import { initialState } from '../_shared/types'

export function LoginForm(): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  useEffect(() => {
    if (state.success && state.redirectTo !== undefined && state.redirectTo !== '') {
      router.push(state.redirectTo)
      router.refresh()
    }
  }, [state, router])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Masuk ke akun Anda</p>

        {state.message !== '' && !state.success && (
          <div className={styles.error}>{state.message}</div>
        )}

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

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={isPending}>
            {isPending ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className={styles.footer}>
          <Link href="/forgot-password" className={styles.link}>
            Lupa password?
          </Link>
        </p>

        <p className={styles.footer}>
          Belum punya akun?{' '}
          <Link href="/register" className={styles.link}>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
