'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../auth.module.css'

interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validasi password match
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      return
    }

    // Validasi panjang password
    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data: RegisterResponse = await response.json()

      if (!data.success) {
        setError(data.message || 'Registrasi gagal')
        return
      }

      setSuccess('Registrasi berhasil! Silakan cek email untuk verifikasi akun.')
      
      // Reset form
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Redirect ke halaman login setelah beberapa detik
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Daftar</h1>
        <p className={styles.subtitle}>Buat akun baru</p>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="Ulangi password"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
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
