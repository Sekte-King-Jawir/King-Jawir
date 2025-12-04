'use client'

import { useState, useEffect } from 'react'
import { adminApi, type Stats } from '@/lib/api/admin'
import { Card, Alert, LoadingSpinner, Badge } from '@/components/ui'

export default function OrdersPage(): React.ReactElement {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    void loadOrders()
  }, [])

  async function loadOrders(): Promise<void> {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.getStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (
    status: string
  ): 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' => {
    switch (status) {
      case 'DONE':
        return 'green'
      case 'PENDING':
        return 'yellow'
      case 'CANCELLED':
        return 'red'
      case 'SHIPPED':
        return 'blue'
      case 'PAID':
        return 'purple'
      default:
        return 'gray'
    }
  }

  const filteredOrders =
    stats?.recentOrders.filter(order => {
      if (statusFilter === 'all') return true
      return order.status === statusFilter
    }) ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      {error !== null && <Alert type="error" title="Error" message={error} />}

      {/* Order Statistics */}
      {stats !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <div className="p-6">
              <div className="text-sm font-medium text-gray-600">Total Orders</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                {stats.overview.totalOrders}
              </div>
            </div>
          </Card>
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <Card key={status}>
              <div className="p-6">
                <div className="text-sm font-medium text-gray-600">{status}</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{count}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="p-4 border-b">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DONE">DONE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {order.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing recent orders (limited to latest data from stats)
          </p>
        </div>
      </Card>
    </div>
  )
}
