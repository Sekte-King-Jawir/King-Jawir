'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from './components/Navbar'
import {
  HeroSection,
  CategorySection,
  FeaturedProducts,
  PromoBanner,
  NewArrivals,
  PopularProducts,
  Newsletter,
  Footer,
} from './components/home'

// ============================================================================
// DATA
// ============================================================================

const categories = [
  { id: '1', name: 'Phones', slug: 'phones', productCount: 24 },
  { id: '2', name: 'Smart Watches', slug: 'smart-watches', productCount: 18 },
  { id: '3', name: 'Cameras', slug: 'cameras', productCount: 12 },
  { id: '4', name: 'Headphones', slug: 'headphones', productCount: 32 },
  { id: '5', name: 'Computers', slug: 'computers', productCount: 45 },
  { id: '6', name: 'Gaming', slug: 'gaming', productCount: 28 },
]

const products = [
  {
    id: '1',
    name: 'Apple iPhone 14 Pro Max 128GB Deep Purple',
    slug: 'iphone-14-pro-max',
    price: 1099,
    stock: 10,
    image: null,
    category: { id: '1', name: 'Phones', slug: 'phones' },
    store: { id: '1', name: 'Apple Store' },
  },
  {
    id: '2',
    name: 'Apple Watch Series 8 GPS 41mm Starlight',
    slug: 'apple-watch-series-8',
    price: 399,
    stock: 15,
    image: null,
    category: { id: '2', name: 'Smart Watches', slug: 'smart-watches' },
    store: { id: '1', name: 'Apple Store' },
  },
  {
    id: '3',
    name: 'Samsung Galaxy S23 Ultra 256GB Phantom Black',
    slug: 'samsung-galaxy-s23-ultra',
    price: 1199,
    stock: 8,
    image: null,
    category: { id: '1', name: 'Phones', slug: 'phones' },
    store: { id: '2', name: 'Samsung Store' },
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    slug: 'sony-wh-1000xm5',
    price: 349,
    stock: 20,
    image: null,
    category: { id: '4', name: 'Headphones', slug: 'headphones' },
    store: { id: '3', name: 'Sony Store' },
  },
  {
    id: '5',
    name: 'MacBook Pro 14" M3 Pro 512GB Space Black',
    slug: 'macbook-pro-14-m3',
    price: 1999,
    stock: 5,
    image: null,
    category: { id: '5', name: 'Computers', slug: 'computers' },
    store: { id: '1', name: 'Apple Store' },
  },
  {
    id: '6',
    name: 'PlayStation 5 Console Digital Edition',
    slug: 'playstation-5-digital',
    price: 449,
    stock: 12,
    image: null,
    category: { id: '6', name: 'Gaming', slug: 'gaming' },
    store: { id: '4', name: 'Sony Store' },
  },
  {
    id: '7',
    name: 'Canon EOS R6 Mark II Mirrorless Camera',
    slug: 'canon-eos-r6-mark-ii',
    price: 2499,
    stock: 6,
    image: null,
    category: { id: '3', name: 'Cameras', slug: 'cameras' },
    store: { id: '5', name: 'Canon Store' },
  },
  {
    id: '8',
    name: 'AirPods Pro 2nd Gen with MagSafe Case',
    slug: 'airpods-pro-2',
    price: 249,
    stock: 30,
    image: null,
    category: { id: '4', name: 'Headphones', slug: 'headphones' },
    store: { id: '1', name: 'Apple Store' },
  },
]

// ============================================================================
// FLASH SALE SECTION - dengan countdown timer
// ============================================================================

