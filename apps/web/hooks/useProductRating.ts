'use client'

import { useState, useEffect, useCallback } from 'react'
import { API_CONFIG, API_ENDPOINTS } from '@/lib/config/api'

export interface ReviewStats {
  avgRating: number
  totalReviews: number
  distribution: Record<string, number>
}

interface ProductRatingResponse {
  success: boolean
  message: string
  data?: {
    reviews: unknown[]
    stats: ReviewStats
  }
}

interface UseProductRatingResult {
  rating: number
  totalReviews: number
  distribution: Record<string, number>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook untuk fetch rating produk dari API
 * @param productSlug - Slug produk untuk fetch review stats
 */
export function useProductRating(productSlug: string): UseProductRatingResult {
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRating = useCallback(async (): Promise<void> => {
    if (!productSlug) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REVIEWS.PRODUCT(productSlug)}?limit=1`
      )
      const data = (await res.json()) as ProductRatingResponse

      if (data.success && data.data) {
        setStats(data.data.stats)
      }
    } catch (err) {
      setError('Failed to fetch rating')
      console.error('Failed to fetch product rating:', err)
    } finally {
      setIsLoading(false)
    }
  }, [productSlug])

  useEffect(() => {
    void fetchRating()
  }, [fetchRating])

  return {
    rating: stats?.avgRating ?? 0,
    totalReviews: stats?.totalReviews ?? 0,
    distribution: stats?.distribution ?? {},
    isLoading,
    error,
    refetch: fetchRating,
  }
}
