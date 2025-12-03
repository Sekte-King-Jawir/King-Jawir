'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resendVerificationAction } from './action'
import { initialState } from '../_shared/types'

export function ResendVerificationForm(): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(resendVerificationAction, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 rounded-xl bg-background border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Kirim Ulang Verifikasi</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Masukkan email Anda untuk mengirim ulang link verifikasi</p>

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
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-background text-foreground transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 placeholder:text-gray-400"
              placeholder="nama@email.com"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-base font-semibold transition-colors disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Sudah verifikasi?{' '}
          <Link href="/auth/login" className="text-blue-500 font-medium hover:underline">
            Login sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
