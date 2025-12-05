'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { resetPasswordAction } from './action'
import { initialState } from '../_shared/types'
import { Card, Button, Alert } from '@repo/ui'

export function ResetPasswordForm({ token }: { token: string }): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState)

  useEffect(() => {
    if (state.success && state.redirectTo && state.redirectTo.length > 0) {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Masukkan password baru Anda
          </p>
        </div>

        {state.message.length > 0 && !state.success && (
          <Alert type="error" message={state.message} />
        )}
        {state.message.length > 0 && state.success && (
          <Alert type="success" message={state.message} />
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Ulangi password baru"
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <Button type="submit" className="w-full" loading={isPending}>
            {isPending ? 'Memproses...' : 'Reset Password'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Kembali ke Login
          </Link>
        </div>
      </Card>
    </div>
  )
}
