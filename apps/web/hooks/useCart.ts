import { useState, useCallback } from 'react'
import { cartService, isApiError } from '@/lib/api'
import type { CartItem } from '@/types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await cartService.getCart()

      if (response.success && response.data) {
        setItems(response.data.items)
        setTotalItems(response.data.totalItems)
        setTotalPrice(response.data.totalPrice)
      }

      return response
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to fetch cart'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      setLoading(true)
      setError(null)

      try {
        const response = await cartService.addItem({ productId, quantity })

        if (response.success) {
          await fetchCart() // Refresh cart
        }

        return response
      } catch (err) {
        const message = isApiError(err) ? err.message : 'Failed to add item'
        setError(message)
        return { success: false, message }
      } finally {
        setLoading(false)
      }
    },
    [fetchCart]
  )

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      setLoading(true)
      setError(null)

      try {
        const response = await cartService.updateQuantity(itemId, quantity)

        if (response.success) {
          await fetchCart() // Refresh cart
        }

        return response
      } catch (err) {
        const message = isApiError(err) ? err.message : 'Failed to update quantity'
        setError(message)
        return { success: false, message }
      } finally {
        setLoading(false)
      }
    },
    [fetchCart]
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await cartService.removeItem(itemId)

        if (response.success) {
          await fetchCart() // Refresh cart
        }

        return response
      } catch (err) {
        const message = isApiError(err) ? err.message : 'Failed to remove item'
        setError(message)
        return { success: false, message }
      } finally {
        setLoading(false)
      }
    },
    [fetchCart]
  )

  return {
    items,
    totalItems,
    totalPrice,
    loading,
    error,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
  }
}
