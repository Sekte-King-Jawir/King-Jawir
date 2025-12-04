'use client'

import { useState, useCallback } from 'react'

interface UseWishlistReturn {
  wishlist: Set<string>
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string) => void
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  wishlistCount: number
}

/**
 * Custom hook untuk mengelola wishlist
 * Bisa dikembangkan untuk persist ke localStorage atau API
 */
export function useWishlist(): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.has(productId)
  }, [wishlist])

  const addToWishlist = useCallback((productId: string) => {
    setWishlist(prev => new Set(prev).add(productId))
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev)
      newSet.delete(productId)
      return newSet
    })
  }, [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }, [])

  const clearWishlist = useCallback(() => {
    setWishlist(new Set())
  }, [])

  return {
    wishlist,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount: wishlist.size,
  }
}
