import { Elysia, t } from 'elysia'
import { priceAnalysisController } from './price_analysis_controller'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
import { logger } from '../lib/logger'

export const priceAnalysisRoutes = new Elysia({ prefix: '/api/price-analysis' }).get(
  '/',
  async ({ query }) => {
    try {
      const result = await priceAnalysisController.analyze(
        query.query,
        query.limit,
        query.userPrice
      )
      return successResponse('Price analysis completed successfully', result)
    } catch (error) {
      logger.error({
        msg: 'Price analysis error',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      return errorResponse(
        error instanceof Error ? error.message : 'Failed to analyze prices',
        ErrorCode.INTERNAL_ERROR
      )
    }
  },
  {
    query: t.Object({
      query: t.String({ description: 'Product search query' }),
      limit: t.Optional(
        t.Number({
          minimum: 1,
          maximum: 50,
          description: 'Number of products to analyze (default: 10)',
        })
      ),
      userPrice: t.Optional(
        t.Number({
          minimum: 0,
          description: "Optional: User's intended selling price for comparison",
        })
      ),
    }),
    detail: {
      tags: ['Price Analysis'],
      summary: 'Analyze product prices from Tokopedia',
      description:
        'Fetch product prices from Tokopedia and analyze them using AI to provide pricing recommendations and market insights',
    },
  }
)

export { priceAnalysisController } from './price_analysis_controller'
export { priceAnalysisService } from './price_analysis_service'
export { priceAnalysisRepository } from './price_analysis_repository'