function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const flashDeals = [
    { id: 1, name: 'iPad Pro M2', emoji: '📱', price: 999, originalPrice: 1199, discount: 17, sold: 234 },
    { id: 2, name: 'AirPods Max', emoji: '🎧', price: 429, originalPrice: 549, discount: 22, sold: 567 },
    { id: 3, name: 'GoPro Hero 11', emoji: '📷', price: 349, originalPrice: 499, discount: 30, sold: 189 },
    { id: 4, name: 'Nintendo Switch', emoji: '🎮', price: 279, originalPrice: 349, discount: 20, sold: 892 },
  ]

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
              <span className="text-white font-bold text-sm uppercase tracking-wider">Flash Sale</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3">
              Mega Deals! 🔥
            </h2>
            <p className="text-white/80 text-lg max-w-md">
              Diskon hingga 50% untuk produk pilihan. Buruan sebelum kehabisan!
            </p>
          </div>

          {/* Countdown */}
          <div className="flex gap-3">
            {[
              { value: timeLeft.hours, label: 'Jam' },
              { value: timeLeft.minutes, label: 'Menit' },
              { value: timeLeft.seconds, label: 'Detik' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 md:p-5 min-w-[80px] md:min-w-[100px] text-center shadow-xl shadow-black/10">
                <div className="text-3xl md:text-4xl font-black text-gray-900 tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {flashDeals.map((deal, index) => (
            <div
              key={deal.id}
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
                  <span>Tersisa {1000 - deal.sold}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(deal.sold / 1000) * 100}%` }}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// BRANDS SECTION
// ============================================================================

function BrandsSection() {
  const brands = [
    { name: 'Apple', emoji: '🍎' },
    { name: 'Samsung', emoji: '📱' },
    { name: 'Sony', emoji: '🎮' },
    { name: 'Microsoft', emoji: '💻' },
    { name: 'Google', emoji: '🔍' },
    { name: 'Nintendo', emoji: '🕹️' },
  ]

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400 text-sm font-semibold mb-8 uppercase tracking-widest">
          Brand Terpercaya & Official Partner
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 lg:gap-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl opacity-60 hover:opacity-100 hover:bg-gray-100 transition-all cursor-pointer group"
            >
              <span className="text-4xl md:text-5xl group-hover:scale-125 transition-transform duration-300">{brand.emoji}</span>
              <span className="text-lg md:text-xl font-bold text-gray-700 hidden sm:block">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// COLLECTION SHOWCASE
// ============================================================================

function CollectionShowcase() {
  const collections = [
    { id: 1, name: 'Trending', emoji: '🔥', count: 156, gradient: 'from-orange-500 to-red-500', description: 'Produk paling dicari' },
    { id: 2, name: 'New Arrival', emoji: '✨', count: 48, gradient: 'from-blue-500 to-cyan-400', description: 'Baru datang' },
    { id: 3, name: 'Best Seller', emoji: '⭐', count: 89, gradient: 'from-amber-500 to-yellow-400', description: 'Paling laris' },
    { id: 4, name: 'Sale', emoji: '🏷️', count: 234, gradient: 'from-green-500 to-emerald-400', description: 'Diskon spesial' },
  ]

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
          {collections.map((item, index) => (
            <Link
              key={item.id}
              href="/product"
              className={`group relative overflow-hidden rounded-3xl h-56 md:h-64 lg:h-72 bg-gradient-to-br ${item.gradient} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />
              
              {/* Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />

              <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
                <span className="text-5xl md:text-6xl lg:text-7xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">
                  {item.emoji}
                </span>
                <div>
                  <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-1">{item.name}</h3>
                  <p className="text-white/70 text-sm mb-1">{item.description}</p>
                  <p className="text-white/90 text-sm font-semibold">{item.count} Produk</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Budi Santoso',
      avatar: '👨',
      role: 'Pelanggan Setia',
      content: 'Pelayanan sangat memuaskan! Produk original dan pengiriman cepat. Pasti akan belanja lagi di sini.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Siti Rahma',
      avatar: '👩',
      role: 'Tech Enthusiast',
      content: 'Harga kompetitif dengan kualitas produk yang terjamin. Customer service juga sangat responsif.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Ahmad Fadli',
      avatar: '🧑',
      role: 'Gamer',
      content: 'Koleksi gaming gear-nya lengkap banget! Banyak promo menarik juga. Recommended!',
      rating: 5,
    },
  ]

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-600 text-xs font-semibold rounded-full mb-3">
            TESTIMONI
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Apa Kata Mereka? 💬
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ribuan pelanggan puas dengan layanan kami. Ini beberapa testimoni dari mereka.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <HeroSection />
        <BrandsSection />
        <CategorySection categories={categories} />
        <FlashSaleSection />
        <FeaturedProducts products={products} />
        <PromoBanner />
        <PopularProducts products={products} />
        <CollectionShowcase />
        <NewArrivals products={products} />
        <TestimonialsSection />
        <Newsletter />
        <Footer />
      </main>
    </>
  )
}
