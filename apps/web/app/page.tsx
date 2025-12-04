'use client'

import Link from 'next/link'

// ============================================================================
// LANDING PAGE - AI-Powered Price Analysis Platform
// ============================================================================

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span className="font-bold text-xl text-slate-900 dark:text-white">
                King Jawir AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/price-analysis"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
              >
                Coba Analisis
              </Link>
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 shadow-sm">
            <span className="animate-pulse">⚡</span>
            <span>AI-Powered Price Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Tentukan Harga{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
              Optimal
            </span>
            <br />
            dengan Kekuatan AI
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-4">
            Platform analisis harga berbasis Artificial Intelligence yang membantu UMKM Indonesia
            menentukan strategi pricing yang kompetitif dan menguntungkan.
          </p>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Scraping data real-time dari Tokopedia, analisis statistik mendalam, dan rekomendasi
            harga cerdas dari AI—semuanya dalam satu platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/price-analysis"
              className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
            >
              🚀 Analisis Sekarang
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
            >
              🛒 Coba Integrasi Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Teknologi AI yang Kami Gunakan
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Platform ini mengintegrasikan teknologi AI modern untuk memberikan analisis harga yang
            akurat dan actionable
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tech 1 */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🕷️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Web Scraping Engine
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Rust-powered headless browser untuk scraping data real-time dari Tokopedia dengan
                akurasi tinggi dan performa optimal.
              </p>
            </div>

            {/* Tech 2 */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Large Language Model
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                OpenAI-compatible AI model yang menganalisis data pasar, tren harga, dan memberikan
                rekomendasi strategis berbasis context.
              </p>
            </div>

            {/* Tech 3 */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-700">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Statistical Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Algoritma statistik untuk menghitung mean, median, quartile, dan confidence interval
                dari data kompetitor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Bagaimana AI Menganalisis Harga?
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Proses end-to-end dari input data hingga rekomendasi pricing strategy
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Input Produk & Harga
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Masukkan nama produk dan harga yang ingin Anda bandingkan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Web Scraping
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Rust scraper mengambil data harga kompetitor dari Tokopedia
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Statistical Processing
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sistem menghitung mean, median, Q1, Q3, dan outlier detection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                4
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                AI Recommendation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                LLM memberikan insight dan rekomendasi pricing strategy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-16 px-4 bg-linear-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-white mb-10">
            Mengapa Pilih King Jawir AI?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-2xl font-bold mb-2">Real-time</div>
              <div className="text-blue-100">
                Data diambil langsung dari marketplace tanpa cache
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-2xl font-bold mb-2">Akurat</div>
              <div className="text-blue-100">
                Algoritma statistik untuk analisis data yang presisi
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🤖</div>
              <div className="text-2xl font-bold mb-2">AI-Powered</div>
              <div className="text-blue-100">LLM memberikan insight kontekstual dan strategis</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🚀</div>
              <div className="text-2xl font-bold mb-2">Cepat</div>
              <div className="text-blue-100">Hasil analisis dalam hitungan detik via WebSocket</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Mulai Tentukan Harga Optimal dengan AI
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Tidak perlu riset manual lagi. Biarkan AI yang bekerja untuk Anda—analisis komprehensif
            dalam hitungan detik.
          </p>
          <Link
            href="/price-analysis"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
          >
            <span>🚀 Coba Analisis AI Sekarang</span>
            <span>→</span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
            Free to use • No credit card required • Instant results
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-semibold text-slate-900 dark:text-white">King Jawir AI</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2024 King Jawir AI. AI-Powered Price Analysis Platform for Indonesian SMEs
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/price-analysis"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              Try Analysis
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
