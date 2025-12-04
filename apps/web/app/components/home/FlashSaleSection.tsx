'use client'

import Link from 'next/link'
import { useCountdown } from '@/hooks'
import { flashDeals } from '@/data/home'
import type { FlashDeal } from '@/types'

// ============================================================================
// FLASH DEAL CARD - Pure UI Component
// ============================================================================

interface FlashDealCardProps {
  deal: FlashDeal
  index: number
}

function FlashDealCard({ deal, index }: FlashDealCardProps): React.JSX.Element {
  const maxStock = 1000
  const remaining = maxStock - deal.sold
  const soldPercentage = (deal.sold / maxStock) * 100

  return (
    <div
      className="group relative bg-white rounded-3xl p-5 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Discount Badge */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30 z-10">
        -{deal.discount}%
      </div>

      {/* Product Emoji */}
      <div className="h-32 md:h-40 flex items-center justify-center mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl" />
        <span className="relative text-6xl md:text-7xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {deal.emoji}
        </span>
      </div>

      {/* Info */}
      <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{deal.name}</h3>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Terjual {deal.sold}</span>
          <span>Tersisa {remaining}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000"
            style={{ width: `${soldPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl md:text-2xl font-black text-rose-600">${deal.price}</span>
        <span className="text-sm text-gray-400 line-through">${deal.originalPrice}</span>
      </div>

      <button className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/30 text-sm md:text-base">
        Beli Sekarang
      </button>
    </div>
  )
}

// ============================================================================
// COUNTDOWN DISPLAY - Pure UI Component
// ============================================================================

interface CountdownDisplayProps {
  formattedTime: {
    hours: string
    minutes: string
    seconds: string
  }
}

function CountdownDisplay({ formattedTime }: CountdownDisplayProps): React.JSX.Element {
  const timeItems = [
    { value: formattedTime.hours, label: 'Jam' },
    { value: formattedTime.minutes, label: 'Menit' },
    { value: formattedTime.seconds, label: 'Detik' },
  ]

  return (
    <div className="flex gap-3">
      {timeItems.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 md:p-5 min-w-[80px] md:min-w-[100px] text-center shadow-xl shadow-black/10"
        >
          <div className="text-3xl md:text-4xl font-black text-gray-900 tabular-nums">
            {item.value}
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN FLASH SALE SECTION
// ============================================================================

export default function FlashSaleSection(): React.JSX.Element {
  // Business logic extracted to custom hook
  const { formattedTime } = useCountdown({
    initialHours: 12,
    initialMinutes: 45,
    initialSeconds: 30,
  })

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="animate-pulse text-xl">⚡</span>
              <span className="text-white font-bold text-sm uppercase tracking-wider">
                Flash Sale
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3">
              Mega Deals! 🔥
            </h2>
            <p className="text-white/80 text-lg max-w-md">
              Diskon hingga 50% untuk produk pilihan. Buruan sebelum kehabisan!
            </p>
          </div>

          {/* Countdown - UI Component */}
          <CountdownDisplay formattedTime={formattedTime} />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {flashDeals.map((deal, index) => (
            <FlashDealCard key={deal.id} deal={deal} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            href="/product?sale=true"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Lihat Semua Promo
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
      </div>
    </section>
  )
}
