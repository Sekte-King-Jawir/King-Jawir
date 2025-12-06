/**
 * API Services Barrel Export
 *
 * @description Central export point for all API client modules and services.
 * Provides HTTP client, price analysis service, product description service, marketing service, and utility functions.
 *
 * @module lib/api
 *
 * @example
 * import { apiClient, priceAnalysisService, productDescriptionService, marketingService } from '@/lib/api'
 *
 * @example
 * // Import specific utilities
 * import { buildQueryString, handleApiError } from '@/lib/api'
 */

export * from './client'
export * from './price-analysis'
export * from './product-description'
export * from './marketing'

export { apiClient, buildQueryString, handleApiError, isApiError } from './client'
