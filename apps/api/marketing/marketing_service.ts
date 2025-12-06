import { generateChatCompletion } from '../lib/ai'
import { logger } from '../lib/logger'
import { marketingRepository } from './marketing_repository'
import {
  buildMarketingContentPrompt,
  parseMarketingContentResponse,
  getFallbackMarketingContent,
  type MarketingContentResult,
} from './marketing_ai_helper'
import type { ProductDescriptionResult } from '../product-description/product_description_ai_helper'

export const marketingService = {
  /**
   * Generate marketing content using AI based on product description
   * @param productDescription - Structured product description
   * @param platform - Target platform (instagram, email, tiktok)
   * @returns Generated marketing content
   */
  async generateContent(
    productDescription: ProductDescriptionResult,
    platform: string
  ): Promise<MarketingContentResult> {
    // Validate input
    if (!marketingRepository.validateInput(productDescription, platform)) {
      throw new Error('Invalid marketing input')
    }

    try {
      logger.info({ msg: 'Generating marketing content', platform })

      // Build AI prompt
      const prompt = buildMarketingContentPrompt(productDescription, platform)
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: 'Anda adalah AI yang membantu SMEs Indonesia membuat konten pemasaran yang menarik dan efektif.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]

      // Use AI completion
      const result = await generateChatCompletion(messages, { temperature: 0.7 })

      const rawText = result.text || ''
      logger.info({ msg: 'AI returned marketing content', length: rawText.length })

      // Parse the AI response
      const parsed = parseMarketingContentResponse(rawText, platform)

      logger.info({ msg: 'Marketing content generated successfully' })
      return parsed
    } catch (error) {
      logger.error({ msg: 'Failed to generate marketing content', error: error instanceof Error ? error.message : 'Unknown' })
      // Return fallback content
      return getFallbackMarketingContent(platform)
    }
  },
}