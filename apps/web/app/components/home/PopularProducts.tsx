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
  category?: {
    id: string
    name: string
    slug: string
  } | null
  store?: {
    id: string
    name: string
  } | null
}

interface PopularProductsProps {
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

export default function PopularProducts({ products }: PopularProductsProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!products || products.length === 0) {
    return <div className="hidden" />
  }

  const featuredProduct = products[activeIndex] ?? products[0]
  const emoji = categoryEmojis[featuredProduct?.category?.slug ?? ''] ?? '📦'

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full mb-4">
            <span className="animate-pulse">🔥</span> PALING POPULER
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
            Produk Terlaris Minggu Ini
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Produk-produk favorit yang paling banyak dibeli oleh pelanggan kami
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Featured Product */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[2rem] p-8 lg:p-12 border border-white/10">
              {/* Rank Badge */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30 rotate-12">
                <span className="text-2xl font-black text-white">#{activeIndex + 1}</span>
              </div>

              {/* Product Display */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl scale-75" />
                  {featuredProduct?.image ? (
                    <div className="relative w-48 h-48 mx-auto">
                      <Image
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="relative text-[10rem] block animate-float">{emoji}</span>
                  )}
                </div>

                <span className="inline-block px-3 py-1 bg-white/10 text-gray-300 text-xs font-medium rounded-full mb-3">
                  {featuredProduct?.category?.name ?? 'Product'}
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {featuredProduct?.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {featuredProduct?.store?.name ?? 'Official Store'}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white/60 text-sm">(1.2k sold)</span>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-4xl font-black text-white">
                    ${featuredProduct?.price?.toLocaleString('en-US')}
                  </span>
                </div>

                <div className="flex gap-3 justify-center">
                  <Link
                    href={`/product/${featuredProduct?.slug}`}
                    className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30"
                  >
                    Beli Sekarang
                  </Link>
                  <button className="px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                    🛒
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-4">
            {products.slice(0, 5).map((product, index) => {
              const productEmoji = categoryEmojis[product.category?.slug ?? ''] ?? '📦'
              const isActive = index === activeIndex

              return (
                <button
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isActive ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Image */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-3xl">{productEmoji}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {product.name}
                    </h4>
                    <p className="text-gray-500 text-sm">{product.category?.name}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className={`font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      ${product.price.toLocaleString('en-US')}
                    </p>
                    <p className="text-green-400 text-xs">In Stock</p>
                  </div>

                  {/* Arrow */}
                  <svg className={`w-5 h-5 transition-transform ${isActive ? 'text-purple-400 translate-x-1' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
