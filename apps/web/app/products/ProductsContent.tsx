'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, ShoppingCart, Grid3x3, List } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductListCard } from '@repo/ui'
// Import hooks langsung dari file untuk menghindari barrel export pollution
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useCart } from '@/hooks/useCart'
import { useProductRating } from '@/hooks/useProductRating'
import { useAuth } from '@/hooks/useAuth'
import type { Product } from '@/types'

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-asc', label: 'Harga: Rendah ke Tinggi' },
  { value: 'price-desc', label: 'Harga: Tinggi ke Rendah' },
  { value: 'rating', label: 'Rating Tertinggi' },
]

const priceRanges = [
  { id: 'all', label: 'Semua Harga', min: 0, max: 999999999 },
  { id: '0-100000', label: 'Di bawah Rp 100rb', min: 0, max: 100000 },
  { id: '100000-500000', label: 'Rp 100rb - Rp 500rb', min: 100000, max: 500000 },
  { id: '500000-1000000', label: 'Rp 500rb - Rp 1jt', min: 500000, max: 1000000 },
  { id: '1000000-5000000', label: 'Rp 1jt - Rp 5jt', min: 1000000, max: 5000000 },
  { id: '5000000-up', label: 'Di atas Rp 5jt', min: 5000000, max: 999999999 },
]

// Wrapper untuk Next.js Link
function NextLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

// Wrapper untuk Next.js Image
function NextImage({
  src,
  alt,
  fill,
  className,
}: {
  src: string
  alt: string
  fill?: boolean
  className?: string
}): React.JSX.Element {
  return <Image src={src} alt={alt} fill={fill === true} className={className} />
}

// Type-safe wrapper for formatPrice - inlined to avoid import issues
function safeFormatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

// Product Card Item dengan Rating Hook
interface ProductCardItemProps {
  product: Product
  onAddToCart: (productId: string) => void
  isAuthenticated?: boolean
}

function ProductCardItem({
  product,
  onAddToCart,
  isAuthenticated,
}: ProductCardItemProps): React.JSX.Element {
  const { rating, totalReviews, isLoading } = useProductRating(product.slug)

  return (
    <ProductListCard
      id={product.id}
      name={product.name}
      slug={product.slug}
      price={Number(product.price)}
      stock={product.stock}
      image={product.image ?? null}
      store={{
        name: product.store.name,
        slug: product.store.slug,
      }}
      ratingData={{
        rating,
        totalReviews,
        isLoading,
      }}
      onAddToCart={() => onAddToCart(product.id)}
      showAddToCart={isAuthenticated}
      linkComponent={NextLink}
      imageComponent={NextImage}
      formatPrice={safeFormatPrice}
      cartIcon={<ShoppingCart className="w-4 h-4" />}
    />
  )
}

export function ProductsContent(): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { products, loading, totalPages, currentPage, fetchProducts } = useProducts()
  const { categories, fetchCategories } = useCategories()
  const { addItem } = useCart()
  const { isAuthenticated, checkAuth } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [cartMessage, setCartMessage] = useState('')

  // Fetch categories on mount
  useEffect(() => {
    void fetchCategories()
    void checkAuth()
  }, [fetchCategories, checkAuth])

  // Fetch products when filters change
  useEffect(() => {
    const priceRange = priceRanges.find(r => r.id === selectedPriceRange)
    const params: Record<string, unknown> = {
      page: currentPage,
      limit: 12,
    }
    if (searchQuery !== '') params.search = searchQuery
    if (selectedCategory !== '') params.categoryId = selectedCategory
    if (priceRange !== null && priceRange !== undefined && priceRange.id !== 'all') {
      params.minPrice = priceRange.min
      params.maxPrice = priceRange.max
    }
    void fetchProducts(params as Parameters<typeof fetchProducts>[0])
  }, [selectedCategory, selectedPriceRange, sortBy, searchQuery, currentPage, fetchProducts])

  const handleAddToCart = useCallback(
    (productId: string): void => {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }

      void (async () => {
        const response = await addItem(productId, 1)
        if (response.success === true) {
          setCartMessage('Produk berhasil ditambahkan ke keranjang!')
          router.push('/cart')
        } else {
          setCartMessage('Gagal menambahkan ke keranjang. Silakan coba lagi.')
        }
      })()
    },
    [addItem, router, isAuthenticated]
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
            Semua Produk
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Temukan produk terbaik dari berbagai toko terpercaya
          </p>
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          {showFilters ? (
            <aside className="lg:w-64 space-y-6">
              {/* Categories */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
                  Kategori
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === ''
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex justify-between items-center ${
                        selectedCategory === cat.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {typeof cat._count?.products === 'number' && cat._count.products > 0 ? (
                        <span className="text-xs text-slate-400">{cat._count.products}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
                  Rentang Harga
                </h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPriceRange(range.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedPriceRange === range.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
                  Urutkan
                </h3>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        sortBy === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          ) : null}

          {/* Products Grid */}
          <main className="flex-1">
            {/* Cart Message */}
            {cartMessage !== '' ? (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  cartMessage.includes('berhasil')
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}
              >
                {cartMessage}
              </div>
            ) : null}

            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">
                Menampilkan{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {products.length}
                </span>{' '}
                produk
              </p>
            </div>

            {loading === true ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${String(i)}`} className="animate-pulse">
                    <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-64 mb-4" />
                    <div className="bg-slate-200 dark:bg-slate-700 rounded h-4 mb-2" />
                    <div className="bg-slate-200 dark:bg-slate-700 rounded h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Tidak ada produk
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map(product => (
                  <ProductCardItem
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 ? (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={`page-${String(page)}`}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set('page', page.toString())
                        router.push(`/products?${params.toString()}`)
                      }}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  )
}
