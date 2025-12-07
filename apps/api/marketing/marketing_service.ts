import { generateChatCompletion } from '../lib/ai'
import { logger } from '../lib/logger'
import { marketingRepository } from './marketing_repository'
import {
  buildMarketingContentPrompt,
  buildMarketingContentPartPrompt,
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

      // For platforms that need longer content, use parallel generation
      const longContentPlatforms = ['email', 'linkedin']
      if (longContentPlatforms.includes(platform.toLowerCase())) {
        // Generate content parts in parallel
        const part1Messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          {
            role: 'system',
            content:
              'Anda adalah AI yang membantu SMEs Indonesia membuat konten pemasaran yang menarik dan efektif.',
          },
          {
            role: 'user',
            content: buildMarketingContentPartPrompt(productDescription, platform, 1),
          },
        ]
        const part2Messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          {
            role: 'system',
            content:
              'Anda adalah AI yang membantu SMEs Indonesia membuat konten pemasaran yang menarik dan efektif.',
          },
          {
            role: 'user',
            content: buildMarketingContentPartPrompt(productDescription, platform, 2),
          },
        ]
        const part3Messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          {
            role: 'system',
            content:
              'Anda adalah AI yang membantu SMEs Indonesia membuat konten pemasaran yang menarik dan efektif.',
          },
          {
            role: 'user',
            content: buildMarketingContentPartPrompt(productDescription, platform, 3),
          },
        ]

        // Generate all parts in parallel
        const [part1Result, part2Result, part3Result] = await Promise.all([
          generateChatCompletion(part1Messages, { temperature: 0.7 }),
          generateChatCompletion(part2Messages, { temperature: 0.7 }),
          generateChatCompletion(part3Messages, { temperature: 0.7 }),
        ])

        const combinedContent = [
          part1Result.text || '',
          part2Result.text || '',
          part3Result.text || '',
        ].join(' ')

        logger.info({
          msg: 'AI returned marketing content parts',
          contentLength: combinedContent.length,
        })

        // Create result with combined content
        const result: MarketingContentResult = {
          platform,
          content: combinedContent,
          hashtags:
            platform === 'email'
              ? ['#KameraAksi', '#BisnisSME', '#ContentMarketing', '#VideoProduction']
              : [
                  '#DigitalMarketing',
                  '#SME',
                  '#ContentCreation',
                  '#BusinessTools',
                  '#IndonesiaUMKM',
                  '#VideoContent',
                ],
          callToAction:
            platform === 'email'
              ? 'Klik link di atas untuk memesan sekarang!'
              : 'Hubungi kami untuk konsultasi gratis dan demo produk!',
        }

        logger.info({ msg: 'Marketing content generated successfully' })
        return result
      } else {
        // For short-form platforms, use single generation
        const prompt = buildMarketingContentPrompt(productDescription, platform)
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          {
            role: 'system',
            content:
              'Anda adalah AI yang membantu SMEs Indonesia membuat konten pemasaran yang menarik dan efektif.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ]

        const result = await generateChatCompletion(messages, { temperature: 0.7 })
        const rawText = result.text || ''
        logger.info({ msg: 'AI returned marketing content', length: rawText.length })

        const parsed = parseMarketingContentResponse(rawText, platform)

        logger.info({ msg: 'Marketing content generated successfully' })
        return parsed
      }
    } catch (error) {
      logger.error({
        msg: 'Failed to generate marketing content',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      // Return fallback content
      return getFallbackMarketingContent(platform)
    }
  },
}
