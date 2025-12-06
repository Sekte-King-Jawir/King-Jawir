/**
 * Marketing Content React Hook
 *
 * @description Custom hook for managing marketing content generation state and operations.
 * Supports AI-powered generation of platform-specific marketing content.
 *
 * @module hooks/useMarketing
 *
 * @example
 * // Basic usage
 * const { loading, error, result, generate } = useMarketing()
 *
 * const handleGenerate = async () => {
 *   const response = await generate({
 *     productDescription: productDesc,
 *     platform: 'instagram'
 *   })
 *   if (response.success && response.data) {
 *     console.log('Content:', response.data.content)
 *   }
 * }
 */

import { useState, useCallback } from 'react'
import {
  marketingService,
  type MarketingContentRequest,
  type MarketingContentResponse,
  type MarketingContentResult,
} from '@/lib/api'

/**
 * Return type for useMarketing hook
 *
 * @interface UseMarketingReturn
 * @property {boolean} loading - Loading state indicator
 * @property {string | null} error - Error message if generation fails
 * @property {MarketingContentResult | null} result - Generated marketing content data
 * @property {Function} generate - Generate marketing content
 * @property {Function} reset - Reset state to initial values
 */
interface UseMarketingReturn {
  loading: boolean
  error: string | null
  result: MarketingContentResult | null
  generate: (data: MarketingContentRequest) => Promise<MarketingContentResponse>
  reset: () => void
}

/**
 * Custom hook for marketing content generation
 *
 * @returns {UseMarketingReturn} Marketing content generation state and methods
 *
 * @example
 * function MarketingPage() {
 *   const { loading, result, generate, reset } = useMarketing()
 *
 *   const handleSubmit = async (productDesc: ProductDescriptionResult, platform: string) => {
 *     const response = await generate({
 *       productDescription: productDesc,
 *       platform: platform as MarketingContentRequest['platform']
 *     })
 *     if (response.success && response.data) {
 *       console.log('Generated:', response.data)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       {loading ? 'Generating...' : null}
 *       {result ? <MarketingDisplay data={result} /> : null}
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )
 * }
 */
export function useMarketing(): UseMarketingReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MarketingContentResult | null>(null)

  /**
   * Generates marketing content via HTTP POST request
   *
   * @param {MarketingContentRequest} data - Request payload with product description and platform
   * @returns {Promise<MarketingContentResponse>} API response
   */
  const generate = useCallback(
    async (data: MarketingContentRequest): Promise<MarketingContentResponse> => {
      setLoading(true)
      setError(null)
      setResult(null)

      try {
        const response = await marketingService.generate(data)

      if (response.success && response.data !== null) {
        setResult(response.data ?? null)
      } else {
        setError(response.message ?? 'Failed to generate marketing content')
      }

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      if (errorMessage === '') {
        setError('Unknown error occurred')
      } else {
        setError(errorMessage)
      }
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
