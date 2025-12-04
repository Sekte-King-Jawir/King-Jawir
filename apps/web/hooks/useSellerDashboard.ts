'use client'

import { useState, useEffect, useCallback } from 'react'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101') + '/api'

// Types
export interface SellerStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    image: string | null
  }
}

export interface SellerOrder {
  id: string
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED'
  total: number
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    address: string | null
  }
  items: OrderItem[]
}

export interface SellerProduct {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  reviewCount: number
  createdAt: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface OrdersApiResponse {
  success: boolean
  message: string
  data?: {
    orders: SellerOrder[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

interface ProductsApiResponse {
  success: boolean
  message: string
  data?: {
    products: SellerProduct[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

interface UseSellerDashboardReturn {
  stats: SellerStats
  recentOrders: SellerOrder[]
  topProducts: SellerProduct[]
  isLoading: boolean
  error: string
  refresh: () => Promise<void>
}

/**
 * Custom hook untuk mengambil data dashboard seller
 * Mengambil orders dan products untuk menghitung statistik
 */
export function useSellerDashboard(): UseSellerDashboardReturn {
  const [stats, setStats] = useState<SellerStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<SellerOrder[]>([])
  const [topProducts, setTopProducts] = useState<SellerProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      // Fetch all orders (with high limit to calculate stats)
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/seller/orders?page=1&limit=100`, {
          credentials: 'include',
        }),
        fetch(`${API_URL}/products/mine?page=1&limit=100`, {
          credentials: 'include',
        }),
      ])

      const ordersData = (await ordersRes.json()) as OrdersApiResponse
      const productsData = (await productsRes.json()) as ProductsApiResponse

      if (ordersData.success && ordersData.data !== undefined) {
        const orders = ordersData.data.orders

        // Calculate stats from orders
        let totalRevenue = 0
        let pendingOrders = 0
        let completedOrders = 0
        let cancelledOrders = 0

        orders.forEach(order => {
          // Calculate revenue from items (seller's portion)
          const orderRevenue = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )

          if (order.status === 'DONE') {
            totalRevenue += orderRevenue
            completedOrders++
          } else if (order.status === 'CANCELLED') {
            cancelledOrders++
          } else if (order.status === 'PENDING' || order.status === 'PAID') {
            pendingOrders++
          }
        })

        setStats(prev => ({
          ...prev,
          totalRevenue,
          totalOrders: ordersData.data?.pagination.total ?? 0,
          pendingOrders,
          completedOrders,
          cancelledOrders,
        }))

        // Get recent 5 orders
        setRecentOrders(orders.slice(0, 5))
      }

      if (productsData.success && productsData.data !== undefined) {
        setStats(prev => ({
          ...prev,
          totalProducts: productsData.data?.pagination.total ?? 0,
        }))

        // Sort products by reviewCount as proxy for popularity
        const sortedProducts = [...productsData.data.products].sort(
          (a, b) => b.reviewCount - a.reviewCount
        )
        setTopProducts(sortedProducts.slice(0, 5))
      }
    } catch {
      setError('Gagal memuat data dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchDashboardData()
  }, [fetchDashboardData])

  return {
    stats,
    recentOrders,
    topProducts,
    isLoading,
    error,
    refresh: fetchDashboardData,
  }
}

interface UseSellerAuthReturn {
  user: {
    id: string
    name: string
    email: string
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  } | null
  isLoading: boolean
  isAuthenticated: boolean
  isSeller: boolean
}

interface AuthMeResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      name: string
      email: string
      role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
    }
  }
}

/**
 * Custom hook untuk cek auth dan role seller
 */
export function useSellerAuth(): UseSellerAuthReturn {
  const [user, setUser] = useState<UseSellerAuthReturn['user']>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth(): Promise<void> {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include',
        })
        const data = (await res.json()) as AuthMeResponse

        if (data.success && data.data !== undefined) {
          setUser(data.data.user)
        }
      } catch {
        // Silent fail - user not authenticated
      } finally {
        setIsLoading(false)
      }
    }

    void checkAuth()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isSeller: user !== null && (user.role === 'SELLER' || user.role === 'ADMIN'),
  }
}
