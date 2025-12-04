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
    ME: '/auth/me',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    CHANGE_PASSWORD: '/auth/change-password',
    GOOGLE_LOGIN: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },
  // Products
  PRODUCTS: {
    LIST: '/products',
    BY_SLUG: (slug: string) => `/products/${slug}`,
    MY_PRODUCTS: '/products/me',
    STORE_PRODUCTS: (storeSlug: string) => `/products/store/${storeSlug}`,
  },
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    BY_SLUG: (slug: string) => `/categories/${slug}`,
  },
  // Store
  STORES: {
    LIST: '/stores',
    BY_SLUG: (slug: string) => `/stores/${slug}`,
    PRODUCTS: (slug: string) => `/stores/${slug}/products`,
    MY_STORE: '/stores/me',
    CREATE: '/stores',
    UPDATE: '/stores',
  },
  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart',
    UPDATE: (id: string) => `/cart/${id}`,
    REMOVE: (id: string) => `/cart/${id}`,
    CLEAR: '/cart/clear',
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    SELLER_ORDERS: '/orders/seller',
  },
  // Reviews
  REVIEWS: {
    PRODUCT: (slug: string) => `/products/${slug}/reviews`,
    CREATE: '/reviews',
  },
  // Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
  },
  // Price Analysis
  PRICE_ANALYSIS: {
    ANALYZE: '/price-analysis/analyze',
    STREAM: '/price-analysis/stream',
  },
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    STORES: '/admin/stores',
  },
} as const
