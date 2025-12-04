'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useProductRating } from '@/hooks'
import type { Product } from '@/types'

// ============================================================================
// CONSTANTS - UI Configuration (tidak ada logika bisnis)
// ============================================================================

const categoryEmojis: Record<string, string> = {
  elektronik: '📱',
  phones: '📱',
  'smart-watches': '⌚',
  cameras: '📷',
  headphones: '🎧',
  computers: '💻',
  gaming: '🎮',
  fashion: '👕',
  'makanan-minuman': '🍔',
  kesehatan: '💊',
  olahraga: '⚽',
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  phones: { bg: 'bg-blue-100', text: 'text-blue-600' },
  'smart-watches': { bg: 'bg-purple-100', text: 'text-purple-600' },
  cameras: { bg: 'bg-orange-100', text: 'text-orange-600' },
  headphones: { bg: 'bg-rose-100', text: 'text-rose-600' },
  computers: { bg: 'bg-gray-100', text: 'text-gray-600' },
  gaming: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
}

// ============================================================================
// PROPS INTERFACES
// ============================================================================

interface FeaturedProductsProps {
  products: Product[]
}

interface ProductCardProps {
  product: Product
  index: number
}

// ============================================================================
// PRODUCT CARD - Pure UI Component with hooks
// ============================================================================

function ProductCard({ product, index }: ProductCardProps): React.JSX.Element {
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Business logic extracted to custom hook
  const { rating, reviews } = useProductRating(product.id, index)
  
  const categorySlug = product.category?.slug ?? ''
  const emoji = categoryEmojis[categorySlug] ?? '📦'
  const colors = categoryColors[categorySlug] ?? { bg: 'bg-gray-100', text: 'text-gray-600' }

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.image !== null && product.image !== '' && !imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-7xl transition-all duration-500 ${isHovered ? 'scale-125 rotate-12' : 'scale-100'}`}>
              {emoji}
            </span>
          </div>
        )}

        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Category Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
            {product.category?.name ?? 'Product'}
          </span>
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:bg-white hover:text-red-500 shadow-md'
            }`}
            aria-label="Add to wishlist"
          >
            <svg
              className="w-5 h-5"
              fill={isLiked ? 'currentColor' : 'none'}
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

        {/* Quick Actions on Hover */}
        <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl text-center hover:bg-gray-800 transition-colors shadow-lg"
          >
            Beli Sekarang
          </Link>
          <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>

        {/* Stock Badge */}
        {product.stock < 10 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
            Stok Terbatas!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Store Name */}
        {product.store && (
          <p className="text-xs text-gray-400 mb-1 font-medium">{product.store.name}</p>
        )}
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
          <span className="text-xs text-gray-400">({reviews} ulasan)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">
            ${product.price.toLocaleString('en-US')}
          </p>
          <Link
            href={`/product/${product.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Detail
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProducts({ products }: FeaturedProductsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'featured'>('new')

  const tabs = [
    { id: 'new' as const, label: 'Terbaru', icon: '✨' },
    { id: 'bestseller' as const, label: 'Terlaris', icon: '🔥' },
    { id: 'featured' as const, label: 'Pilihan', icon: '⭐' },
  ]

  if (products.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-16 text-center">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Produk</h3>
            <p className="text-gray-500">Produk akan segera tersedia</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full mb-3">
              PRODUK UNGGULAN
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Produk Pilihan Terbaik
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Koleksi produk berkualitas dengan harga terbaik untuk kamu
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Lihat Semua Produk
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
