/**
 * Marketing Content Service Module
 *
 * @description Provides HTTP client methods for AI-powered marketing content generation.
 * Generates platform-specific marketing content (social media posts, emails, etc.) based on product descriptions.
 *
 * @module lib/api/marketing
 *
 * @example
 * // Generate marketing content
 * const result = await marketingService.generate({
 *   productDescription: {
 *     short: 'Kamera aksi 4K',
 *     long: 'Kamera aksi 4K dengan stabilisasi gambar',
 *     bullets: ['4K resolution', 'Waterproof'],
 *     seoKeywords: ['kamera', 'aksi', '4K']
 *   },
 *   platform: 'instagram'
 * })
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '../config/api'
import type {
  MarketingContentRequest,
  MarketingContentResponse,
  MarketingContentResult,
} from '@/types/marketing'

/**
 * Service for marketing content operations
 */
export const marketingService = {
  /**
   * Generate marketing content using AI
   *
   * @param {MarketingContentRequest} data - Request payload with product description and platform
   * @returns {Promise<MarketingContentResponse>} API response with generated marketing content
   *
   * @example
   * const response = await marketingService.generate({
   *   productDescription: productDesc,
   *   platform: 'instagram'
   * })
   * if (response.success) {
   *   console.log('Content:', response.data.content)
   *   console.log('Hashtags:', response.data.hashtags)
   * }
   */
  generate(data: MarketingContentRequest): Promise<MarketingContentResponse> {
    return apiClient.post<MarketingContentResult>(API_ENDPOINTS.MARKETING.GENERATE, data)
  },
}

// Export types for convenience
export type { MarketingContentRequest, MarketingContentResponse, MarketingContentResult }
