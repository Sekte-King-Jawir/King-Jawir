import { useState, useCallback } from 'react'
import { orderService } from '@/lib/api'
import type { Order, CreateOrderData } from '@/types'

interface UseOrdersReturn {
  orders: Order[]
  order: Order | null
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  fetchOrderById: (id: string) => Promise<void>
  createOrder: (data: CreateOrderData) => Promise<Order | null>
}

/**
 * Custom hook for order management
 * Handles order history, order details, and order creation
 */
export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await orderService.getOrders()
      setOrders(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders'
      setError(message)
      console.error('Fetch orders error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOrderById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await orderService.getOrderById(id)
      setOrder(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order'
      setError(message)
      console.error('Fetch order error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createOrder = useCallback(
    async (data: CreateOrderData): Promise<Order | null> => {
      setLoading(true)
      setError(null)
      try {
        const newOrder = await orderService.createOrder(data)
        // Refresh orders list after creating
        await fetchOrders()
        return newOrder
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create order'
        setError(message)
        console.error('Create order error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [fetchOrders]
  )

  return {
    orders,
    order,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
  }
}
