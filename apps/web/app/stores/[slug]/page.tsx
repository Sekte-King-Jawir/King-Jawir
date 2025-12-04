'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { storeService } from '@/lib/api'
import type { Store } from '@/types'
import type { StoreProduct } from '../types'
import { StoreHeader, StoreProducts } from './components'

export default function StoreDetailPage(): React.JSX.Element {
  const params = useParams()
  const slug = params.slug as string

  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStoreData(): Promise<void> {
      if (slug === '') return

      setIsLoading(true)
      setError('')

      try {
        // Fetch store info
        const storeResponse = await storeService.getBySlug(slug)

        if (storeResponse.success && storeResponse.data) {
          setStore(storeResponse.data.store)

          // Fetch store products
          const productsResponse = await storeService.getStoreProducts(slug, { limit: 20 })

          if (productsResponse.success && productsResponse.data) {
            // Map Product to StoreProduct format
            const prods = productsResponse.data.products || productsResponse.data.items || []
            setProducts(prods as any)
          }
        } else {
          setError(storeResponse.message ?? 'Toko tidak ditemukan')
        }
      } catch {
        setError('Gagal memuat data toko')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchStoreData()
  }, [slug])

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  // Error State
  if (error !== '' || store === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <ErrorState message={error} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">{store.name}</span>
        </nav>

        <StoreHeader store={store as any} />
        <StoreProducts products={products} storeName={store.name} />
      </main>
    </div>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <>
      {/* Store Header Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          <div className="flex-1">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />
            <div className="flex gap-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-slate-100 dark:bg-slate-700/50 rounded-xl overflow-hidden">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
              <div className="p-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

interface ErrorStateProps {
  message: string
}

function ErrorState({ message }: ErrorStateProps): React.JSX.Element {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
      <span className="text-6xl mb-4 block">😕</span>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Toko Tidak Ditemukan
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {message !== '' ? message : 'Maaf, toko yang Anda cari tidak tersedia.'}
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        <span>←</span>
        Kembali ke Marketplace
      </Link>
    </div>
  )
}
