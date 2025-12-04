'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Store } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'

interface StoresApiResponse {
  success: boolean
  message: string
  data?: Store[]
}

export default function StoresPage(): React.JSX.Element {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchStores = async (): Promise<void> => {
      try {
        const res = await fetch(`${API_URL}/stores`, {
          credentials: 'include',
        })
        const result = (await res.json()) as StoresApiResponse

        if (result.success && result.data !== undefined) {
          setStores(result.data)
        } else {
          setError(result.message ?? 'Gagal memuat daftar toko')
        }
      } catch {
        setError('Gagal memuat daftar toko')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchStores()
  }, [])

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/price-analysis"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Analisis Harga
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Jelajahi Toko</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Temukan berbagai toko dengan produk berkualitas dari seller terpercaya
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Cari toko..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <StoresLoadingSkeleton />
        ) : error !== '' ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {searchQuery !== '' ? 'Toko Tidak Ditemukan' : 'Belum Ada Toko'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery !== ''
                ? `Tidak ada toko dengan nama "${searchQuery}"`
                : 'Belum ada toko yang terdaftar'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Menampilkan {filteredStores.length} toko
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStores.map(store => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p>© 2025 King Jawir. AI-Powered Price Analysis untuk UMKM Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface StoreCardProps {
  store: Store
}

function StoreCard({ store }: StoreCardProps): React.JSX.Element {
  const productCount = store._count?.products ?? store.productCount ?? 0

  return (
    <Link href={`/stores/${store.slug}`}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group">
        {/* Store Logo/Banner */}
        <div className="h-32 bg-linear-to-br from-blue-500 to-purple-600 relative">
          {store.logo !== undefined && store.logo !== null && store.logo !== '' ? (
            <Image src={store.logo} alt={store.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl">🏪</span>
            </div>
          )}
        </div>

        {/* Store Info */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {store.name}
          </h3>

          {store.description !== undefined &&
            store.description !== null &&
            store.description !== '' && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {store.description}
              </p>
            )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <span>📦</span>
              <span>{productCount} Produk</span>
            </div>

            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
              Kunjungi →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function StoresLoadingSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
        <div
          key={`skeleton-${n}`}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse"
        >
          <div className="h-32 bg-slate-200 dark:bg-slate-700" />
          <div className="p-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
