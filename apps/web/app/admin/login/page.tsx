'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'}/api`

export default function AdminLoginPage(): React.ReactElement {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.warn('🔐 Attempting login to:', `${API_BASE_URL}/auth/login`)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.warn('📡 Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error:', errorText)
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as {
        success: boolean
        message?: string
        data?: {
          accessToken: string
          refreshToken: string
          user: {
            id: string
            name: string
            email: string
            role: string
          }
        }
      }

      console.warn('📦 Response data:', { success: data.success, role: data.data?.user.role })

      if (!data.success) {
        throw new Error(data.message ?? 'Login failed')
      }

      // Check if user is admin
      if (data.data?.user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin role required.')
      }

      console.warn('✅ Login successful, redirecting...')

      // Redirect to admin dashboard (tokens are stored in cookies by server)
      router.push('/admin')
    } catch (err) {
      console.error('💥 Login error:', err)
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(
        message.includes('Failed to fetch')
          ? 'Cannot connect to server. Please make sure backend is running on port 4101.'
          : message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">👑 Admin Login</h1>
            <p className="text-gray-600">Sign in to access admin panel</p>
          </div>

          {error !== null && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={e => void handleLogin(e)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Default admin credentials:
              <br />
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                Check your database seed
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
