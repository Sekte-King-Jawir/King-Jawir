'use client'

import Link from 'next/link'
import { Card, Alert } from '@repo/ui'

export function InvalidToken(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
        </div>

        <Alert
          type="error"
          title="Token Tidak Valid"
          message="Token reset password tidak ditemukan atau tidak valid"
        />

        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Silakan minta link reset password baru
        </p>

        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Minta Link Baru
        </Link>

        <div className="text-center">
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
