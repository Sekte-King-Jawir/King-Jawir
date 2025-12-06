import { apiClient } from './client'
import { API_ENDPOINTS } from '../config/api'

// ============================================================================
// TYPES
// ============================================================================

export interface PriceAnalysisRequest {
  query: string
  limit?: number
  userPrice?: number
}

export interface TokopediaProduct {
  name: string
  price: string
  rating: string | null
  sold: string | null
  location: string | null
  url: string
  imageUrl: string | null
}

export interface PriceStatistics {
  mean: number
  median: number
  mode: number
  min: number
  max: number
  q1: number
  q3: number
  iqr: number
  standardDeviation: number
  lowerOutlierBound: number
  upperOutlierBound: number
  outlierCount: number
  totalProducts: number
  priceRange: number
  confidenceInterval: {
    lower: number
    upper: number
    confidenceLevel: number
  }
  priceDistribution: {
    lowRange: { min: number; max: number; count: number; percentage: number }
    midRange: { min: number; max: number; count: number; percentage: number }
    highRange: { min: number; max: number; count: number; percentage: number }
  }
}

export interface AIAnalysis {
  recommendation: string
  competitorAnalysis: string
  marketTrend: string
  insights: string[]
}

export interface PriceAnalysisResult {
  query: string
  products: TokopediaProduct[]
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

// ============================================================================
// SERVICE
// ============================================================================

export const priceAnalysisService = {
  /**
   * Analyze prices with HTTP request
   */
  async analyze(
    data: PriceAnalysisRequest
  ): Promise<{ success: boolean; message: string; data?: PriceAnalysisResult }> {
    return apiClient.post(API_ENDPOINTS.PRICE_ANALYSIS.ANALYZE, data)
  },

  /**
   * Connect to WebSocket for streaming analysis
   */
  connectStream(
    data: PriceAnalysisRequest,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: Error) => void
  ): WebSocket {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4101'}${API_ENDPOINTS.PRICE_ANALYSIS.STREAM}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'start-analysis',
          ...data,
        })
      )
    }

    ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage
        onMessage(message)
      } catch (err) {
        onError(new Error('Failed to parse WebSocket message'))
      }
    }

    ws.onerror = () => {
      onError(new Error('WebSocket connection error'))
    }

    return ws
  },
}
