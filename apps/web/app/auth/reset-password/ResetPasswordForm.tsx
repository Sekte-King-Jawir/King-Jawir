'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { resetPasswordAction } from './action'
import { initialState } from '../_shared/types'

export function ResetPasswordForm({ token }: { token: string }): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState)

  useEffect(() => {
    if (state.success && state.redirectTo !== undefined && state.redirectTo !== '') {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 rounded-xl bg-background border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Reset Password</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Masukkan password baru Anda</p>

        {state.message !== '' && !state.success && (
          <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm border border-red-200 dark:border-red-800">
            {state.message}
          </div>
        )}
        {state.message !== '' && state.success ? (
          <div className="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-4 text-sm border border-green-200 dark:border-green-800">
            {state.message}
          </div>
        ) : null}

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />

          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-background text-foreground transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 placeholder:text-gray-400"
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-background text-foreground transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 placeholder:text-gray-400"
              placeholder="Ulangi password baru"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-base font-semibold transition-colors disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? 'Memproses...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          <Link href="/auth/login" className="text-blue-500 font-medium hover:underline">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}
