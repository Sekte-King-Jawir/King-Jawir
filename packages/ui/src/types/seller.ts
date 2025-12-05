// ============================================================================
// SELLER UI COMPONENT TYPES
// Types untuk komponen UI seller yang reusable
// ============================================================================

// ============================================================================
// STORE TYPES
// ============================================================================

export interface SellerStore {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  productCount: number
  createdAt: string
}

export interface CreateStoreData {
  name: string
  slug?: string
  description?: string
  logo?: string
}

export interface UpdateStoreData {
  name?: string
  slug?: string
  description?: string
  logo?: string
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export interface Category {
  id: string
  name: string
  slug: string
}

export interface SellerProduct {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  image: string | null
  categoryId: string | null
  category?: Category | null
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductData {
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  categoryId?: string
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED'

export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    image: string | null
  }
}

export interface SellerOrder {
  id: string
  status: OrderStatus
  total: number
  totalAmount?: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
  }
  items: OrderItem[]
  shippingAddress?: string | null
}

// ============================================================================
// DASHBOARD STATS TYPES
// ============================================================================

export interface SellerStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
}

// ============================================================================
// URL TYPES FOR COMPONENTS
// ============================================================================

export interface SellerUrls {
  home: string
  products: string
  seller: {
    dashboard: string
    store: string
    products: string
    orders: string
    analytics: string
  }
  priceAnalysis: string
}
