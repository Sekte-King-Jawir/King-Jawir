'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { UserProfile, UpdateProfileData, ChangePasswordData } from './types'
import { ProfileForm } from './components/profile-form'
import { ChangePasswordForm } from './components/change-password-form'
import { AvatarSection } from './components/avatar-section'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'

interface ProfileApiResponse {
  success: boolean
  message: string
  data?: UserProfile
}

export default function ProfilePage(): React.JSX.Element {
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    async function fetchProfile(): Promise<void> {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          credentials: 'include',
        })
        const data = (await res.json()) as ProfileApiResponse

        if (data.success && data.data !== undefined) {
          setProfile(data.data)
        } else {
          router.push('/auth/login')
        }
      } catch {
        setError('Gagal memuat profil')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProfile()
  }, [router])

  const showSuccess = (message: string): void => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const handleUpdateProfile = async (data: UpdateProfileData): Promise<void> => {
    setIsUpdatingProfile(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as ProfileApiResponse

      if (result.success && result.data !== undefined) {
        setProfile(result.data)
        showSuccess('Profil berhasil diperbarui')
      } else {
        setError(result.message ?? 'Gagal memperbarui profil')
      }
    } catch {
      setError('Gagal memperbarui profil')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (data: ChangePasswordData): Promise<void> => {
    if (data.newPassword !== data.confirmPassword) {
      setError('Password baru tidak cocok')
      return
    }

    setIsChangingPassword(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = (await res.json()) as { success: boolean; message: string }

      if (result.success) {
        showSuccess('Password berhasil diubah')
        setShowPasswordForm(false)
      } else {
        setError(result.message ?? 'Gagal mengubah password')
      }
    } catch {
      setError('Gagal mengubah password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      router.push('/auth/login')
    } catch {
      router.push('/auth/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  if (profile === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-slate-600 dark:text-slate-400">Gagal memuat profil</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Profil Saya
        </h1>

        {successMessage !== '' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 flex items-center gap-2">
            <span className="text-xl">✅</span>
            {successMessage}
          </div>
        )}

        {error !== '' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Avatar Section */}
          <AvatarSection profile={profile} />

          {/* Profile Form */}
          <ProfileForm
            profile={profile}
            onSubmit={handleUpdateProfile}
            isSubmitting={isUpdatingProfile}
          />

          {/* Account Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
              Informasi Akun
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-slate-900 dark:text-white flex items-center gap-2">
                  {profile.email}
                  {profile.emailVerified ? (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                      Belum Terverifikasi
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
                <p className="text-slate-900 dark:text-white capitalize">
                  {profile.role.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Bergabung</p>
                <p className="text-slate-900 dark:text-white">
                  {new Date(profile.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Keamanan
              </h2>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ubah Password
                </button>
              )}
            </div>

            {showPasswordForm ? (
              <ChangePasswordForm
                onSubmit={handleChangePassword}
                onCancel={() => setShowPasswordForm(false)}
                isSubmitting={isChangingPassword}
              />
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Password terakhir diubah saat pendaftaran
              </p>
            )}
          </div>

          {/* Seller Section */}
          {profile.role === 'CUSTOMER' && (
            <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h2 className="font-semibold mb-2">Jadi Seller</h2>
              <p className="text-sm text-blue-100 mb-4">
                Mulai jual produkmu dan jangkau lebih banyak pembeli
              </p>
              <Link
                href="/seller/register"
                className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Daftar Sebagai Seller
              </Link>
            </div>
          )}

          {profile.role === 'SELLER' && (
            <Link
              href="/seller/store"
              className="block bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white hover:opacity-90 transition-opacity"
            >
              <h2 className="font-semibold mb-2">Kelola Toko</h2>
              <p className="text-sm text-blue-100">
                Akses dashboard seller untuk mengelola produk dan pesanan
              </p>
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={() => void handleLogout()}
            className="w-full py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Keluar dari Akun
          </button>
        </div>
      </main>
    </div>
  )
}

function Navbar(): React.JSX.Element {
  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/orders"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
            >
              Pesanan
            </Link>
            <Link
              href="/cart"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
            >
              🛒 Keranjang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-32" />
      <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-64" />
      <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-40" />
    </div>
  )
}
