'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPasswordAction } from './action'
import { initialState } from '../_shared/types'
import { Card, Button, Alert } from '@repo/ui'

export function ForgotPasswordForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lupa Password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Masukkan email Anda untuk menerima link reset password
          </p>
        </div>

        {state.message.length > 0 && !state.success && (
          <Alert type="error" message={state.message} />
        )}
        {state.message.length > 0 && state.success && (
          <Alert type="success" message={state.message} />
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="nama@email.com"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isPending}
          >
            {isPending ? 'Mengirim...' : 'Kirim Link Reset'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ingat password?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login sekarang
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
