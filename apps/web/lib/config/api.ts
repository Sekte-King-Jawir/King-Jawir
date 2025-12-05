// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101',
  TIMEOUT: 30000,
  WS_URL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101').replace('http', 'ws'),
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    ME: '/api/auth/me',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
    GOOGLE_LOGIN: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
  },
  // Products
  PRODUCTS: {
    LIST: '/api/products',
    BY_SLUG: (slug: string) => `/api/products/${slug}`,
    MY_PRODUCTS: '/api/products/me',
    STORE_PRODUCTS: (storeSlug: string) => `/api/products/store/${storeSlug}`,
  },
  // Categories
  CATEGORIES: {
    LIST: '/api/categories',
    BY_SLUG: (slug: string) => `/api/categories/${slug}`,
  },
  // Store
  STORES: {
    LIST: '/api/stores',
    BY_SLUG: (slug: string) => `/api/stores/${slug}`,
    PRODUCTS: (slug: string) => `/api/stores/${slug}/products`,
    MY_STORE: '/api/stores/me',
    CREATE: '/api/stores',
    UPDATE: '/api/stores',
  },
  // Cart
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart',
    UPDATE: (id: string) => `/api/cart/${id}`,
    REMOVE: (id: string) => `/api/cart/${id}`,
    CLEAR: '/api/cart/clear',
  },
  // Orders
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    BY_ID: (id: string) => `/api/orders/${id}`,
    SELLER_ORDERS: '/api/orders/seller',
  },
  // Reviews
  REVIEWS: {
    PRODUCT: (slug: string) => `/api/products/${slug}/reviews`,
    CREATE: '/api/reviews',
  },
  // Profile
  PROFILE: {
    GET: '/api/profile',
    UPDATE: '/api/profile',
  },
  // Price Analysis
  PRICE_ANALYSIS: {
    ANALYZE: '/api/price-analysis',
    STREAM: '/api/price-analysis/stream',
  },
  // Admin
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    PRODUCTS: '/api/admin/products',
    ORDERS: '/api/admin/orders',
    STORES: '/api/admin/stores',
  },
  // Seller Auth
  SELLER_AUTH: {
    REGISTER: '/api/seller/auth/register',
    LOGIN: '/api/seller/auth/login',
    LOGOUT: '/api/seller/auth/logout',
    ME: '/api/seller/auth/me',
    REFRESH: '/api/seller/auth/refresh',
  },
  // Seller
  SELLER: {
    PRODUCTS: '/api/seller/products',
    PRODUCT_BY_ID: (id: string) => `/api/seller/products/${id}`,
    STORE: '/api/seller/store',
    PRICE_ANALYSIS: '/api/seller/price-analysis',
    PRICE_ANALYSIS_QUICK: '/api/seller/price-analysis/quick-check',
    AI: {
      GENERATE_DESCRIPTION: '/api/seller/ai/generate-description',
      IMPROVE_DESCRIPTION: '/api/seller/ai/improve-description',
      DESCRIPTION_TIPS: '/api/seller/ai/description-tips',
    },
  },
} as const
