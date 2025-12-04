// Re-export all API modules for convenient access
export * from './client'
export * from './services'

// Re-export specific services for direct import
export {
  authService,
  productService,
  categoryService,
  storeService,
  cartService,
  orderService,
  reviewService,
  profileService,
  priceAnalysisService,
} from './services'

export { apiClient, buildQueryString, handleApiError, isApiError } from './client'
