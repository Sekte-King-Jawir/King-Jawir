'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { formatPrice as formatPriceFn } from '@/lib/utils'
import { API_CONFIG } from '@/lib/config/api'
import { ReviewSection } from '@repo/ui'
import type { Product } from '@/types'

// Import hooks langsung dari file untuk menghindari barrel export pollution
import { useCart as useCartHook } from '@/hooks/useCart'
import { useProduct as useProductHook } from '@/hooks/useProduct'
import { useProductRating as useProductRatingHook } from '@/hooks/useProductRating'

// Type definitions untuk hooks
interface CartResponse {
  success: boolean
  message?: string
}

interface UseCartResult {
  addItem: (productId: string, quantity?: number) => Promise<CartResponse>
  loading: boolean
}

interface UseProductResult {
  product: Product | null
  isLoading: boolean
  error: string
}

interface UseProductRatingResult {
  rating: number
  totalReviews: number
  isLoading: boolean
}

// Wrapper functions dengan explicit types
function useProduct(slug: string): UseProductResult {
  return useProductHook(slug) as unknown as UseProductResult
}

function useCart(): UseCartResult {
  return useCartHook() as unknown as UseCartResult
}

function useProductRating(slug: string): UseProductRatingResult {
  return useProductRatingHook(slug) as unknown as UseProductRatingResult
}

// Format price wrapper
function formatPrice(amount: number): string {
  return (formatPriceFn as (n: number) => string)(amount)
}

export default function ProductDetailPage(): React.JSX.Element {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  // Hooks
  const { product, isLoading, error } = useProduct(slug)
  const { addItem, loading: cartLoading } = useCart()
  const { rating, totalReviews, isLoading: ratingLoading } = useProductRating(slug)

  // Local state
  const [quantity, setQuantity] = useState(1)
  const [cartMessage, setCartMessage] = useState('')

  const handleAddToCart = async (): Promise<void> => {
    if (product === null) return

    setCartMessage('')
    const response = await addItem(product.id, quantity)

    if (response.success === true) {
      setCartMessage('Berhasil ditambahkan ke keranjang!')
      setTimeout(() => router.push('/cart'), 1500)
    } else {
      setCartMessage('Gagal menambah ke keranjang. Silakan login terlebih dahulu.')
    }
  }

  // Loading state
  if (isLoading === true) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  // Error state
  if (error !== '' || product === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Produk Tidak Ditemukan
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              ← Kembali ke Produk
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Extract values with proper null checks
  const productImage = product.image
  const categorySlug = product.category?.slug ?? ''
  const categoryName = product.category?.name ?? ''
  const storeLogo = product.store?.logo ?? null
  const storeName = product.store?.name ?? ''
  const storeSlug = product.store?.slug ?? ''

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-blue-600">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">
            Produk
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="aspect-square relative">
              {productImage !== null && productImage !== undefined && productImage !== '' ? (
                <Image src={productImage} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                  <span className="text-8xl">📦</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {categorySlug !== '' && categoryName !== '' ? (
              <Link
                href={`/products?category=${categorySlug}`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
              >
                {categoryName}
              </Link>
            ) : null}

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{product.name}</h1>

            {/* Rating from Hook */}
            <div className="flex items-center gap-2">
              {ratingLoading === true ? (
                <div className="animate-pulse flex items-center gap-2">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= Math.round(rating)
                            ? 'text-yellow-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">
                    {rating.toFixed(1)} ({totalReviews} ulasan)
                  </span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(product.price)}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 dark:text-green-400">
                    Stok tersedia ({product.stock})
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-600 dark:text-red-400">Stok habis</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description !== null &&
            product.description !== undefined &&
            product.description !== '' ? (
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Deskripsi
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            ) : null}

            {/* Store Info */}
            {storeSlug !== '' && storeName !== '' ? (
              <Link
                href={`/stores/${storeSlug}`}
                className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-lg overflow-hidden shrink-0">
                  {storeLogo !== null && storeLogo !== '' ? (
                    <Image
                      src={storeLogo}
                      alt={storeName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🏪
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{storeName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Kunjungi Toko →</p>
                </div>
              </Link>
            ) : null}

            {/* Add to Cart */}
            {product.stock > 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-slate-700 dark:text-slate-300">Jumlah:</span>
                  <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 min-w-[50px] text-center text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>

                {/* Message */}
                {cartMessage !== '' ? (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      cartMessage.includes('Berhasil')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {cartMessage}
                  </div>
                ) : null}

                {/* Button */}
                <button
                  onClick={() => void handleAddToCart()}
                  disabled={cartLoading === true}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartLoading === true ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection productSlug={slug} productId={product.id} apiBaseUrl={API_CONFIG.BASE_URL} />
      </main>
    </div>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl" />
      <div className="space-y-6">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </div>
      </div>
    </div>
  )
}
