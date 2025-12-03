import { priceAnalysisService } from './price_analysis_service'

export const priceAnalysisController = {
  /**
   * Analyze prices for a product query
   */
  async analyze(query: string, limit?: number, userPrice?: number) {
    if (!query || query.trim() === '') {
      throw new Error('Query parameter is required')
    }

    const analysisLimit = limit && limit > 0 && limit <= 50 ? limit : 10
    const parsedUserPrice = userPrice && userPrice > 0 ? userPrice : undefined

    return await priceAnalysisService.analyzePrices(query, analysisLimit, parsedUserPrice)
  },
}
