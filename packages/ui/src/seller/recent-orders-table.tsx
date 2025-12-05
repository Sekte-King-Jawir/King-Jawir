'use client'

import Link from 'next/link'
import type { SellerOrder, SellerUrls } from '../types/index.js'

export interface RecentOrdersTableProps {
  orders: SellerOrder[]
  urls: SellerUrls
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
  PAID: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
  SHIPPED: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
  DONE: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
  CANCELLED: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Menunggu',
  PAID: 'Dibayar',
  SHIPPED: 'Dikirim',
  DONE: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

export function RecentOrdersTable({ orders, urls }: RecentOrdersTableProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="text-4xl mb-2">📋</div>
        <p className="text-slate-500 dark:text-slate-400">Belum ada pesanan masuk</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Pesanan Terbaru</h3>
        <Link
          href={urls.seller.orders}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    #{order.id.slice(-8)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(order.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-slate-900 dark:text-white">{order.user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{order.user.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatCurrency(order.total ?? order.totalAmount ?? 0)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
