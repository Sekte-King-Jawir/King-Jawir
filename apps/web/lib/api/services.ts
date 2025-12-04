import { apiClient, buildQueryString, type ApiResponse } from './client'
import { API_CONFIG, API_ENDPOINTS } from '../config/api'
import type {
  User,
  Product,
  Category,
  Store,
  CartItem,
  Order,
  Review,
  PaginatedResponse,
} from '@/types'

// ============================================================================
// AUTH SERVICE
// ============================================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface UserResponse {
  user: User
}

export const authService = {
  me(): Promise<ApiResponse<UserResponse>> {
    return apiClient.get<UserResponse>(API_ENDPOINTS.AUTH.ME)
  },

  login(data: LoginRequest): Promise<ApiResponse<UserResponse>> {
    return apiClient.post<UserResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
  },

  register(data: RegisterRequest): Promise<ApiResponse<UserResponse>> {
    return apiClient.post<UserResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
  },

  logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT)
  },

  changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    })
  },
}

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export interface GetProductsParams {
  page?: number | undefined
  limit?: number | undefined
  categoryId?: string | undefined
  search?: string | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
}

export interface ProductResponse {
  product: Product
}

export const productService = {
  getAll(params?: GetProductsParams): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const query =
      params !== undefined
        ? buildQueryString(params as Record<string, string | number | boolean | undefined>)
        : ''
    return apiClient.get<PaginatedResponse<Product>>(`${API_ENDPOINTS.PRODUCTS.LIST}${query}`)
  },

  getBySlug(slug: string): Promise<ApiResponse<ProductResponse>> {
    return apiClient.get<ProductResponse>(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug))
  },

  getMyProducts(params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const query =
      params !== undefined
        ? buildQueryString(params as Record<string, string | number | boolean | undefined>)
        : ''
    return apiClient.get<PaginatedResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS.MY_PRODUCTS}${query}`
    )
  },
}

// ============================================================================
// CATEGORY SERVICE
// ============================================================================

export interface CategoriesResponse {
  categories: Category[]
}

export interface CategoryResponse {
  category: Category
}

export const categoryService = {
  getAll(): Promise<ApiResponse<CategoriesResponse>> {
    return apiClient.get<CategoriesResponse>(API_ENDPOINTS.CATEGORIES.LIST)
  },

  getBySlug(slug: string): Promise<ApiResponse<CategoryResponse>> {
    return apiClient.get<CategoryResponse>(API_ENDPOINTS.CATEGORIES.BY_SLUG(slug))
  },
}

// ============================================================================
// STORE SERVICE
// ============================================================================

export interface StoresResponse {
  stores: Store[]
}

export interface StoreResponse {
  store: Store
}

export const storeService = {
  getAll(): Promise<ApiResponse<StoresResponse>> {
    return apiClient.get<StoresResponse>(API_ENDPOINTS.STORES.LIST)
  },

  getBySlug(slug: string): Promise<ApiResponse<StoreResponse>> {
    return apiClient.get<StoreResponse>(API_ENDPOINTS.STORES.BY_SLUG(slug))
  },

  getStoreProducts(
    slug: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const query =
      params !== undefined
        ? buildQueryString(params as Record<string, string | number | boolean | undefined>)
        : ''
    return apiClient.get<PaginatedResponse<Product>>(
      `${API_ENDPOINTS.STORES.PRODUCTS(slug)}${query}`
    )
  },

  getMyStore(): Promise<ApiResponse<StoreResponse>> {
    return apiClient.get<StoreResponse>(API_ENDPOINTS.STORES.MY_STORE)
  },
}

// ============================================================================
// CART SERVICE
// ============================================================================

export interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface AddToCartRequest {
  productId: string
  quantity?: number
}

export const cartService = {
  getCart(): Promise<ApiResponse<CartResponse>> {
    return apiClient.get<CartResponse>(API_ENDPOINTS.CART.GET)
  },

  addItem(data: AddToCartRequest): Promise<ApiResponse<CartItem>> {
    return apiClient.post<CartItem>(API_ENDPOINTS.CART.ADD, data)
  },

  updateQuantity(itemId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    return apiClient.put<CartItem>(API_ENDPOINTS.CART.UPDATE(itemId), { quantity })
  },

  removeItem(itemId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(API_ENDPOINTS.CART.REMOVE(itemId))
  },
}

// ============================================================================
// ORDER SERVICE
// ============================================================================

export interface OrdersResponse {
  orders: Order[]
}

export interface OrderResponse {
  order: Order
}

export const orderService = {
  getAll(params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const query =
      params !== undefined
        ? buildQueryString(params as Record<string, string | number | boolean | undefined>)
        : ''
    return apiClient.get<PaginatedResponse<Order>>(`${API_ENDPOINTS.ORDERS.LIST}${query}`)
  },

  getById(orderId: string): Promise<ApiResponse<OrderResponse>> {
    return apiClient.get<OrderResponse>(API_ENDPOINTS.ORDERS.BY_ID(orderId))
  },

  // Checkout - creates order from current cart items
  checkout(): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.CREATE)
  },

  getSellerOrders(params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const query =
      params !== undefined
        ? buildQueryString(params as Record<string, string | number | boolean | undefined>)
        : ''
    return apiClient.get<PaginatedResponse<Order>>(`${API_ENDPOINTS.ORDERS.SELLER_ORDERS}${query}`)
  },
}

// ============================================================================
// REVIEW SERVICE
// ============================================================================

export interface ReviewsResponse {
  reviews: Review[]
}

export interface CreateReviewRequest {
  productId: string
  orderId: string
  rating: number
  comment?: string
}

export const reviewService = {
  getProductReviews(productSlug: string): Promise<ApiResponse<ReviewsResponse>> {
    return apiClient.get<ReviewsResponse>(API_ENDPOINTS.REVIEWS.PRODUCT(productSlug))
  },

  create(data: CreateReviewRequest): Promise<ApiResponse<Review>> {
    return apiClient.post<Review>(API_ENDPOINTS.REVIEWS.CREATE, data)
  },
}

// ============================================================================
// PROFILE SERVICE
// ============================================================================

export interface ProfileResponse {
  user: User
}

export interface UpdateProfileRequest {
  name?: string | undefined
  phone?: string | undefined
  address?: string | undefined
  bio?: string | undefined
  avatar?: string | undefined
}

export const profileService = {
  get(): Promise<ApiResponse<ProfileResponse>> {
    return apiClient.get<ProfileResponse>(API_ENDPOINTS.PROFILE.GET)
  },

  update(data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> {
    return apiClient.put<ProfileResponse>(API_ENDPOINTS.PROFILE.UPDATE, data)
  },
}

// ============================================================================
// PRICE ANALYSIS SERVICE
// ============================================================================

export interface PriceAnalysisRequest {
  query: string
  userPrice?: number
  limit?: number
}

export interface TokopediaProduct {
  name: string
  price: string
  rating?: string
  sold?: string
  location?: string
  shop_location?: string
  store?: string
  url?: string
  product_url?: string
  image_url?: string
}

export interface PriceStatistics {
  min: number
  max: number
  average: number
  median: number
  userPricePercentile?: number
  totalProducts?: number
}

export interface AIAnalysis {
  recommendation: string
  suggestedPrice?: number
  insights: string[]
}

export interface PriceAnalysisResult {
  products: TokopediaProduct[]
  statistics: PriceStatistics
  analysis: AIAnalysis
  recommendation?: string
}

export interface WebSocketMessage {
  type: string
  data?: unknown
  message?: string
  progress?: number
}

export const priceAnalysisService = {
  analyze(data: PriceAnalysisRequest): Promise<ApiResponse<PriceAnalysisResult>> {
    return apiClient.post<PriceAnalysisResult>(API_ENDPOINTS.PRICE_ANALYSIS.ANALYZE, data)
  },

  // WebSocket streaming connection
  createStreamConnection(
    onMessage: (data: WebSocketMessage) => void,
    onError?: (error: Error) => void,
    onClose?: () => void
  ): WebSocket {
    const wsUrl = `${API_CONFIG.WS_URL}${API_ENDPOINTS.PRICE_ANALYSIS.STREAM}`
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage
        onMessage(data)
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    ws.onerror = () => {
      if (onError !== undefined) {
        onError(new Error('WebSocket error'))
      }
    }

    ws.onclose = () => {
      if (onClose !== undefined) {
        onClose()
      }
    }

    return ws
  },
}
