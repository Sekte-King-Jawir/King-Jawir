/**
 * Product Description React Hook
 *
 * @description Custom hook for managing product description generation state and operations.
 * Supports AI-powered generation of structured product descriptions.
 *
 * @module hooks/useProductDescription
 *
 * @example
 * // Basic usage
 * const { loading, error, result, generate } = useProductDescription()
 *
 * const handleGenerate = async () => {
 *   const response = await generate({ productInput: 'Wireless earbuds' })
 *   if (response.success && response.data) {
 *     console.log('Short description:', response.data.short)
 *   }
 * }
 */

import { useState, useCallback } from 'react'
import {
  productDescriptionService,
  type ProductDescriptionRequest,
  type ProductDescriptionResponse,
  type ProductDescriptionResult,
} from '@/lib/api'

/**
 * Return type for useProductDescription hook
 *
 * @interface UseProductDescriptionReturn
 * @property {boolean} loading - Loading state indicator
 * @property {string | null} error - Error message if generation fails
 * @property {ProductDescriptionResult | null} result - Generated description data
 * @property {Function} generate - Generate product description
 * @property {Function} reset - Reset state to initial values
 */
interface UseProductDescriptionReturn {
  loading: boolean
  error: string | null
  result: ProductDescriptionResult | null
  generate: (
    data: ProductDescriptionRequest
  ) => Promise<ProductDescriptionResponse>
  reset: () => void
}

/**
 * Custom hook for product description generation
 *
 * @returns {UseProductDescriptionReturn} Description generation state and methods
 *
 * @example
 * function ProductDescriptionPage() {
 *   const { loading, result, generate, reset } = useProductDescription()
 *
 *   const handleSubmit = async (input: string) => {
 *     const response = await generate({ productInput: input })
 *     if (response.success && response.data) {
 *       console.log('Generated:', response.data)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       {loading ? 'Generating...' : null}
 *       {result ? <DescriptionDisplay data={result} /> : null}
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )
 * }
 */
export function useProductDescription(): UseProductDescriptionReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ProductDescriptionResult | null>(null)

  /**
   * Generates product description via HTTP POST request
   *
   * @param {ProductDescriptionRequest} data - Request payload with product input
   * @returns {Promise<ProductDescriptionResponse>} API response
   */
  const generate = useCallback(async (data: ProductDescriptionRequest): Promise<ProductDescriptionResponse> => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await productDescriptionService.generate(data)

      if (response.success && response.data !== null && response.data !== undefined) {
        setResult(response.data)
      } else {
        setError(response.message ?? 'Failed to generate description')
      }

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Resets the hook state to initial values
   */
  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setResult(null)
  }, [])

  return {
    loading,
    error,
    result,
    generate,
    reset,
  }
}