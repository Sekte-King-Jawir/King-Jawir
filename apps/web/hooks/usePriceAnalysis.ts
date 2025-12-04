import { useState, useCallback, useRef, useEffect } from 'react'
import {
  priceAnalysisService,
  type PriceAnalysisRequest,
  type PriceAnalysisResult,
  type WebSocketMessage,
} from '@/lib/api'

interface StreamMessage extends WebSocketMessage {
  type: string
  step?: string | undefined
  data?: PriceAnalysisResult | undefined
  error?: string | undefined
}

interface UsePriceAnalysisReturn {
  loading: boolean
  error: string | null
  result: PriceAnalysisResult | null
  streamProgress: number
  streamMessage: string
  analyze: (data: PriceAnalysisRequest) => Promise<{ success: boolean; message?: string; data?: PriceAnalysisResult }>
  analyzeWithStream: (data: PriceAnalysisRequest) => void
  cancelStream: () => void
}

export function usePriceAnalysis(): UsePriceAnalysisReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PriceAnalysisResult | null>(null)
  const [streamProgress, setStreamProgress] = useState<number>(0)
  const [streamMessage, setStreamMessage] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)

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

  const analyzeWithStream = useCallback((data: PriceAnalysisRequest) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setStreamProgress(0)
    setStreamMessage('Memulai analisis...')

    // Close existing connection if any
    if (wsRef.current !== null) {
      wsRef.current.close()
    }

    const ws = priceAnalysisService.createStreamConnection(
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
      err => {
        setError(err.message)
        setLoading(false)
      },
      () => {
        setLoading(false)
      }
    )

    wsRef.current = ws

    // Send analysis request when connection opens
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'start-analysis',
          ...data,
        })
      )
    }
  }, [])

  const cancelStream = useCallback(() => {
    if (wsRef.current !== null) {
      wsRef.current.close()
      wsRef.current = null
      setLoading(false)
    }
  }, [])

  // Cleanup on unmount
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
