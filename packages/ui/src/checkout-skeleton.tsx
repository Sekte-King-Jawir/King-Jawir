'use client'

import { type JSX } from 'react'

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export function CheckoutSkeleton(): JSX.Element {
  // Create static array of skeleton items with unique IDs to avoid array index in keys
  const skeletonItems = [{ id: 'cart-item-1' }, { id: 'cart-item-2' }, { id: 'cart-item-3' }]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-48 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {skeletonItems.map(item => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2 animate-pulse" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-1 animate-pulse" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse" />
                    </div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address and Summary Skeleton */}
          <div className="space-y-6">
            {/* Address Skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 animate-pulse" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2 animate-pulse" />
                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-36 animate-pulse" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
                  </div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
