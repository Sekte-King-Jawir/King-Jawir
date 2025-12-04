// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  emailVerified: boolean
  avatar?: string | null
  phone?: string | null
  address?: string | null
  bio?: string | null
  createdAt: string
  updatedAt: string
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
  _count?: {
    products: number
  }
}

export interface Store {
  id: string
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  userId: string
  createdAt: string
  productCount?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  stock: number
  image: string | null
  categoryId: string
  storeId: string
  createdAt: string
  updatedAt: string
  category: Category
  store: Store
}

// ============================================================================
// CART TYPES
// ============================================================================

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  createdAt: string
  product: Product
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: string
  userId: string
  total: number
  status: OrderStatus
  shippingAddress: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user: User
}

export interface CreateOrderData {
  shippingAddress: string
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface Review {
  id: string
  userId: string
  productId: string
  orderId: string
  rating: number
  comment?: string | null
  createdAt: string
  user: User
  product: Product
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

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: unknown
  }
}

export interface PaginatedResponse<T> {
  products?: T[] // Legacy support
  items?: T[] // New format
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================================
// PRODUCT DETAIL TYPES
// ============================================================================

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  image: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
  store: {
    id: string
    name: string
    slug: string
    logo: string | null
  }
  createdAt: string
}

export interface ProductApiResponse {
  success: boolean
  message: string
  data?: {
    product: ProductDetail
  }
}
