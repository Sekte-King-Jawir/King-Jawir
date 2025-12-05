'use client'

import Image from 'next/image'
import type { SellerOrder } from '../types/index.js'

export interface OrdersTableProps {
  orders: SellerOrder[]
  onUpdateStatus: (order: SellerOrder) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
  PAID: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
  SHIPPED: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
  DONE: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Menunggu Pembayaran',
  PAID: 'Sudah Dibayar',
  SHIPPED: 'Dikirim',
  DONE: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

export function OrdersTable({
  orders,
  onUpdateStatus,
  page,
  totalPages,
  onPageChange,
}: OrdersTableProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Pelanggan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {orders.map(order => (
              <tr
                key={order.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {/* Order Info */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    #{order.id.slice(-8)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(order.createdAt)}
                  </div>
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900 dark:text-white">{order.user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {order.user.email}
                  </div>
                </td>

                {/* Products */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {order.items.slice(0, 2).map(item => (
                      <div
                        key={item.id}
                        className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden"
                      >
                        {item.product.image !== null && item.product.image !== '' ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm">
                            📦
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        +{order.items.length - 2} lainnya
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>

                {/* Total */}
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(order.total ?? order.totalAmount ?? 0)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onUpdateStatus(order)}
                    className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
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
