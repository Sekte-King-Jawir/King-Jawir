import { Elysia } from 'elysia'
import { priceAnalysisService } from './price_analysis_service'

export const priceAnalysisWebSocket = new Elysia().ws('/api/price-analysis/stream', {
  message(ws, message) {
    // Handle incoming WebSocket messages for price analysis streaming
    try {
      console.log('Received WebSocket message:', message)
      
      // Message is already parsed by Elysia, no need to JSON.parse
      const data = typeof message === 'string' ? JSON.parse(message) : message
      
      // Validate message structure
      if (!data || typeof data !== 'object') {
        throw new Error('Message must be a valid JSON object')
      }
      
      if (data.type === 'start-analysis') {
        // Validate required fields
        if (!data.query || typeof data.query !== 'string' || data.query.trim() === '') {
          throw new Error('Query field is required and must be a non-empty string')
        }
        
        // Start streaming analysis
        priceAnalysisService
          .streamAnalysis(
            data.query.trim(),
            data.limit || 10,
            data.userPrice,
            (update) => {
              ws.send(JSON.stringify(update))
            }
          )
          .catch((error) => {
            console.error('Stream analysis error:', error)
            ws.send(
              JSON.stringify({
                type: 'error',
                message: error.message || 'Analysis failed',
              })
            )
          })
      } else {
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'Unknown message type. Expected "start-analysis"',
          })
        )
      }
    } catch (error) {
      console.error('WebSocket message parsing error:', error)
      ws.send(
        JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Invalid message format',
        })
      )
    }
  },
  open(ws) {
    console.log('WebSocket connection opened for price analysis')
    ws.send(
      JSON.stringify({
        type: 'connected',
        message: 'WebSocket connected successfully',
      })
    )
  },
  close() {
    console.log('WebSocket connection closed')
  },
})