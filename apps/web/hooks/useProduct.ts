import { useState, useEffect, useCallback } from 'react'
import { productService } from '@/lib/api'
import type { Product } from '@/types'

interface UseProductResult {
  product: Product | null
  isLoading: boolean
  error: string
  refetch: () => Promise<void>
}

export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProduct = useCallback(async (): Promise<void> => {
    if (slug === '') {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await productService.getBySlug(slug)
      if (response.success && response.data !== undefined && response.data !== null) {
        setProduct(response.data.product)
      } else {
        setError(response.message ?? 'Produk tidak ditemukan')
      }
    } catch {
      setError('Gagal memuat produk')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void fetchProduct()
  }, [fetchProduct])

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  }
}
