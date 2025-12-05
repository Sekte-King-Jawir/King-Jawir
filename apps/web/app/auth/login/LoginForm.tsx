'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { API_CONFIG, API_ENDPOINTS } from '@/lib/config/api'
import { Button, Card, Alert } from '@repo/ui'

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
        setError(response.error ?? 'Login failed')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (e: React.FormEvent): void => {
    void handleSubmit(e)
  }

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Masuk ke Akun</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Selamat datang kembali! Masukkan kredensial Anda.
          </p>
        </div>

        {error.length > 0 && <Alert type="error" message={error} />}

        {/* Google Sign-in */}
        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center justify-center gap-3"
          onClick={() =>
            (window.location.href = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`)
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
            <path
              fill="#EA4335"
              d="M24 9.5c3.8 0 6.9 1.6 9.1 3.1l6.7-6.6C36.9 2.6 30.9 0 24 0 14.7 0 6.9 5.5 3.1 13.6l7.8 6.1C12.8 14 18 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.6c-.5 2.6-2 4.8-4.3 6.3l6.9 5.4c4-3.7 6.3-9.2 6.3-15.7z"
            />
            <path
              fill="#FBBC05"
              d="M10.9 29.7A14.8 14.8 0 0 1 9 24c0-1.6.3-3.2.8-4.7L3.1 13.6A24 24 0 0 0 0 24c0 3.9.9 7.6 2.6 10.9l8.3-5.2z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.6 0 12.3-2.2 16.4-6l-7.8-6.1C29.9 35.8 27.1 36.9 24 36.9c-6 0-11.1-4.5-12.6-10.4L3.1 34.4C6.9 42.5 14.7 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Masuk dengan Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Atau</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="masukkan email Anda"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="masukkan password Anda"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={email.trim() === '' || password.trim() === ''}
        >
          {isSubmitting ? 'Masuk...' : 'Masuk'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Belum punya akun?{' '}
            <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Daftar sekarang
            </a>
          </p>
        </div>
      </form>
    </Card>
  )
}
