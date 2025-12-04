import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  storeName?: string | undefined
}

const menuItems = [
  { href: '/seller/store', label: 'Toko Saya', icon: '🏪' },
  { href: '/seller/products', label: 'Produk', icon: '📦' },
  { href: '/seller/orders', label: 'Pesanan', icon: '📋' },
  { href: '/seller/analytics', label: 'Analitik', icon: '📊' },
]

export function Sidebar({ storeName }: SidebarProps): React.JSX.Element {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-[calc(100vh-64px)] hidden md:block">
      {/* Store Info */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
            <span className="text-xl">🏪</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {storeName ?? 'Toko Anda'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Seller Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map(item => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          href="/price-analysis"
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          <span>🔍</span>
          <span>Analisis Harga</span>
        </Link>
      </div>
    </aside>
  )
}
