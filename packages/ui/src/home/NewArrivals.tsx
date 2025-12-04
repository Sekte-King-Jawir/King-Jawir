'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
  store: {
    id: string
    name: string
  } | null
}

interface NewArrivalsProps {
  products: Product[]
}

const categoryEmojis: Record<string, string> = {
  phones: '📱',
  'smart-watches': '⌚',
  cameras: '📷',
  headphones: '🎧',
  computers: '💻',
  gaming: '🎮',
}

export default function NewArrivals({ products }: NewArrivalsProps): React.JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (products.length === 0) {
    return <div className="hidden" />
  }

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full mb-3">
              <span className="animate-pulse">✨</span> BARU DATANG
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Produk Terbaru</h2>
            <p className="text-gray-500 mt-2">Koleksi terbaru yang baru saja hadir di toko kami</p>
          </div>
          <Link
            href="/product?sort=newest"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
          >
            Lihat Semua
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {products.slice(0, 5).map((product, index) => {
            const emoji = categoryEmojis[product.category?.slug ?? ''] ?? '📦'
            const isHovered = hoveredId === product.id
            const isNew = index < 2

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden transition-all duration-500 ${isHovered ? 'shadow-2xl -translate-y-2' : 'shadow-md'}`}
                >
                  {/* New Badge */}
                  {isNew && (
                    <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-lg">
                      BARU
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="aspect-square p-6 flex items-center justify-center relative">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span
                        className={`text-6xl transition-all duration-500 ${isHovered ? 'scale-125 rotate-12' : 'scale-100'}`}
                      >
                        {emoji}
                      </span>
                    )}

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <button className="w-full py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 pt-0">
                    <p className="text-xs text-gray-400 mb-1">{product.store?.name ?? 'Store'}</p>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ${product.price.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
