import Link from 'next/link'

export function Navbar(): React.JSX.Element {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/price-analysis"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Analisis Harga
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
  )
}
