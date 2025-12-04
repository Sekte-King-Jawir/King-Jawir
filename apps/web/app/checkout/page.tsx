'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    image: string | null
    store: {
      id: string
      name: string
      slug: string
    }
  }
}

interface CartApiResponse {
  success: boolean
  message: string
  data?: {
    items: CartItem[]
    total: number
  }
}

export default function CheckoutPage(): React.JSX.Element {
  const router = useRouter()

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')

  useEffect(() => {
    async function fetchCart(): Promise<void> {
      try {
        const res = await fetch(`${API_URL}/cart`, {
          credentials: 'include',
        })
        const data = (await res.json()) as CartApiResponse

        if (data.success && data.data !== undefined) {
          setCartItems(data.data.items)
        } else {
          router.push('/auth/login')
        }
      } catch {
        setError('Gagal memuat keranjang')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCart()
  }, [router])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleCheckout = async (): Promise<void> => {
    if (shippingAddress.trim() === '') {
      setError('Alamat pengiriman wajib diisi')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          shippingAddress: shippingAddress.trim(),
        }),
      })

      const data = (await res.json()) as {
        success: boolean
        message: string
        data?: { order: { id: string } }
      }

      if (data.success) {
        router.push(`/orders?success=true`)
      } else {
        setError(data.message ?? 'Gagal membuat pesanan')
      }
    } catch {
      setError('Gagal membuat pesanan')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Keranjang Kosong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Tambahkan produk ke keranjang terlebih dahulu
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Lihat Produk
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Pesanan Anda ({cartItems.length} item)
                </h2>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {cartItems.map(item => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
                      {item.product.image !== null && item.product.image !== '' ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.quantity} x {formatPrice(item.product.price)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {item.product.store.name}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Alamat Pengiriman
              </h2>
              <textarea
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap pengiriman..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Ongkos Kirim</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {error !== '' && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={() => void handleCheckout()}
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
              </button>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                Dengan melakukan pemesanan, Anda menyetujui syarat dan ketentuan yang berlaku
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Navbar(): React.JSX.Element {
  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
          </Link>
          <Link
            href="/cart"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >
            ← Kembali ke Keranjang
          </Link>
        </div>
      </div>
    </nav>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-64" />
        <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-40" />
      </div>
      <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-64" />
    </div>
  )
}
