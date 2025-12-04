'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type {
  SellerStore,
  User,
  AuthMeResponse,
  StoreApiResponse,
  CreateStoreData,
  UpdateStoreData,
} from '../types'
import { Navbar, Sidebar } from '../components'
import { StoreInfoCard, StoreForm } from './components'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'  }/api`

export default function SellerStorePage(): React.JSX.Element {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [store, setStore] = useState<SellerStore | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch user & store data
  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        // Check auth
        const meRes = await fetch(`${API_URL}/auth/me`, { credentials: 'include' })
        const meData = (await meRes.json()) as AuthMeResponse

        if (!meData.success || meData.data === undefined) {
          router.push('/auth/login?redirect=/seller/store')
          return
        }

        setUser(meData.data.user)

        // Fetch store if user is seller
        if (meData.data.user.role === 'SELLER' || meData.data.user.role === 'ADMIN') {
          const storeRes = await fetch(`${API_URL}/store`, { credentials: 'include' })
          const storeData = (await storeRes.json()) as StoreApiResponse

          if (storeData.success && storeData.data !== undefined) {
            setStore(storeData.data.store)
          }
        }
      } catch {
        setError('Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [router])

  const handleCreateStore = async (data: CreateStoreData | UpdateStoreData): Promise<void> => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as StoreApiResponse

      if (result.success && result.data !== undefined) {
        setStore(result.data.store)
        setUser(prev => (prev !== null ? { ...prev, role: 'SELLER' } : null))
        setSuccess('Toko berhasil dibuat! Anda sekarang menjadi SELLER.')
      } else {
        setError(result.message ?? 'Gagal membuat toko')
      }
    } catch {
      setError('Gagal membuat toko')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStore = async (data: CreateStoreData | UpdateStoreData): Promise<void> => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/store`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as StoreApiResponse

      if (result.success && result.data !== undefined) {
        setStore(result.data.store)
        setIsEditing(false)
        setSuccess('Toko berhasil diperbarui!')
      } else {
        setError(result.message ?? 'Gagal memperbarui toko')
      }
    } catch {
      setError('Gagal memperbarui toko')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <LoadingSkeleton />
          </main>
        </div>
      </div>
    )
  }

  // Not logged in
  if (user === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <NeedLoginState />
          </main>
        </div>
      </div>
    )
  }

  const hasStore = store !== null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar userName={user.name} />

      <div className="flex">
        <Sidebar storeName={store?.name} />

        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {hasStore ? 'Toko Saya' : 'Buat Toko'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {hasStore
                  ? 'Kelola informasi dan pengaturan toko Anda'
                  : 'Mulai berjualan dengan membuat toko Anda sendiri'}
              </p>
            </div>

            {/* Alerts */}
            {error !== '' ? (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : null}

            {success !== '' ? (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400">
                {success}
              </div>
            ) : null}

            {/* Content */}
            {hasStore && !isEditing ? (
              <>
                <StoreInfoCard store={store} onEdit={() => setIsEditing(true)} />

                {/* Quick Actions */}
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <Link
                    href="/seller/products"
                    className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                  >
                    <span className="text-2xl mb-2 block">📦</span>
                    <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Kelola Produk
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tambah atau edit produk
                    </p>
                  </Link>

                  <Link
                    href="/seller/orders"
                    className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                  >
                    <span className="text-2xl mb-2 block">📋</span>
                    <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Pesanan Masuk
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Lihat dan proses pesanan
                    </p>
                  </Link>

                  <Link
                    href={`/stores/${store.slug}`}
                    className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
                  >
                    <span className="text-2xl mb-2 block">👁️</span>
                    <h3 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Lihat Toko
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Preview halaman publik
                    </p>
                  </Link>
                </div>
              </>
            ) : hasStore && isEditing ? (
              <StoreForm
                store={store}
                onSubmit={handleUpdateStore}
                onCancel={() => setIsEditing(false)}
                isLoading={isSubmitting}
              />
            ) : (
              <StoreForm onSubmit={handleCreateStore} isLoading={isSubmitting} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex gap-6">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NeedLoginState(): React.JSX.Element {
  return (
    <div className="max-w-4xl">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <span className="text-6xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Diperlukan</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Silakan login untuk mengakses Seller Dashboard
        </p>
        <Link
          href="/auth/login?redirect=/seller/store"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Masuk Sekarang
        </Link>
      </div>
    </div>
  )
}
