'use client'

import { type JSX } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface CheckoutSummaryProps {
  totalAmount: number
  isSubmitting: boolean
  onCheckout: () => void
  /** Currency format options */
  currencyOptions?:
    | {
        locale?: string
        currency?: string
      }
    | undefined
  /** Format price function */
  formatPrice?: (price: number, options?: { locale?: string; currency?: string }) => string
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CheckoutSummary({
  totalAmount,
  isSubmitting,
  onCheckout,
  currencyOptions = { locale: 'id-ID', currency: 'IDR' },
  formatPrice: customFormatPrice,
}: CheckoutSummaryProps): JSX.Element {
  const formatPrice =
    customFormatPrice ??
    ((price: number): string => {
      return new Intl.NumberFormat(currencyOptions.locale, {
        style: 'currency',
        currency: currencyOptions.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white">Ringkasan Pesanan</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Total Pembayaran</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatPrice(totalAmount)}
            </span>
          </div>

          <button
            onClick={onCheckout}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Memproses...
              </div>
            ) : (
              'Bayar Sekarang'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
