import { useState, useCallback } from 'react'
import { categoryService, isApiError } from '@/lib/api'
import type { Category } from '@/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await categoryService.getAll()

      if (response.success && response.data) {
        setCategories(response.data.categories)
      }

      return response
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to fetch categories'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}
