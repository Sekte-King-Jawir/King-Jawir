'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/api/services'
import { useAuth } from '@/hooks'
import styles from './RegisterForm.module.css'

export function RegisterForm(): React.JSX.Element {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login: authLogin } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await register(name, email, password)
      if (response.success) {
        await authLogin(response.data.token)
        router.push('/')
      } else {
        setError(response.message || 'Registrasi failed')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      console.error('Registration error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Buat Akun Baru</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.inputGroup}>
        <label htmlFor="name">Nama Lengkap</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="masukkan nama Anda"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="masukkan email Anda"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="masukkan password Anda"
          required
          className={styles.input}
        />
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting || !name || !email || !password}
      >
        {isSubmitting ? 'Mendaftar...' : 'Daftar'}
      </button>
    </form>
  )
}
