'use client'

import { useEffect, useState } from 'react'
import { adminApi, type Stats } from '@/lib/api/admin'
import Link from 'next/link'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  user: {
    name: string
    email: string
  }
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  totalSold: number | null
}

export default function AdminDashboard(): React.ReactElement {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void loadStats()
  }, [])

  async function loadStats(): Promise<void> {
    try {
      setLoading(true)
      const data = await adminApi.getStats()
      setStats(data)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load stats'
      // Check if it's an authentication error
      if (
        message.includes('Failed to fetch') ||
        message.includes('NetworkError') ||
        message.includes('Unauthorized')
      ) {
        setError('authentication_required')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error !== null && error.length > 0) {
    if (error === 'authentication_required') {
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-2xl mx-auto mt-20">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                <p className="text-gray-600">You need to login as admin to access this dashboard</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Default Admin Account:</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <strong>Email:</strong> admin@marketplace.com
                  </p>
                  <p>
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/admin/login"
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition-colors"
                >
                  Go to Login Page →
                </Link>
                <Link
                  href="/"
                  className="block w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 text-center font-medium rounded-lg transition-colors"
                >
                  Back to Home
                </Link>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> If you don&apos;t have an admin account, please run
                  database seed first:
                  <code className="block mt-1 text-xs bg-white px-2 py-1 rounded">
                    cd apps/api && bun prisma/seed.ts
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => void loadStats()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (stats === null) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Selamat datang di panel admin</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.overview.totalUsers} icon="👥" color="blue" />
          <StatCard
            title="Total Sellers"
            value={stats.overview.totalSellers}
            icon="🏪"
            color="green"
          />
          <StatCard
            title="Total Products"
            value={stats.overview.totalProducts}
            icon="📦"
            color="purple"
          />
          <StatCard
            title="Total Orders"
            value={stats.overview.totalOrders}
            icon="🛒"
            color="orange"
          />
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-4xl font-bold mt-2">
                Rp {stats.overview.totalRevenue.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="text-6xl">💰</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Orders by Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Orders by Status</h2>
            <div className="space-y-3">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{status}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                    {String(count)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/users"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                👥 Manage Users
              </Link>
              <button className="block w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                📦 Manage Products
              </button>
              <button className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                🛒 Manage Orders
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {order.total.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {product.image !== null && product.image.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-3">
                      <span className="text-gray-400 text-4xl">📦</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    🔥 {product.totalSold ?? 0} terjual
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function StatCard({ title, value, icon, color }: StatCardProps): React.ReactElement {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    PROCESS: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DONE: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] ?? 'bg-gray-100 text-gray-800'
}
