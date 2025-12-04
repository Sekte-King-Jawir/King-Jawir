'use client'

import { useMemo } from 'react'

interface ProductRating {
  rating: string
  reviews: number
}

/**
 * Custom hook untuk generate rating produk
 * Dalam real app, ini akan fetch dari API
 */
export function useProductRating(productId: string, index: number = 0): ProductRating {
  return useMemo(() => {
    // Generate consistent rating based on product id (deterministic)
    const idNum = parseInt(productId, 10) || index + 1
    const rating = (4.0 + (idNum % 10) / 10).toFixed(1)
    const reviews = 50 + ((idNum * 37) % 450)

    return { rating, reviews }
  }, [productId, index])
}
