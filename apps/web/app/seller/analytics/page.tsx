'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { SellerNavbar, SellerSidebar } from '@repo/ui'

export default function SellerAnalyticsPage(): React.JSX.Element {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeller, setIsSeller] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week')
  const [error, setError] = useState('')

  // URLs for navigation
  const urls = {
    home: '/',
    products: '/products',
    seller: {
      dashboard: '/seller/dashboard',
      store: '/seller/store',
      products: '/seller/products',
      orders: '/seller/orders',
      analytics: '/seller/analytics',
    },
    priceAnalysis: '/price-analysis',
  }

  // Check auth
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

  // Redirect if not seller
  useEffect(() => {
    if (!isLoading && user === null) {
      router.push('/auth/login?redirect=/seller/analytics')
    } else if (!isLoading && !isSeller) {
      router.push('/seller/store')
    }
  }, [isLoading, user, isSeller, router])

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || !isSeller) return

      try {
        const res = await fetch(`/api/seller/analytics?period=${period}`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setAnalyticsData(data.data)
            setError('')
          } else {
            setError(data.message)
          }
        } else {
          setError('Gagal memuat data analytics')
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setError('Terjadi kesalahan saat memuat data')
      }
    }

    void fetchAnalytics()
  }, [user, isSeller, period])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <SellerNavbar userName={user?.name} urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-8 ml-64">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              </div>
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl" />
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
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analitik Toko</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Lihat performa toko Anda dalam periode tertentu
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={period}
                  onChange={e => setPeriod(e.target.value as any)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day">Harian</option>
                  <option value="week">Mingguan</option>
                  <option value="month">Bulanan</option>
                </select>
              </div>
            </div>

            {/* Error message */}
            {error !== '' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Charts */}
            {analyticsData ? (
              <div className="space-y-8">
                {/* Revenue Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Pendapatan
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData.revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <YAxis
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8' }}
                          tickFormatter={value => `Rp${value.toLocaleString()}`}
                        />
                        <Tooltip
                          formatter={value => [`Rp${Number(value).toLocaleString()}`, 'Pendapatan']}
                          labelFormatter={label => `Tanggal: ${label}`}
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            borderColor: '#334155',
                            borderRadius: '0.5rem',
                          }}
                          itemStyle={{ color: '#f1f5f9' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#3b82f6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Jumlah Pesanan
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.orderData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            borderColor: '#334155',
                            borderRadius: '0.5rem',
                          }}
                          itemStyle={{ color: '#f1f5f9' }}
                        />
                        <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Product Performance */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Performa Produk
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Produk
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Terjual
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Pendapatan
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {analyticsData.productPerformance.map((product: any) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 text-right">
                              {product._count.orders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 text-right">
                              Rp{Number(product.revenue).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto" />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
