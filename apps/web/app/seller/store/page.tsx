'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSellerStore, useSellerUrls, useSellerAuth } from '@/hooks'
import { SellerNavbar, SellerSidebar, StoreInfoCard, StoreForm } from '@repo/ui'
import type { CreateStoreData, UpdateStoreData } from '@/types'

export default function SellerStorePage(): React.JSX.Element {
  const router = useRouter()
  const urls = useSellerUrls()
  const { user, isLoading: authLoading } = useSellerAuth()
  const {
    store,
    isLoading,
    isSubmitting,
    error,
    success,
    createStore,
    updateStore,
    clearMessages,
  } = useSellerStore()

  const [isEditing, setIsEditing] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && user === null) {
      router.push('/seller/auth/login?redirect=/seller/store')
    }
  }, [authLoading, user, router])

  const handleCreateStore = async (data: CreateStoreData | UpdateStoreData): Promise<void> => {
    await createStore(data as CreateStoreData)
  }

  const handleUpdateStore = async (data: CreateStoreData | UpdateStoreData): Promise<void> => {
    const updated = await updateStore(data as UpdateStoreData)
    if (updated) {
      setIsEditing(false)
    }
  }

  // Loading State
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <SellerNavbar urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-8 ml-64">
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
        <SellerNavbar urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-8 ml-64">
            <NeedLoginState loginUrl={`/auth/login?redirect=${urls.seller.store}`} />
          </main>
        </div>
      </div>
    )
  }

  const hasStore = store !== null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SellerNavbar userName={user.name} urls={urls} />

      <div className="flex">
        <SellerSidebar storeName={store?.name} urls={urls} />

        <main className="flex-1 p-8 ml-64">
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
            {error !== '' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                {error}
                <button
                  onClick={clearMessages}
                  className="ml-2 text-red-800 dark:text-red-300 hover:underline"
                >
                  ✕
                </button>
              </div>
            )}

            {success !== '' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400">
                {success}
                <button
                  onClick={clearMessages}
                  className="ml-2 text-green-800 dark:text-green-300 hover:underline"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Content */}
            {hasStore && !isEditing ? (
              <>
                <StoreInfoCard store={store} onEdit={() => setIsEditing(true)} />

                {/* Quick Actions */}
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <Link
                    href={urls.seller.products}
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
                    href={urls.seller.orders}
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
                    href={store?.slug ? `/stores/${store.slug}` : '#'}
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

function NeedLoginState({ loginUrl }: { loginUrl: string }): React.JSX.Element {
  return (
    <div className="max-w-4xl">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <span className="text-6xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Diperlukan</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Silakan login untuk mengakses Seller Dashboard
        </p>
        <Link
          href={loginUrl}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Masuk Sekarang
        </Link>
      </div>
    </div>
  )
}
