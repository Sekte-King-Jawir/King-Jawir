import Image from 'next/image'
import Link from 'next/link'
import type { Store } from '../../types'

interface StoreHeaderProps {
  store: Store
}

export function StoreHeader({ store }: StoreHeaderProps): React.JSX.Element {
  const memberSince = new Date(store.createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Store Logo */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
          {store.logo !== null && store.logo !== '' ? (
            <Image
              src={store.logo}
              alt={store.name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl">🏪</span>
          )}
        </div>

        {/* Store Info */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {store.name}
          </h1>

          {store.description !== null && store.description !== '' ? (
            <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {store.description}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span>📦</span>
              <span>{store.productCount} Produk</span>
            </div>
            {store.owner?.name !== undefined ? (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span>👤</span>
                <span>{store.owner.name}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span>📅</span>
              <span>Bergabung {memberSince}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0">
          <Link
            href="/price-analysis"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors text-center"
          >
            🔍 Analisis Harga
          </Link>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm transition-colors">
            💬 Chat Penjual
          </button>
        </div>
      </div>
    </div>
  )
}
