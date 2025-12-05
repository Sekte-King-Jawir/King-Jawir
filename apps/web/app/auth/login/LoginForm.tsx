'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { API_CONFIG, API_ENDPOINTS } from '@/lib/config/api'

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
      const response = await authLogin({ email, password })
      if (response.success) {
        router.push('/')
      } else {
        setError(response.error || 'Login failed')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 space-y-4 bg-white/50 dark:bg-slate-900/60 rounded-md shadow-sm"
    >
      <h2 className="text-2xl font-semibold">Masuk ke Akun</h2>

      {error ? <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded">{error}</div> : null}

      {/* Google Sign-in */}
      <div>
        <button
          type="button"
          onClick={() => (window.location.href = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`)}
          className="w-full flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 hover:bg-slate-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path fill="#EA4335" d="M24 9.5c3.8 0 6.9 1.6 9.1 3.1l6.7-6.6C36.9 2.6 30.9 0 24 0 14.7 0 6.9 5.5 3.1 13.6l7.8 6.1C12.8 14 18 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.6c-.5 2.6-2 4.8-4.3 6.3l6.9 5.4c4-3.7 6.3-9.2 6.3-15.7z"/>
            <path fill="#FBBC05" d="M10.9 29.7A14.8 14.8 0 0 1 9 24c0-1.6.3-3.2.8-4.7L3.1 13.6A24 24 0 0 0 0 24c0 3.9.9 7.6 2.6 10.9l8.3-5.2z"/>
            <path fill="#34A853" d="M24 48c6.6 0 12.3-2.2 16.4-6l-7.8-6.1C29.9 35.8 27.1 36.9 24 36.9c-6 0-11.1-4.5-12.6-10.4L3.1 34.4C6.9 42.5 14.7 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Masuk dengan Google
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="masukkan email Anda"
          required
          className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="masukkan password Anda"
          required
          className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded mt-2"
        disabled={isSubmitting || email.trim() === '' || password.trim() === ''}
      >
        {isSubmitting ? 'Masuk...' : 'Masuk'}
      </button>
    </form>
  )
}
