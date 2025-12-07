import { generateChatCompletion } from '../lib/ai'
import { logger } from '../lib/logger'
import { productDescriptionRepository } from './product_description_repository'
import {
  buildProductDescriptionPrompt,
  buildProductDescriptionPartPrompt,
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

      // Build prompts for short, bullets, and seo
      const mainPrompt = buildProductDescriptionPrompt(productInput)
      const mainMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content:
            'Anda adalah AI yang membantu SMEs Indonesia membuat deskripsi produk yang menarik dan persuasif untuk marketplace.',
        },
        {
          role: 'user',
          content: mainPrompt,
        },
      ]

      // Build prompts for long description parts (3 parts in parallel)
      const part1Messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: 'Anda adalah AI yang membantu SMEs Indonesia membuat deskripsi produk yang menarik dan persuasif untuk marketplace.',
        },
        {
          role: 'user',
          content: buildProductDescriptionPartPrompt(1, productInput),
        },
      ]
      const part2Messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: 'Anda adalah AI yang membantu SMEs Indonesia membuat deskripsi produk yang menarik dan persuasif untuk marketplace.',
        },
        {
          role: 'user',
          content: buildProductDescriptionPartPrompt(2, productInput),
        },
      ]
      const part3Messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: 'Anda adalah AI yang membantu SMEs Indonesia membuat deskripsi produk yang menarik dan persuasif untuk marketplace.',
        },
        {
          role: 'user',
          content: buildProductDescriptionPartPrompt(3, productInput),
        },
      ]

      // Generate all parts in parallel
      const [mainResult, part1Result, part2Result, part3Result] = await Promise.all([
        generateChatCompletion(mainMessages, { temperature: 0.3 }),
        generateChatCompletion(part1Messages, { temperature: 0.3 }),
        generateChatCompletion(part2Messages, { temperature: 0.3 }),
        generateChatCompletion(part3Messages, { temperature: 0.3 }),
      ])

      const mainRawText = mainResult.text || ''
      const longDescription = [
        part1Result.text || '',
        part2Result.text || '',
        part3Result.text || '',
      ].join(' ')

      logger.info({ msg: 'AI returned product description parts', mainLength: mainRawText.length, longLength: longDescription.length })

      // Parse the main response for short, bullets, seo
      const parsed = parseProductDescriptionResponse(mainRawText)
      // Override long with combined parts
      parsed.long = longDescription

      logger.info({ msg: 'Product description generated successfully' })
      return parsed
    } catch (error) {
      logger.error({
        msg: 'Failed to generate product description',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      // Return fallback description
      return getFallbackDescription(productInput)
    }
  },
}
