import Link from 'next/link'
import { verifyEmailAction } from './action'
import { Card, Alert } from '@repo/ui'

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps): Promise<React.JSX.Element> {
  const params = await searchParams
  const token = params.token

  if (token === undefined || token === '') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verifikasi Email</h1>
          </div>

          <Alert
            type="error"
            title="Token Tidak Ditemukan"
            message="Token verifikasi tidak ditemukan"
          />

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
            Jika token sudah kadaluarsa, Anda dapat meminta verifikasi ulang.
          </p>

          <Link
            href="/auth/resend-verification"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mb-4"
          >
            Kirim Ulang Verifikasi
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

  const result = await verifyEmailAction(token)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verifikasi Email</h1>
        </div>

        {result.success ? (
          <>
            <Alert type="success" message={result.message} />
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Akun Anda telah diverifikasi. Anda sekarang dapat login.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mb-4"
            >
              Login Sekarang
            </Link>
          </>
        ) : (
          <>
            <Alert type="error" message={result.message} />
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Jika token sudah kadaluarsa, Anda dapat meminta verifikasi ulang.
            </p>
            <Link
              href="/auth/resend-verification"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mb-4"
            >
              Kirim Ulang Verifikasi
            </Link>
          </>
        )}

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
