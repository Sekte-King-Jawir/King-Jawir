'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useOrders } from '@/hooks'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order, OrderStatus, OrderItem } from '@/types'

function OrderHistoryContent(): React.JSX.Element {
  const searchParams = useSearchParams()
  const showSuccess = searchParams.get('success') === 'true'

  const { orders, loading: isLoading, error, fetchOrders } = useOrders()
  const [successMessage, setSuccessMessage] = useState(
    showSuccess ? 'Pesanan berhasil dibuat!' : ''
  )

  useEffect(() => {
    void fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    if (successMessage !== '') {
      const timer = setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [successMessage])

  const getStatusBadge = (status: OrderStatus): React.JSX.Element => {
    const styles: Record<OrderStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      DONE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
    const labels: Record<OrderStatus, string> = {
      PENDING: 'Menunggu Pembayaran',
      PAID: 'Dibayar',
      SHIPPED: 'Dikirim',
      DONE: 'Selesai',
      CANCELLED: 'Dibatalkan',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <>
      {successMessage !== '' && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 flex items-center gap-2">
          <span className="text-xl">✅</span>
          {successMessage}
        </div>
      )}

      {error !== '' && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Belum Ada Pesanan
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Anda belum melakukan pemesanan apapun
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    #{order.id.slice(0, 8)}
                  </p>
                </div>
                <div className="flex items-center gap-3">{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0 relative">
                      {item.product.image !== null && item.product.image !== '' ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-slate-900 dark:text-white hover:text-blue-600 truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/30 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium">{order.items.length} item</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default function OrderHistoryPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Riwayat Pesanan</h1>

        <Suspense fallback={<LoadingSkeleton />}>
          <OrderHistoryContent />
        </Suspense>
      </main>
    </div>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-2xl h-48" />
      ))}
    </div>
  )
}
