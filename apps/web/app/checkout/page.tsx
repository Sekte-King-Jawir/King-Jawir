'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart, useOrders } from '@/hooks'
import { formatPrice } from '@/lib/utils'
import {
  CheckoutCard,
  CheckoutSummary,
  CheckoutSkeleton
} from '@repo/ui'

export default function CheckoutPage(): React.JSX.Element {
  const router = useRouter()
  const { items: cartItems, loading: isLoading, fetchCart } = useCart()
  const { createOrder, loading: isSubmitting, error: orderError } = useOrders()

  const [error, setError] = useState('')

  // Fetch cart on mount
  useEffect(() => {
    void fetchCart()
  }, [fetchCart])

  useEffect(() => {
    if (orderError !== null && orderError !== '') {
      setError(orderError)
    }
  }, [orderError])

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleCheckout = async (): Promise<void> => {
    setError('')

    try {
      const order = await createOrder()
      if (order !== null) {
        // Redirect to orders page with success message
        router.push('/orders?success=true')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Terjadi kesalahan. Pastikan koneksi internet Anda stabil.')
    }
  }

  if (isLoading) {
    return <CheckoutSkeleton />
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

        {error !== '' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <CheckoutCard
              items={cartItems}
              imageComponent={Image}
              formatPrice={formatPrice}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              totalAmount={totalAmount}
              isSubmitting={isSubmitting}
              onCheckout={() => void handleCheckout()}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
