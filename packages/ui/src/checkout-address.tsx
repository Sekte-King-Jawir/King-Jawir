'use client'

import { type JSX } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface CheckoutAddressProps {
  shippingAddress: string
  onShippingAddressChange: (address: string) => void
  error?: string
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CheckoutAddress({
  shippingAddress,
  onShippingAddressChange,
  error,
}: CheckoutAddressProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Alamat Pengiriman
        </h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="shipping-address"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Alamat Lengkap
            </label>
            <textarea
              id="shipping-address"
              value={shippingAddress}
              onChange={(e) => onShippingAddressChange(e.target.value)}
              placeholder="Masukkan alamat lengkap pengiriman..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                error
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {error ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}