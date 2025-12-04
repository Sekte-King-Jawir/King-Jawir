'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HeroSection(): React.JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      tag: 'Promo Spesial',
      title: 'Diskon',
      titleBold: '50%',
      description: 'Temukan produk berkualitas dengan harga terbaik. Promo terbatas untuk member!',
      bgColor: 'bg-gradient-to-br from-violet-600 to-indigo-700',
    },
    {
      tag: 'Gratis Ongkir',
      title: 'Seluruh',
      titleBold: 'Indonesia',
      description: 'Nikmati gratis ongkir untuk semua pesanan tanpa minimum belanja.',
      bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      tag: 'Flash Sale',
      title: 'Hanya',
      titleBold: 'Hari Ini',
      description: 'Jangan lewatkan penawaran spesial dengan diskon gila-gilaan!',
      bgColor: 'bg-gradient-to-br from-orange-500 to-rose-600',
    },
  ] as const

  const currentSlideData = slides[currentSlide] ?? slides[0]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="w-full">
      {/* Hero Banner */}
      <div className={`relative min-h-[480px] ${currentSlideData.bgColor} transition-all duration-500`}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                ✨ {currentSlideData.tag}
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {currentSlideData.title}{' '}
                <span className="block">{currentSlideData.titleBold}</span>
              </h1>
              
              <p className="text-white/90 text-lg max-w-md mx-auto lg:mx-0 mb-8">
                {currentSlideData.description}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Belanja Sekarang
                </Link>
                <Link
                  href="/categories"
                  className="px-8 py-3.5 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Lihat Kategori
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-white/80 text-sm">Produk</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-white/80 text-sm">Pelanggan</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">99%</div>
                <div className="text-white/80 text-sm">Rating</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-2 justify-center mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
