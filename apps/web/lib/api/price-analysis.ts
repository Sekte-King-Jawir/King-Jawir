/**
 * Price Analysis Service Module
 *
 * @description Provides HTTP and WebSocket client methods for real-time price analysis.
 * Handles Tokopedia product scraping, statistical calculations, and AI-powered insights.
 *
 * @module lib/api/price-analysis
 *
 * @example
 * // HTTP request
 * const result = await priceAnalysisService.analyze({
 *   query: 'laptop gaming',
 *   limit: 20,
 *   userPrice: 5000000
 * })
 *
 * @example
 * // WebSocket streaming
 * const ws = priceAnalysisService.connectStream(
 *   { query: 'laptop', limit: 10 },
 *   (message) => console.log(message.progress),
 *   (error) => console.error(error)
 * )
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '../config/api'

/**
 * Request payload for price analysis
 *
 * @interface PriceAnalysisRequest
 * @property {string} query - Product search query (e.g., 'laptop gaming')
 * @property {number} [limit] - Maximum number of products to analyze (default: 10)
 * @property {number} [userPrice] - User's target price for comparison (in Rupiah)
 */
export interface PriceAnalysisRequest {
  query: string
  limit?: number
  userPrice?: number
}

export interface UnifiedProduct {
  name: string
  price: string
  rating?: string
  image_url?: string
  product_url: string
  shop_location?: string
  sold?: string
  source: 'tokopedia' | 'blibli'
}

export interface PriceStatistics {
  min: number
  max: number
  average: number // Changed from 'mean' to match backend response
  median: number
  totalProducts: number
  // Optional extended statistics (may not be present in all responses)
  mode?: number
  q1?: number
  q3?: number
  iqr?: number
  standardDeviation?: number
  lowerOutlierBound?: number
  upperOutlierBound?: number
  outlierCount?: number
  priceRange?: number
  confidenceInterval?: {
    lower: number
    upper: number
    confidenceLevel: number
  }
  priceDistribution?: {
    lowRange: { min: number; max: number; count: number; percentage: number }
    midRange: { min: number; max: number; count: number; percentage: number }
    highRange: { min: number; max: number; count: number; percentage: number }
  }
}

export interface AIAnalysis {
  recommendation: string
  insights: string[]
  suggestedPrice?: number
}

export interface PriceAnalysisResult {
  query: string
  optimizedQuery?: string
  products: UnifiedProduct[]
  statistics: PriceStatistics
  analysis: AIAnalysis
}

export interface WebSocketMessage {
  type: 'progress' | 'complete' | 'error'
  step?: string
  message?: string
  progress?: number
  data?: PriceAnalysisResult
  error?: string
}

/**
 * Price Analysis Service
 *
 * @namespace priceAnalysisService
 * @description Provides methods for price analysis via HTTP and WebSocket
 */
export const priceAnalysisService = {
  /**
   * Performs price analysis via HTTP POST request
   *
   * @param {PriceAnalysisRequest} data - Analysis request parameters
   * @returns {Promise<{success: boolean, message: string, data?: PriceAnalysisResult}>} Analysis result
   *
   * @example
   * const result = await priceAnalysisService.analyze({
   *   query: 'laptop',
   *   limit: 20,
   *   userPrice: 5000000
   * })
   * if (result.success) {
   *   console.log(result.data?.statistics.mean)
   * }
   */
  analyze(
    data: PriceAnalysisRequest
  ): Promise<{ success: boolean; message: string; data?: PriceAnalysisResult }> {
    return apiClient.post(API_ENDPOINTS.PRICE_ANALYSIS.ANALYZE, data)
  },

  /**
   * Establishes WebSocket connection for real-time streaming analysis
   *
   * @param {PriceAnalysisRequest} data - Analysis request parameters
   * @param {Function} onMessage - Callback for progress/complete messages
   * @param {Function} onError - Callback for error handling
   * @returns {WebSocket} Active WebSocket connection (call .close() when done)
   *
   * @example
   * const ws = priceAnalysisService.connectStream(
   *   { query: 'laptop gaming', limit: 10 },
   *   (msg) => {
   *     if (msg.type === 'progress') console.log(msg.progress + '%')
   *     if (msg.type === 'complete') console.log(msg.data)
   *   },
   *   (err) => console.error('Error:', err)
   * )
   *
   * // Cleanup when component unmounts
   * return () => ws.close()
   */
  connectStream(
    data: PriceAnalysisRequest,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: Error | string) => void
  ): WebSocket {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4101'}${API_ENDPOINTS.PRICE_ANALYSIS.STREAM}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'start-analysis',
          query: data.query,
          limit: data.limit,
          userPrice: data.userPrice,
        })
      )
    }

    ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage
        onMessage(message)
      } catch (_err) {
        onError(new Error('Failed to parse WebSocket message'))
      }
    }

    ws.onerror = () => {
      onError(new Error('WebSocket connection error'))
    }

    return ws
  },
}
