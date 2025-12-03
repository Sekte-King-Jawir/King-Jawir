import Link from 'next/link'
import { verifyEmailAction } from './action'
import styles from '../auth.module.css'

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
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Verifikasi Email</h1>
          <div className={styles.error}>Token verifikasi tidak ditemukan</div>
          <p className={styles.subtitle}>
            Jika token sudah kadaluarsa, Anda dapat meminta verifikasi ulang.
          </p>
          <Link
            href="/auth/resend-verification"
            className={styles.button}
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              marginTop: '1rem',
            }}
          >
            Kirim Ulang Verifikasi
          </Link>
          <p className={styles.footer}>
            <Link href="/auth/login" className={styles.link}>
              Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const result = await verifyEmailAction(token)

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verifikasi Email</h1>

        {result.success ? (
          <>
            <div className={styles.success}>{result.message}</div>
            <p className={styles.subtitle}>
              Akun Anda telah diverifikasi. Anda sekarang dapat login.
            </p>
            <Link
              href="/auth/login"
              className={styles.button}
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                marginTop: '1rem',
              }}
            >
              Login Sekarang
            </Link>
          </>
        ) : (
          <>
            <div className={styles.error}>{result.message}</div>
            <p className={styles.subtitle}>
              Jika token sudah kadaluarsa, Anda dapat meminta verifikasi ulang.
            </p>
            <Link
              href="/auth/resend-verification"
              className={styles.button}
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                marginTop: '1rem',
              }}
            >
              Kirim Ulang Verifikasi
            </Link>
          </>
        )}

        <p className={styles.footer}>
          <Link href="/auth/login" className={styles.link}>
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}
