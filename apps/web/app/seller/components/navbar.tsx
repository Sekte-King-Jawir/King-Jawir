'use client'

import Link from 'next/link'

interface NavbarProps {
  userName?: string | undefined
}

export function Navbar({ userName }: NavbarProps): React.JSX.Element {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <span className="font-bold text-xl text-slate-900 dark:text-white">King Jawir</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Seller Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
            >
              Marketplace
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {userName ?? 'Seller'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
