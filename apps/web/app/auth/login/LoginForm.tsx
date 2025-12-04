'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/api/services'
import { useAuth } from '@/hooks'
import styles from './LoginForm.module.css'

export function LoginForm(): React.JSX.Element {
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
      const response = await login(email, password)
      if (response.success) {
        await authLogin(response.data.token)
        router.push('/')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Masuk ke Akun</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          placeholder="masukkan password Anda"
          required
          className={styles.input}
        />
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting || !email || !password}
      >
        {isSubmitting ? 'Masuk...' : 'Masuk'}
      </button>
    </form>
  )
}