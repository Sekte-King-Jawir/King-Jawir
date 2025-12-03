'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'
import { registerAction } from './action'
import { initialState } from '../_shared/types'

export function RegisterForm(): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

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
        <h1 className={styles.title}>Daftar</h1>
        <p className={styles.subtitle}>Buat akun baru</p>

        {state.message !== '' && !state.success && (
          <div className={styles.error}>{state.message}</div>
        )}
        {state.message !== '' && state.success ? (
          <div className={styles.success}>{state.message}</div>
        ) : null}

        <form action={formAction} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder="Masukkan nama lengkap"
              required
              minLength={2}
            />
          </div>

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
              placeholder="Ulangi password"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.button} disabled={isPending}>
            {isPending ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className={styles.footer}>
          Sudah punya akun?{' '}
          <Link href="/login" className={styles.link}>
            Login sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
