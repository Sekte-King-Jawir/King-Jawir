'use client'

import Link from 'next/link'

export function InvalidToken(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 rounded-xl bg-background border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Reset Password</h1>
        <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm border border-red-200 dark:border-red-800">
          Token reset password tidak ditemukan atau tidak valid
        </div>
        <p className="text-center text-gray-500 mb-6 text-sm">Silakan minta link reset password baru</p>
        <Link
          href="/auth/forgot-password"
          className="block text-center no-underline mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition-colors"
        >
          Minta Link Baru
        </Link>
        <p className="text-center mt-6 text-sm text-gray-500">
          <Link href="/auth/login" className="text-blue-500 font-medium hover:underline">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}
