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

interface FeaturedProductsProps {
  products: Product[]
}

const categoryEmojis: Record<string, string> = {
  elektronik: '📱',
  fashion: '👕',
  'makanan-minuman': '🍔',
  kesehatan: '💊',
  olahraga: '⚽',
}

function ProductCard({ product }: { product: Product }): React.JSX.Element {
  const [imgError, setImgError] = useState(false)
  const emoji = categoryEmojis[product.category?.slug ?? ''] ?? '📦'

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 group hover:shadow-lg transition-all">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {product.image !== null && product.image !== '' && !imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform">{emoji}</span>
        )}
        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
          aria-label="Add to wishlist"
        >
          <svg
            className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
        {product.name}
      </h3>
      <p className="text-lg font-bold text-gray-900 mb-4">
        ${product.price.toLocaleString('en-US')}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/product/${product.slug}`}
          className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-xs font-medium rounded-lg text-center hover:bg-gray-800 transition-colors"
        >
          Buy Now
        </Link>
        <Link
          href={`/product/${product.slug}`}
          className="py-2.5 px-4 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          Details
        </Link>
      </div>
    </div>
  )
}

export default function FeaturedProducts({ products }: FeaturedProductsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'featured'>('new')

  if (products.length === 0) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-500">No products available</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-8 mb-8 border-b border-gray-100 pb-4">
          <button
            onClick={() => setActiveTab('new')}
            className={`text-sm font-medium pb-2 transition-all relative ${
              activeTab === 'new' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            New Arrival
            {activeTab === 'new' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bestseller')}
            className={`text-sm font-medium pb-2 transition-all relative ${
              activeTab === 'bestseller' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Bestseller
            {activeTab === 'bestseller' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`text-sm font-medium pb-2 transition-all relative ${
              activeTab === 'featured' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Featured Products
            {activeTab === 'featured' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
