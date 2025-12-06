/**
 * API Configuration Module
 *
 * @description Centralized API configuration including base URLs, timeouts, and endpoints.
 * Reads from environment variables with fallback to localhost.
 *
 * @module lib/config/api
 *
 * @example
 * import { API_CONFIG, API_ENDPOINTS } from '@/lib/config/api'
 *
 * fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRICE_ANALYSIS.ANALYZE}`)
 *
 * // WebSocket connection
 * const ws = new WebSocket(`${API_CONFIG.WS_URL}${API_ENDPOINTS.PRICE_ANALYSIS.STREAM}`)
 */

/**
 * API client configuration
 *
 * @constant {Object} API_CONFIG
 * @property {string} BASE_URL - API base URL (from NEXT_PUBLIC_API_URL env)
 * @property {number} TIMEOUT - Request timeout in milliseconds
 * @property {string} WS_URL - WebSocket URL (http/https replaced with ws/wss)
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101',
  TIMEOUT: 30000,
  WS_URL: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101')
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://'),
} as const

/**
 * API endpoint paths organized by feature
 *
 * @constant {Object} API_ENDPOINTS
 * @property {Object} PRICE_ANALYSIS - Price analysis endpoints
 * @property {string} PRICE_ANALYSIS.ANALYZE - HTTP POST for analysis
 * @property {string} PRICE_ANALYSIS.STREAM - WebSocket endpoint for streaming
 * @property {Object} PRODUCT_DESCRIPTION - Product description endpoints
 * @property {string} PRODUCT_DESCRIPTION.GENERATE - HTTP POST for generating description
 */
export const API_ENDPOINTS = {
  PRICE_ANALYSIS: {
    ANALYZE: '/api/price-analysis',
    STREAM: '/api/price-analysis/stream',
  },
  PRODUCT_DESCRIPTION: {
    GENERATE: '/api/product-description/generate',
  },
  MARKETING: {
    GENERATE: '/api/marketing/generate',
  },
} as const
