'use client'

import Link from 'next/link'

export default function PromoBanner(): React.JSX.Element {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 lg:p-16">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-10 right-20 w-20 h-20 border-4 border-white/20 rounded-full animate-bounce delay-500" />
        <div className="absolute bottom-10 left-20 w-16 h-16 bg-yellow-400/30 rounded-2xl rotate-45 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/20 rounded-full animate-ping" />

        <div className="relative grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="animate-bounce">🎉</span>
              <span className="text-white text-sm font-semibold">Promo Spesial Akhir Tahun</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Diskon Besar
              <br />
              <span className="text-yellow-300 drop-shadow-lg">Hingga 70%!</span>
            </h2>

            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto md:mx-0">
              Dapatkan produk impianmu dengan harga spesial. Promo terbatas hanya sampai akhir
              bulan!
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/product"
                className="group px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
              >
                Belanja Sekarang
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
              </Link>
              <Link
                href="/category"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Lihat Kategori
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center md:justify-start">
              <div>
                <p className="text-3xl font-black text-white">50K+</p>
                <p className="text-white/60 text-sm">Produk Tersedia</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">100K+</p>
                <p className="text-white/60 text-sm">Pelanggan Puas</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">4.9⭐</p>
                <p className="text-white/60 text-sm">Rating Toko</p>
              </div>
            </div>
          </div>

          {/* Featured Product */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-50 animate-pulse scale-125" />

              {/* Product Card */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 shadow-2xl">
                {/* Discount Badge */}
                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-red-500/30 animate-bounce">
                  -22%
                </div>

                <span className="text-8xl md:text-9xl block text-center">🎧</span>

                <div className="text-center mt-6">
                  <p className="text-white/60 text-sm mb-1">Apple</p>
                  <p className="text-white font-bold text-2xl mb-2">AirPods Max</p>
                  <p className="text-white/60 text-sm mb-4">High-Fidelity Audio Experience</p>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="text-4xl font-black text-yellow-300">$429</span>
                    <span className="text-white/60 line-through text-lg">$549</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg
                          key={star}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/60 text-sm">(2.5k reviews)</span>
                  </div>

                  <button className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg">
                    Add to Cart 🛒
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 animate-float">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="absolute -top-4 -left-8 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 animate-float delay-500">
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </section>
  )
}
