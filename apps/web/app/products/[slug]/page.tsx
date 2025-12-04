'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { ProductDetail, ProductApiResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'

export default function ProductDetailPage(): React.JSX.Element {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    async function fetchProduct(): Promise<void> {
      if (slug === '') return

      try {
        const res = await fetch(`${API_URL}/products/${slug}`)
        const data = (await res.json()) as ProductApiResponse

        if (data.success && data.data !== undefined) {
          setProduct(data.data.product)
        } else {
          setError(data.message ?? 'Produk tidak ditemukan')
        }
      } catch {
        setError('Gagal memuat produk')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProduct()
  }, [slug])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = async (): Promise<void> => {
    if (product === null) return

    setIsAddingToCart(true)
    setCartMessage('')

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      const data = (await res.json()) as { success: boolean; message: string }

      if (data.success) {
        setCartMessage('Berhasil ditambahkan ke keranjang!')
      } else {
        if (data.message?.includes('login') === true) {
          router.push('/auth/login')
          return
        }
        setCartMessage(data.message ?? 'Gagal menambah ke keranjang')
      }
    } catch {
      setCartMessage('Gagal menambah ke keranjang')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  if (error !== '' || product === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

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
              {product.image !== null && product.image !== '' ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
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
            {product.category !== null && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {product.name}
            </h1>

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
            {product.description !== null && product.description !== '' && (
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Deskripsi
                </h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Store Info */}
            <Link
              href={`/stores/${product.store.slug}`}
              className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-lg overflow-hidden shrink-0">
                {product.store.logo !== null && product.store.logo !== '' ? (
                  <Image
                    src={product.store.logo}
                    alt={product.store.name}
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
                <p className="font-medium text-slate-900 dark:text-white">
                  {product.store.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Kunjungi Toko →
                </p>
              </div>
            </Link>

            {/* Add to Cart */}
            {product.stock > 0 && (
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
                {cartMessage !== '' && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      cartMessage.includes('Berhasil')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {cartMessage}
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={() => void handleAddToCart()}
                  disabled={isAddingToCart}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isAddingToCart ? 'Menambahkan...' : '🛒 Tambah ke Keranjang'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function Navbar(): React.JSX.Element {
  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
            >
              Produk
            </Link>
            <Link
              href="/cart"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
            >
              🛒 Keranjang
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl" />
      <div className="space-y-6">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
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
