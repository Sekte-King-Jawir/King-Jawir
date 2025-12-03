'use client'

import Link from 'next/link'
import styles from '../auth.module.css'

export function InvalidToken(): React.JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        <div className={styles.error}>Token reset password tidak ditemukan atau tidak valid</div>
        <p className={styles.subtitle}>Silakan minta link reset password baru</p>
        <Link
          href="/auth/forgot-password"
          className={styles.button}
          style={{
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none',
            marginTop: '1rem',
          }}
        >
          Minta Link Baru
        </Link>
        <p className={styles.footer}>
          <Link href="/auth/login" className={styles.link}>
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}
