import { productDescriptionService } from './product_description_service'
import type { ProductDescriptionResult } from './product_description_ai_helper'

export const productDescriptionController = {
  /**
   * Generate product description based on user input
   */
  async generate(productInput: string): Promise<ProductDescriptionResult> {
    if (!productInput || productInput.trim() === '') {
      throw new Error('Product input is required')
    }

    return await productDescriptionService.generateDescription(productInput)
  },
}
