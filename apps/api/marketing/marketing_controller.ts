import { marketingService } from './marketing_service'
import type { MarketingContentResult } from './marketing_ai_helper'
import type { ProductDescriptionResult } from '../product-description/product_description_ai_helper'

export const marketingController = {
  /**
   * Generate marketing content based on product description
   */
  async generate(
    productDescription: ProductDescriptionResult,
    platform: string
  ): Promise<MarketingContentResult> {
    if (!productDescription || !platform) {
      throw new Error('Product description and platform are required')
    }

    return await marketingService.generateContent(productDescription, platform)
  },
}
