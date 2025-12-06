import { generateChatCompletion } from '../lib/ai'
import { logger } from '../lib/logger'
import { productDescriptionRepository } from './product_description_repository'
import {
  buildProductDescriptionPrompt,
  parseProductDescriptionResponse,
  getFallbackDescription,
  type ProductDescriptionResult,
} from './product_description_ai_helper'

export const productDescriptionService = {
  /**
   * Generate product description using AI based on user input
   * @param productInput - User input describing the product
   * @returns Structured product description with short, long, bullets, and SEO keywords
   */
  async generateDescription(productInput: string): Promise<ProductDescriptionResult> {
    // Validate input first
    const isValid = await productDescriptionRepository.validateInput(productInput)
    if (!isValid) {
      throw new Error('Invalid product input')
    }

    try {
      logger.info({ msg: 'Generating product description', productInput })

      // Build AI prompt
      const prompt = buildProductDescriptionPrompt(productInput)
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: 'Anda adalah AI yang membantu SMEs Indonesia membuat deskripsi produk yang menarik dan persuasif untuk marketplace.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]

      // Use AI completion with low temperature for consistency
      const result = await generateChatCompletion(messages, { temperature: 0.3 })

      const rawText = result.text || ''
      logger.info({ msg: 'AI returned product description', length: rawText.length })

      // Parse the AI response
      const parsed = parseProductDescriptionResponse(rawText)

      logger.info({ msg: 'Product description generated successfully' })
      return parsed
    } catch (error) {
      logger.error({ msg: 'Failed to generate product description', error: error instanceof Error ? error.message : 'Unknown' })
      // Return fallback description
      return getFallbackDescription(productInput)
    }
  },
}
