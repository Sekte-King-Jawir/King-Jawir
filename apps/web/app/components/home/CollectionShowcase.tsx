'use client'

import Link from 'next/link'
import { collections } from '@/data/home'
import type { Collection } from '@/types'

// ============================================================================
// COLLECTION CARD - Pure UI Component
// ============================================================================

interface CollectionCardProps {
  collection: Collection
  index: number
}

function CollectionCard({ collection, index }: CollectionCardProps): React.JSX.Element {
  return (
    <Link
      href="/product"
      className={`group relative overflow-hidden rounded-3xl h-56 md:h-64 lg:h-72 bg-gradient-to-br ${collection.gradient} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />

      {/* Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />

      <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
        <span className="text-5xl md:text-6xl lg:text-7xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">
          {collection.emoji}
        </span>
        <div>
          <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-1">
            {collection.name}
          </h3>
          <p className="text-white/70 text-sm mb-1">{collection.description}</p>
          <p className="text-white/90 text-sm font-semibold">{collection.count} Produk</p>
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </Link>
  )
}

// ============================================================================
// MAIN COLLECTION SHOWCASE
// ============================================================================

export default function CollectionShowcase(): React.JSX.Element {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full mb-3">
            KOLEKSI SPESIAL
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Koleksi Pilihan 🛍️
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Temukan berbagai koleksi produk terbaik yang kami kurasi khusus untukmu
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
