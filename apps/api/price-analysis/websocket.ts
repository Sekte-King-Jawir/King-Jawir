import { Elysia } from 'elysia'
import { priceAnalysisService } from './price_analysis_service'
import { logger } from '../lib/logger'

export const priceAnalysisWebSocket = new Elysia().ws('/api/price-analysis/stream', {
  message(ws, message) {
    // Handle incoming WebSocket messages for price analysis streaming
    try {
      logger.debug({ msg: 'WebSocket message received', message })

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
            update => {
              ws.send(JSON.stringify(update))
            },
            data.limit || 10,
            data.userPrice
          )
          .catch(error => {
            logger.error({ msg: 'Stream analysis error', error: error instanceof Error ? error.message : 'Unknown' })
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
      logger.error({ msg: 'WebSocket parsing error', error: error instanceof Error ? error.message : 'Unknown' })
      ws.send(
        JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Invalid message format',
        })
      )
    }
  },
  open(ws) {
    logger.info('WebSocket connection opened for price analysis')
    ws.send(
      JSON.stringify({
        type: 'connected',
        message: 'WebSocket connected successfully',
      })
    )
  },
  close() {
    logger.info('WebSocket connection closed')
  },
})
