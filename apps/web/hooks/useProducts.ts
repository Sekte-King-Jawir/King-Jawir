import { useState, useCallback } from 'react'
import { productService, isApiError, type GetProductsParams } from '@/lib/api'
import type { Product } from '@/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchProducts = useCallback(async (params?: GetProductsParams) => {
    setLoading(true)
    setError(null)

    try {
      const response = await productService.getAll(params)

      if (response.success && response.data) {
        const productsList = response.data.products || response.data.items || []
        setProducts(productsList)
        setTotalPages(response.data.totalPages)
        setCurrentPage(response.data.page)
        setTotal(response.data.total)
      }

      return response
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to fetch products'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProductBySlug = useCallback(async (slug: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await productService.getBySlug(slug)
      return response
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to fetch product'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    fetchProducts,
    fetchProductBySlug,
  }
}
