'use client'

import { useState } from 'react'
import type { SellerOrder } from '../types'

interface UpdateStatusModalProps {
  order: SellerOrder
  onConfirm: (orderId: string, status: string) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

const statusOptions = [
  { value: 'PAID', label: 'Sudah Dibayar', description: 'Pembayaran telah dikonfirmasi' },
  { value: 'SHIPPED', label: 'Dikirim', description: 'Pesanan sedang dalam pengiriman' },
  { value: 'DELIVERED', label: 'Selesai', description: 'Pesanan telah diterima' },
  { value: 'CANCELLED', label: 'Batalkan', description: 'Batalkan pesanan ini' },
]

export function UpdateStatusModal({
  order,
  onConfirm,
  onCancel,
  isLoading,
}: UpdateStatusModalProps): React.JSX.Element {
  const [selectedStatus, setSelectedStatus] = useState('')

  // Filter available status transitions
  const availableStatuses = statusOptions.filter((opt) => {
    if (order.status === 'PENDING') {
      return opt.value === 'PAID' || opt.value === 'CANCELLED'
    }
    if (order.status === 'PAID') {
      return opt.value === 'SHIPPED' || opt.value === 'CANCELLED'
    }
    if (order.status === 'SHIPPED') {
      return opt.value === 'DELIVERED'
    }
    return false
  })

  const handleConfirm = async (): Promise<void> => {
    if (selectedStatus === '') return
    await onConfirm(order.id, selectedStatus)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Update Status Pesanan
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Order #{order.id.slice(0, 8)}
        </p>

        <div className="space-y-3 mb-6">
          {availableStatuses.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                selectedStatus === opt.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={selectedStatus === opt.value}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{opt.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{opt.description}</p>
              </div>
            </label>
          ))}
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
            onClick={() => void handleConfirm()}
            disabled={isLoading || selectedStatus === ''}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  )
}
