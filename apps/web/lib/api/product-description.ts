/**
 * Product Description Service Module
 *
 * @description Provides HTTP client methods for AI-powered product description generation.
 * Generates structured product descriptions with short/long text, bullets, and SEO keywords.
 *
 * @module lib/api/product-description
 *
 * @example
 * // Generate product description
 * const result = await productDescriptionService.generate({
 *   productInput: 'Kamera aksi 4K waterproof'
 * })
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '../config/api'
import type {
  ProductDescriptionRequest,
  ProductDescriptionResponse,
  ProductDescriptionResult,
} from '@/types/product-description'

/**
 * Service for product description operations
 */
export const productDescriptionService = {
  /**
   * Generate product description using AI
   *
   * @param {ProductDescriptionRequest} data - Request payload
   * @returns {Promise<ProductDescriptionResponse>} API response with generated description
   *
   * @example
   * const response = await productDescriptionService.generate({
   *   productInput: 'Wireless earbuds with noise cancellation'
   * })
   * if (response.success) {
   *   console.log('Short description:', response.data.short)
   * }
   */
  generate(data: ProductDescriptionRequest): Promise<ProductDescriptionResponse> {
    return apiClient.post<ProductDescriptionResult>(
      API_ENDPOINTS.PRODUCT_DESCRIPTION.GENERATE,
      data
    )
  },
}

// Export types for convenience
export type { ProductDescriptionRequest, ProductDescriptionResponse, ProductDescriptionResult }
