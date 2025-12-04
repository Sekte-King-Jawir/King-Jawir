import { useState, useCallback } from 'react'
import { orderService, isApiError } from '@/lib/api'
import type { Order } from '@/types'

interface UseOrdersReturn {
  orders: Order[]
  order: Order | null
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  fetchOrderById: (id: string) => Promise<void>
  createOrder: () => Promise<Order | null>
}

/**
 * Custom hook for order management
 * Handles order history, order details, and order creation (checkout)
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
      const response = await orderService.getAll()
      if (response.success === true && response.data !== undefined && response.data !== null) {
        // API returns orders in data with pagination info
        const ordersData = (response.data as unknown as { orders: Order[] }).orders
        setOrders(ordersData ?? [])
      }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to fetch orders'
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
      const response = await orderService.getById(id)
      if (response.success === true && response.data !== undefined && response.data !== null) {
        setOrder(response.data.order)
      }
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to fetch order'
      setError(message)
      console.error('Fetch order error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createOrder = useCallback(async (): Promise<Order | null> => {
    setLoading(true)
    setError(null)
    try {
      // API checkout takes items from cart automatically
      const response = await orderService.checkout()
      if (response.success === true && response.data !== undefined && response.data !== null) {
        // Refresh orders list after creating
        await fetchOrders()
        return response.data
      }
      return null
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to create order'
      setError(message)
      console.error('Create order error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchOrders])

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
