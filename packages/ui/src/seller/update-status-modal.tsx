'use client'

import { useState } from 'react'
import type { SellerOrder, OrderStatus } from '../types/index.js'

export interface UpdateStatusModalProps {
  order: SellerOrder
  onConfirm: (orderId: string, newStatus: string) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Menunggu Pembayaran' },
  { value: 'PAID', label: 'Sudah Dibayar' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'DONE', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
]

export function UpdateStatusModal({
  order,
  onConfirm,
  onCancel,
  isLoading,
}: UpdateStatusModalProps): React.JSX.Element {
  const [selectedStatus, setSelectedStatus] = useState<string>(order.status)

  const handleConfirm = (): void => {
    void onConfirm(order.id, selectedStatus)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Update Status Pesanan
          </h3>

          <div className="mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Order ID:{' '}
              <span className="font-medium text-slate-900 dark:text-white">
                #{order.id.slice(-8)}
              </span>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pelanggan:{' '}
              <span className="font-medium text-slate-900 dark:text-white">{order.user.name}</span>
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status Baru
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || selectedStatus === order.status}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
