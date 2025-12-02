'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../auth.module.css'

interface LoginResponse {
  success: boolean
  message: string
  data?: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export default function LoginPage(): React.JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        }
      )

      const data: LoginResponse = await response.json()

      if (!data.success) {
        setError(data.message || 'Login gagal')
        return
      }

      // Simpan token di localStorage sebagai backup
      if (data.data) {
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.data.user))
      }

      // Redirect ke halaman utama
      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Masuk ke akun Anda</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

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
