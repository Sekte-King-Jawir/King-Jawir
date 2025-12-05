 'use client'

import type { JSX } from 'react'

export interface CartSummaryProps {
  totalAmount: number
  isSubmitting: boolean
  onCheckout: () => Promise<void>
  formatPrice?: (price: number) => string
}

export function CartSummary({ totalAmount, isSubmitting, onCheckout, formatPrice }: CartSummaryProps): JSX.Element {
  const localFormatPrice = (price: number): string => {
    if (formatPrice) return formatPrice(price)
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
      price
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ringkasan Pesanan</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Subtotal:</span>
          <span>{localFormatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Ongkir:</span>
          <span>Gratis</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white">
          <span>Total:</span>
          <span>{localFormatPrice(totalAmount)}</span>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        onClick={() => void onCheckout()}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
      </button>
    </div>
  )
}

export default CartSummary
