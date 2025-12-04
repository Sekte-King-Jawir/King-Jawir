import { useState, useCallback, useRef, useEffect } from 'react'
import {
  priceAnalysisService,
  type PriceAnalysisRequest,
  type PriceAnalysisResult,
} from '@/lib/api'

interface StreamMessage {
  type: 'progress' | 'complete' | 'error'
  step?: string
  message?: string
  progress?: number
  data?: PriceAnalysisResult
  error?: string
}

export function usePriceAnalysis() {
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

      if (response.success && response.data) {
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
    if (wsRef.current) {
      wsRef.current.close()
    }

    const ws = priceAnalysisService.createStreamConnection(
      (message: StreamMessage) => {
        if (message.type === 'progress') {
          setStreamProgress(message.progress || 0)
          setStreamMessage(message.message || '')
        } else if (message.type === 'complete') {
          setResult(message.data || null)
          setLoading(false)
          setStreamProgress(100)
          setStreamMessage('Analisis selesai!')
        } else if (message.type === 'error') {
          setError(message.error || 'Analisis gagal')
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
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setLoading(false)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
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
