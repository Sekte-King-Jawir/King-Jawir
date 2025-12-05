'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { SellerProduct, SellerUrls } from '../types/index.js'

export interface TopProductsCardProps {
  products: SellerProduct[]
  urls: SellerUrls
}

export function TopProductsCard({ products, urls }: TopProductsCardProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-slate-500 dark:text-slate-400">Belum ada produk</p>
        <Link
          href={urls.seller.products}
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Tambah Produk
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Produk Terlaris</h3>
        <Link
          href={urls.seller.products}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {products.map(product => (
          <div
            key={product.id}
            className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30"
          >
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
              {product.image !== null && product.image !== '' ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {product.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {product.category?.name ?? 'Tanpa kategori'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Stok: {product.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
