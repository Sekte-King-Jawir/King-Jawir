import { sellerPriceAnalysisService } from './price_analysis_service'

export const sellerPriceAnalysisController = {
  /**
   * Full price analysis untuk seller sebelum create product
   */
  async analyze(productName: string, userPrice?: number, limit?: number) {
    return sellerPriceAnalysisService.analyzeBeforeCreate(productName, userPrice, limit)
  },

  /**
   * Quick price check untuk validasi cepat
   */
  async quickCheck(productName: string, userPrice: number) {
    return sellerPriceAnalysisService.quickPriceCheck(productName, userPrice)
  },
}
