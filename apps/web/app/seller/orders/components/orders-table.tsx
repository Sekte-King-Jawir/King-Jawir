'use client'

import Image from 'next/image'
import type { SellerOrder } from '../types'

interface OrdersTableProps {
  orders: SellerOrder[]
  onUpdateStatus: (order: SellerOrder) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  PAID: { label: 'Sudah Dibayar', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
  SHIPPED: { label: 'Dikirim', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
  DELIVERED: { label: 'Selesai', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
}

export function OrdersTable({
  orders,
  onUpdateStatus,
  page,
  totalPages,
  onPageChange,
}: OrdersTableProps): React.JSX.Element {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Belum Ada Pesanan
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Pesanan dari pelanggan akan muncul di sini
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Order Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.color ?? ''}`}
              >
                {statusLabels[order.status]?.label ?? order.status}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900 dark:text-white">
                {formatPrice(order.totalAmount)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {order.items.length} item
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm">
              <span className="text-slate-500 dark:text-slate-400">Pembeli: </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {order.user.name}
              </span>
              <span className="text-slate-400 dark:text-slate-500"> ({order.user.email})</span>
            </p>
            {order.shippingAddress !== undefined && order.shippingAddress !== null && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                📍 {order.shippingAddress}
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="px-6 py-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
                  {item.product.image !== null && item.product.image !== '' ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatPrice(item.quantity * item.price)}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => onUpdateStatus(order)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Update Status
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
