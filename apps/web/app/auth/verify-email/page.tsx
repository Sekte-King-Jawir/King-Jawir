import Link from 'next/link'
import { verifyEmailAction } from './action'

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md p-8 rounded-xl bg-background border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Verifikasi Email</h1>
          <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm border border-red-200 dark:border-red-800">
            Token verifikasi tidak ditemukan
          </div>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Jika token sudah kadaluarsa, Anda dapat meminta verifikasi ulang.
          </p>
          <Link
            href="/auth/resend-verification"
            className="block text-center no-underline mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition-colors"
          >
            Kirim Ulang Verifikasi
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

  const result = await verifyEmailAction(token)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md p-8 rounded-xl bg-background border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-foreground">Verifikasi Email</h1>

        {result.success ? (
          <>
            <div className="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-4 text-sm border border-green-200 dark:border-green-800">
              {result.message}
            </div>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Akun Anda telah diverifikasi. Anda sekarang dapat login.
            </p>
            <Link
              href="/auth/login"
              className="block text-center no-underline mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition-colors"
            >
              Login Sekarang
            </Link>
          </>
        ) : (
          <>
            <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm border border-red-200 dark:border-red-800">
              {result.message}
            </div>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Jika token sudah kadaluarsa, Anda dapat meminta verifikasi ulang.
            </p>
            <Link
              href="/auth/resend-verification"
              className="block text-center no-underline mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-base font-semibold transition-colors"
            >
              Kirim Ulang Verifikasi
            </Link>
          </>
        )}

        <p className="text-center mt-6 text-sm text-gray-500">
          <Link href="/auth/login" className="text-blue-500 font-medium hover:underline">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}
