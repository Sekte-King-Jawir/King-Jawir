import Image from 'next/image'
import Link from 'next/link'
import type { SellerStore } from '../../types'

interface StoreInfoCardProps {
  store: SellerStore
  onEdit: () => void
}

export function StoreInfoCard({ store, onEdit }: StoreInfoCardProps): React.JSX.Element {
  const memberSince = new Date(store.createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Informasi Toko</h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          ✏️ Edit
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo */}
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
            {store.logo !== null && store.logo !== '' ? (
              <Image
                src={store.logo}
                alt={store.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🏪</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Nama Toko
              </label>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{store.name}</p>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                URL Toko
              </label>
              <Link
                href={`/stores/${store.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                /stores/{store.slug}
              </Link>
            </div>

            {store.description !== null && store.description !== '' ? (
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Deskripsi
                </label>
                <p className="text-slate-600 dark:text-slate-400">{store.description}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {store.productCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Produk</div>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pesanan</div>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Review</div>
          </div>
          <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-sm font-medium text-slate-900 dark:text-white">{memberSince}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Bergabung</div>
          </div>
        </div>
      </div>
    </div>
  )
}
