'use client'

import Link from 'next/link'
import Image from 'next/image'

// Local type to match SellerProduct from hooks
interface SellerProductLocal {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  reviewCount: number
  createdAt: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface TopProductsCardProps {
  products: SellerProductLocal[]
}

export function TopProductsCard({ products }: TopProductsCardProps): React.JSX.Element {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Produk Populer
        </h3>
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-slate-500 dark:text-slate-400">Belum ada produk</p>
          <Link
            href="/seller/products"
            className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Tambah Produk →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Produk Populer</h3>
        <Link
          href="/seller/products"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Kelola Produk →
        </Link>
      </div>
      <div className="p-6 space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-400 dark:text-slate-500">
              #{index + 1}
            </span>
            {product.image !== null ? (
              <Image
                src={product.image}
                alt={product.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {product.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {product.category.name} • {product.reviewCount} ulasan
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
