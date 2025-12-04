'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface CategorySectionProps {
  categories: Category[]
}

const categoryData: Record<string, { icon: string; gradient: string; bgColor: string }> = {
  phones: { icon: '📱', gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
  'smart-watches': { icon: '⌚', gradient: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
  cameras: { icon: '📷', gradient: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' },
  headphones: { icon: '🎧', gradient: 'from-rose-500 to-pink-500', bgColor: 'bg-rose-50' },
  computers: { icon: '💻', gradient: 'from-gray-600 to-gray-800', bgColor: 'bg-gray-100' },
  gaming: { icon: '🎮', gradient: 'from-indigo-500 to-purple-500', bgColor: 'bg-indigo-50' },
}

const defaultCategories = [
  {
    icon: '📱',
    label: 'Phones',
    slug: 'phones',
    count: 24,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: '⌚',
    label: 'Smart Watches',
    slug: 'smart-watches',
    count: 18,
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: '📷',
    label: 'Cameras',
    slug: 'cameras',
    count: 12,
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
  },
  {
    icon: '🎧',
    label: 'Headphones',
    slug: 'headphones',
    count: 32,
    gradient: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
  },
  {
    icon: '💻',
    label: 'Computers',
    slug: 'computers',
    count: 45,
    gradient: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-100',
  },
  {
    icon: '🎮',
    label: 'Gaming',
    slug: 'gaming',
    count: 28,
    gradient: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
  },
]

export default function CategorySection({ categories }: CategorySectionProps): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const displayCategories =
    categories.length > 0
      ? categories.map(cat => ({
          icon: categoryData[cat.slug]?.icon ?? '📦',
          label: cat.name,
          slug: cat.slug,
          count: cat.productCount ?? 0,
          gradient: categoryData[cat.slug]?.gradient ?? 'from-gray-500 to-gray-700',
          bgColor: categoryData[cat.slug]?.bgColor ?? 'bg-gray-50',
        }))
      : defaultCategories

  const scroll = (direction: 'left' | 'right'): void => {
    if (scrollRef.current !== null) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full mb-3">
              KATEGORI
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Jelajahi Berdasarkan Kategori
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Temukan produk impianmu dari berbagai kategori pilihan kami
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:shadow-xl transition-all border border-gray-100"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-gray-900 shadow-lg flex items-center justify-center text-white hover:bg-gray-800 hover:shadow-xl transition-all"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayCategories.map((category, index) => (
            <Link
              key={category.slug ?? index}
              href={`/category/${category.slug}`}
              className="group flex-shrink-0 snap-start"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`relative w-44 h-56 rounded-3xl overflow-hidden transition-all duration-500 ${
                  hoveredIndex === index ? 'scale-105 shadow-2xl' : 'shadow-lg'
                }`}
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 ${category.bgColor} transition-all duration-300`}
                />

                {/* Gradient Overlay on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 flex items-center justify-center mb-4">
                    <span className="text-6xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-lg">
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors duration-300 text-lg">
                    {category.label}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300 mt-1">
                    {category.count} Produk
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {/* View All Card */}
          <Link href="/category" className="group flex-shrink-0 snap-start">
            <div className="relative w-44 h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-lg">Lihat Semua</h3>
                <p className="text-sm text-gray-400 mt-1">Kategori Lainnya</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {displayCategories.slice(0, 5).map((cat, index) => (
            <div
              key={`dot-${cat.slug}-${index}`}
              className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-gray-900' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
