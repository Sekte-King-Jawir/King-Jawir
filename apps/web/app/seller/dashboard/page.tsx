'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSellerDashboard, useSellerUrls } from '@/hooks'
import { SellerNavbar, SellerSidebar, StatsGrid, RecentOrdersTable, TopProductsCard } from '@repo/ui'

export default function SellerDashboardPage(): React.JSX.Element {
  const router = useRouter()
  const urls = useSellerUrls()
  const { user, isLoading: authLoading, isSeller } = useSellerAuth()
  const { stats, recentOrders, topProducts, isLoading, error, refresh } = useSellerDashboard()

  // Redirect if not seller
  useEffect(() => {
    if (!authLoading && user === null) {
      router.push('/auth/login?redirect=/seller')
    } else if (!authLoading && !isSeller) {
      router.push('/seller/store')
    }
  }, [authLoading, user, isSeller, router])

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <SellerNavbar userName={user?.name} urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-6 ml-64">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Not authorized
  if (user === null || !isSeller) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SellerNavbar userName={user.name} urls={urls} />
      <div className="flex">
        <SellerSidebar urls={urls} />
        <main className="flex-1 p-6 ml-64">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Dashboard Seller
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Selamat datang kembali, {user.name}! 👋
                </p>
              </div>
              <button
                onClick={() => void refresh()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Error message */}
          {error !== '' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="mb-6">
            <StatsGrid stats={stats} />
          </div>

          {/* Quick Actions */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/seller/products"
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors group"
            >
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Tambah Produk</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Kelola produk toko</p>
              </div>
            </Link>

            <Link
              href="/seller/orders"
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 transition-colors group"
            >
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Kelola Pesanan</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stats.pendingOrders} pesanan pending
                </p>
              </div>
            </Link>

            <Link
              href="/seller/analytics"
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors group"
            >
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Analitik</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Lihat performa toko</p>
              </div>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders - 2 columns */}
            <div className="lg:col-span-2">
              <RecentOrdersTable orders={recentOrders} urls={urls} />
            </div>

            {/* Top Products - 1 column */}
            <div>
              <TopProductsCard products={topProducts} urls={urls} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function useSellerAuth() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeller, setIsSeller] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setUser(data.data.user)
            setIsSeller(data.data.user.role === 'SELLER' || data.data.user.role === 'ADMIN')
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUser()
  }, [])

  return { user, isLoading, isSeller }
}