'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCategories } from '@/hooks'
import type { Category } from '@/types'

// Icon mapping untuk kategori
const categoryIcons: Record<string, string> = {
  elektronik: '📱',
  fashion: '👕',
  'rumah-tangga': '🏠',
  olahraga: '⚽',
  makanan: '🍔',
  minuman: '🥤',
  kecantikan: '💄',
  kesehatan: '💊',
  otomotif: '🚗',
  buku: '📚',
  mainan: '🧸',
  perhiasan: '💍',
  default: '📦',
}

function getCategoryIcon(slug: string): string {
  const icon = categoryIcons[slug]
  return icon ?? '📦'
}

// Warna gradient untuk kategori
const categoryColors: string[] = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-orange-500 to-amber-400',
  'from-green-500 to-emerald-400',
  'from-red-500 to-rose-400',
  'from-indigo-500 to-violet-400',
  'from-teal-500 to-cyan-400',
  'from-fuchsia-500 to-pink-400',
]

export default function CategoriesPage(): React.JSX.Element {
  const { categories, loading, error: hookError } = useCategories()
  const [searchQuery, setSearchQuery] = useState('')
  const error = hookError ?? ''

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Link
                href="/price-analysis"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Analisis Harga
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-linear-to-br from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-4">Kategori Produk</h1>
          <p className="text-white/80 text-lg mb-8">
            Jelajahi berbagai kategori produk yang tersedia di King Jawir
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-0 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <LoadingSkeleton />
        ) : error !== '' ? (
          <ErrorState message={error} />
        ) : filteredCategories.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredCategories.map((category, index) => {
              const colorIndex = index % categoryColors.length
              const colorClass = categoryColors[colorIndex] ?? 'from-blue-500 to-cyan-400'
              return <CategoryCard key={category.id} category={category} colorClass={colorClass} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryCard({
  category,
  colorClass,
}: {
  category: Category
  colorClass: string
}): React.JSX.Element {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="p-6 text-center">
        {/* Icon */}
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br ${colorClass} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {getCategoryIcon(category.slug)}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {category.name}
        </h3>

        {/* Product Count */}
        <p className="text-sm text-slate-500 dark:text-slate-400">{category.productCount} produk</p>
      </div>

      {/* Arrow indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          className="w-5 h-5 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`skeleton-${String(i)}`}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-3 w-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">😢</div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Oops!</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )
}

function EmptyState({ searchQuery }: { searchQuery: string }): React.JSX.Element {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {searchQuery !== '' ? 'Kategori tidak ditemukan' : 'Belum ada kategori'}
      </h2>
      <p className="text-slate-600 dark:text-slate-400">
        {searchQuery !== ''
          ? `Tidak ada kategori yang cocok dengan "${searchQuery}"`
          : 'Kategori akan segera tersedia'}
      </p>
    </div>
  )
}
