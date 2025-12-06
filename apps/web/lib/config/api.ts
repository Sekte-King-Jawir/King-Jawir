// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101',
  TIMEOUT: 30000,
  WS_URL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101').replace('http', 'ws'),
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Price Analysis
  PRICE_ANALYSIS: {
    ANALYZE: '/api/price-analysis',
    STREAM: '/api/price-analysis/stream',
  },
} as const
