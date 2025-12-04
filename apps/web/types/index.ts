// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

export interface Store {
  id: string
  name: string
  slug?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  category: Category | null
  store: Store | null
}

// ============================================================================
// FLASH SALE TYPES
// ============================================================================

export interface FlashDeal {
  id: number
  name: string
  emoji: string
  price: number
  originalPrice: number
  discount: number
  sold: number
}

export interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

// ============================================================================
// BRAND TYPES
// ============================================================================

export interface Brand {
  name: string
  emoji: string
}

// ============================================================================
// COLLECTION TYPES
// ============================================================================

export interface Collection {
  id: number
  name: string
  emoji: string
  count: number
  gradient: string
  description: string
}

// ============================================================================
// TESTIMONIAL TYPES
// ============================================================================

export interface Testimonial {
  id: number
  name: string
  avatar: string
  role: string
  content: string
  rating: number
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: Record<string, string> | null
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
