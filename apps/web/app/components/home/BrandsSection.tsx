'use client'

import { brands } from '@/data/home'
import type { Brand } from '@/types'

// ============================================================================
// BRAND ITEM - Pure UI Component
// ============================================================================

interface BrandItemProps {
  brand: Brand
}

function BrandItem({ brand }: BrandItemProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-2xl opacity-60 hover:opacity-100 hover:bg-gray-100 transition-all cursor-pointer group">
      <span className="text-4xl md:text-5xl group-hover:scale-125 transition-transform duration-300">
        {brand.emoji}
      </span>
      <span className="text-lg md:text-xl font-bold text-gray-700 hidden sm:block">
        {brand.name}
      </span>
    </div>
  )
}

// ============================================================================
// MAIN BRANDS SECTION
// ============================================================================

export default function BrandsSection(): React.JSX.Element {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400 text-sm font-semibold mb-8 uppercase tracking-widest">
          Brand Terpercaya & Official Partner
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 lg:gap-16">
          {brands.map(brand => (
            <BrandItem key={brand.name} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}
