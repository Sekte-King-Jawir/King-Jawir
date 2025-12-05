import { useState, useEffect } from 'react'
import type { SellerStats } from '@/types'

export function useSellerDashboard() {
  const [stats, setStats] = useState<SellerStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  })

  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/seller/dashboard', {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setStats(data.data.stats)
          setRecentOrders(data.data.recentOrders)
          setTopProducts(data.data.topProducts)
        } else {
          setError(data.message)
        }
      } else {
        setError('Gagal memuat data dashboard')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  return {
    stats,
    recentOrders,
    topProducts,
    isLoading,
    error,
    refresh,
  }
}
