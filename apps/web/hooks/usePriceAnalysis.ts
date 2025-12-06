/**
 * Price Analysis React Hook
 * 
 * @description Custom hook for managing price analysis state and operations.
 * Supports both HTTP requests and WebSocket streaming with progress tracking.
 * 
 * @module hooks/usePriceAnalysis
 * 
 * @example
 * // Basic usage with HTTP
 * const { loading, error, result, analyze } = usePriceAnalysis()
 * 
 * const handleAnalyze = async () => {
 *   const response = await analyze({ query: 'laptop', limit: 10 })
 *   if (response.success) {
 *     console.log(response.data)
 *   }
 * }
 * 
 * @example
 * // Streaming with progress
 * const { loading, streamProgress, streamMessage, analyzeWithStream } = usePriceAnalysis()
 * 
 * useEffect(() => {
 *   analyzeWithStream({ query: 'laptop', limit: 20 })
 * }, [])
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  priceAnalysisService,
  type PriceAnalysisRequest,
  type PriceAnalysisResult,
  type WebSocketMessage,
} from '@/lib/api'

interface StreamMessage {
  type: 'progress' | 'complete' | 'error'
  step?: string
  message?: string
  progress?: number
  data?: PriceAnalysisResult
  error?: string
}

/**
 * Return type for usePriceAnalysis hook
 * 
 * @interface UsePriceAnalysisReturn
 * @property {boolean} loading - Loading state indicator
 * @property {string | null} error - Error message if analysis fails
 * @property {PriceAnalysisResult | null} result - Analysis result data
 * @property {number} streamProgress - Progress percentage for streaming (0-100)
 * @property {string} streamMessage - Current status message during streaming
 * @property {Function} analyze - Perform HTTP-based analysis
 * @property {Function} analyzeWithStream - Perform WebSocket streaming analysis
 * @property {Function} cancelStream - Cancel active WebSocket connection
 */
interface UsePriceAnalysisReturn {
  loading: boolean
  error: string | null
  result: PriceAnalysisResult | null
  streamProgress: number
  streamMessage: string
  analyze: (
    data: PriceAnalysisRequest
  ) => Promise<{ success: boolean; message?: string; data?: PriceAnalysisResult }>
  analyzeWithStream: (data: PriceAnalysisRequest) => void
  cancelStream: () => void
}

/**
 * Custom hook for price analysis with HTTP and WebSocket support
 * 
 * @returns {UsePriceAnalysisReturn} Analysis state and methods
 * 
 * @example
 * function PriceAnalysisPage() {
 *   const { loading, result, analyze } = usePriceAnalysis()
 *   
 *   const handleSubmit = async (query: string) => {
 *     const response = await analyze({ query, limit: 20 })
 *     if (response.success) {
 *       console.log('Mean price:', response.data?.statistics.mean)
 *     }
 *   }
 *   
 *   return <div>{loading ? 'Loading...' : JSON.stringify(result)}</div>
 * }
 */
export function usePriceAnalysis(): UsePriceAnalysisReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PriceAnalysisResult | null>(null)
  const [streamProgress, setStreamProgress] = useState<number>(0)
  const [streamMessage, setStreamMessage] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)

  /**
   * Performs price analysis via HTTP POST request
   * 
   * @param {PriceAnalysisRequest} data - Analysis parameters (query, limit, userPrice)
   * @returns {Promise<{success: boolean, message?: string, data?: PriceAnalysisResult}>}
   * 
   * @example
   * const response = await analyze({ query: 'laptop gaming', limit: 15 })
   */
  const analyze = useCallback(async (data: PriceAnalysisRequest) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await priceAnalysisService.analyze(data)

      if (response.success && response.data !== undefined && response.data !== null) {
        setResult(response.data)
      }

      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze price'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Performs price analysis via WebSocket with real-time progress updates
   * 
   * @param {PriceAnalysisRequest} data - Analysis parameters
   * @returns {void} Updates state via streamProgress and streamMessage
   * 
   * @example
   * // Start streaming analysis
   * analyzeWithStream({ query: 'smartphone', limit: 10 })
   * 
   * // Cancel if needed
   * useEffect(() => {
   *   return () => cancelStream()
   * }, [])
   */
  const analyzeWithStream = useCallback((data: PriceAnalysisRequest) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setStreamProgress(0)
    setStreamMessage('Memulai analisis...')

    if (wsRef.current !== null) {
      wsRef.current.close()
    }

    const ws = priceAnalysisService.connectStream(
      data,
      (message: WebSocketMessage) => {
        const streamMsg = message as StreamMessage
        if (streamMsg.type === 'progress') {
          setStreamProgress(streamMsg.progress ?? 0)
          setStreamMessage(streamMsg.message ?? '')
        } else if (streamMsg.type === 'complete') {
          setResult(streamMsg.data ?? null)
          setLoading(false)
          setStreamProgress(100)
          setStreamMessage('Analisis selesai!')
        } else if (streamMsg.type === 'error') {
          setError(streamMsg.error ?? 'Analisis gagal')
          setLoading(false)
        }
      },
      (err: Error) => {
        setError(err.message)
        setLoading(false)
      }
    )

    wsRef.current = ws
  }, [])

  /**
   * Cancels active WebSocket connection and resets loading state
   * 
   * @example
   * <button onClick={cancelStream}>Cancel Analysis</button>
   */
  const cancelStream = useCallback(() => {
    if (wsRef.current !== null) {
      wsRef.current.close()
      wsRef.current = null
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (wsRef.current !== null) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    loading,
    error,
    result,
    streamProgress,
    streamMessage,
    analyze,
    analyzeWithStream,
    cancelStream,
  }
}
