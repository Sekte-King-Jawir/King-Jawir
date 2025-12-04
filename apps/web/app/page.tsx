'use client'

import Link from 'next/link'

// ============================================================================
// LANDING PAGE - AI Price Analysis untuk UMKM
// ============================================================================

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <span className="animate-pulse">🤖</span>
            <span>Powered by AI Technology</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Analisis Harga Cerdas untuk{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              UMKM Indonesia
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
            Bandingkan harga produk Anda dengan kompetitor di Tokopedia secara real-time. Dapatkan
            rekomendasi harga optimal dari AI untuk meningkatkan daya saing bisnis Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/price-analysis"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
            >
              🚀 Mulai Analisis Harga
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
            >
              📦 Lihat Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Solusi lengkap untuk membantu UMKM menentukan strategi harga yang tepat
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Scraping Harga Real-time
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Ambil data harga kompetitor dari Tokopedia secara otomatis dan real-time untuk
                produk sejenis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Analisis AI
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                AI menganalisis data pasar dan memberikan rekomendasi harga optimal berdasarkan
                statistik kompetitor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Insight Bisnis
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Dapatkan insight tentang posisi harga Anda di pasar, apakah terlalu mahal, murah,
                atau sudah kompetitif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Cara Kerja
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Dalam 3 langkah mudah, dapatkan analisis harga lengkap untuk produk Anda
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Masukkan Nama Produk
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Ketik nama produk yang ingin Anda analisis, misalnya &quot;Sepatu Sneakers&quot;
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Sistem Scrape Data
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Sistem kami akan mengambil data harga dari Tokopedia secara real-time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Dapatkan Rekomendasi
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                AI memberikan analisis lengkap dan rekomendasi harga optimal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Produk Dianalisis</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">UMKM Terbantu</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Akurasi Data</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Real-time Update</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Siap Tingkatkan Daya Saing Bisnis Anda?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Mulai analisis harga sekarang dan temukan strategi pricing yang optimal untuk produk
            Anda.
          </p>
          <Link
            href="/price-analysis"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
          >
            <span>Coba Gratis Sekarang</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <span className="font-semibold text-slate-900 dark:text-white">King Jawir</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2024 King Jawir. Hackathon Project - AI untuk UMKM Indonesia
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Marketplace
            </Link>
            <Link
              href="/price-analysis"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Price Analysis
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
