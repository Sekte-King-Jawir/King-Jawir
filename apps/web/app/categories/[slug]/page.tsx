'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useProducts, useCategories } from '@/hooks'
import type { Product } from '@/types'

export default function CategoryDetailPage(): React.JSX.Element {
  const params = useParams()
  const slug = params.slug as string

  const { categories } = useCategories()
  const category = categories.find(cat => cat.slug === slug)
  
  const { products, loading, totalPages: hookTotalPages, fetchProducts } = useProducts()
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest')
  const totalPages = hookTotalPages

  // Fetch products by category
  useEffect(() => {
    if (category !== undefined && category !== null) {
      void fetchProducts({
        categoryId: category.id,
        page,
        limit: 12,
      })
    }
  }, [category, page, fetchProducts])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (category === undefined || category === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Kategori tidak ditemukan
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Kategori dengan slug "{slug}" tidak ditemukan</p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            ← Kembali ke Kategori
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-blue-600 transition-colors">
              Kategori
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">{category?.name ?? '...'}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {category?.name ?? 'Memuat...'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {category !== null ? `${category.productCount} produk ditemukan` : 'Memuat...'}
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Urutkan:</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Terbaru</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="popular">Terpopuler</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <ProductsSkeleton />
        ) : products.length === 0 ? (
          <EmptyProducts />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Navbar(): React.JSX.Element {
  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/categories"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Kategori
            </Link>
            <Link
              href="/products"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Produk
            </Link>
            <Link
              href="/stores"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Toko
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function ProductCard({
  product,
  formatPrice,
}: {
  product: Product
  formatPrice: (price: number) => string
}): React.JSX.Element {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-square relative bg-slate-100 dark:bg-slate-700 overflow-hidden">
        {product.image !== null && product.image !== '' ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}

        {/* Out of stock badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Habis</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Store name */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 truncate">
          {product.store.name}
        </p>

        {/* Product name */}
        <h3 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <p className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(product.price)}</p>

        {/* Stock info */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Stok: {product.stock}
        </p>
      </div>
    </Link>
  )
}

function ProductsSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`skeleton-${String(i)}`}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyProducts(): React.JSX.Element {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Belum ada produk
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Produk untuk kategori ini akan segera tersedia
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Lihat Semua Produk
      </Link>
    </div>
  )
}
