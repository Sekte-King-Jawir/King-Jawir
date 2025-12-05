'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'

export function RegisterForm(): React.JSX.Element {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register: authRegister } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await authRegister({ name, email, password })
      if (response.success) {
        router.push('/')
      } else {
        setError(response.error ?? 'Registrasi failed')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      console.error('Registration error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 space-y-4 bg-white/50 dark:bg-slate-900/60 rounded-md shadow-sm"
    >
      <h2 className="text-2xl font-semibold">Buat Akun Baru</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded">{error}</div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="masukkan nama Anda"
          required
          className="w-full border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-800"
        />
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
        disabled={isSubmitting || name.trim() === '' || email.trim() === '' || password.trim() === ''}
      >
        {isSubmitting ? 'Mendaftar...' : 'Daftar'}
      </button>
    </form>
  )
}
