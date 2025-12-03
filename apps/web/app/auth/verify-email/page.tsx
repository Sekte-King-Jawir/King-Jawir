import Link from 'next/link'
import styles from '../../(auth)/auth.module.css'

interface ApiResponse {
  success: boolean
  message: string
}

function parseApiResponse(value: unknown): ApiResponse | null {
  if (typeof value !== 'object' || value === null) return null
  const obj = value as Record<string, unknown>
  if (typeof obj.success !== 'boolean' || typeof obj.message !== 'string') return null
  return { success: obj.success, message: obj.message }
}

async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'
  
  try {
    const response = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const json: unknown = await response.json()
    const data = parseApiResponse(json)

    if (data === null) {
      return { success: false, message: 'Response tidak valid dari server' }
    }

    return {
      success: data.success,
      message: data.message !== '' ? data.message : (data.success ? 'Email berhasil diverifikasi!' : 'Verifikasi gagal'),
    }
  } catch (err) {
    console.error('Verify email error:', err)
    return { success: false, message: 'Terjadi kesalahan. Silakan coba lagi.' }
  }
}

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ 
  searchParams 
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
            Silakan gunakan link yang dikirim ke email Anda.
          </p>
          <Link 
            href="/resend-verification" 
            className={styles.button} 
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}
          >
            Kirim Ulang Verifikasi
          </Link>
          <p className={styles.footer}>
            <Link href="/login" className={styles.link}>
              Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const result = await verifyEmail(token)

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
              href="/login" 
              className={styles.button} 
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}
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
              href="/resend-verification" 
              className={styles.button} 
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}
            >
              Kirim Ulang Verifikasi
            </Link>
          </>
        )}

        <p className={styles.footer}>
          <Link href="/login" className={styles.link}>
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  )
}
