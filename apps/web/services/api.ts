import type { ApiResponse, Product, Category, PaginatedResponse } from '@/types'

// Base API URL - bisa dari environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'

/**
 * Generic fetch wrapper dengan error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // untuk cookies
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      message: 'Network error',
      error: {
        code: 'NETWORK_ERROR',
      },
    }
  }
}

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export const productService = {
  /**
   * Get all products dengan filter dan pagination
   */
  async getAll(params?: {
    page?: number
    limit?: number
    categoryId?: string
    search?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.minPrice) searchParams.set('minPrice', String(params.minPrice))
    if (params?.maxPrice) searchParams.set('maxPrice', String(params.maxPrice))

    const query = searchParams.toString()
    return fetchApi<PaginatedResponse<Product>>(`/products${query ? `?${query}` : ''}`)
  },

  /**
   * Get product by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<{ product: Product }>> {
    return fetchApi<{ product: Product }>(`/products/${slug}`)
  },

  /**
   * Get products by store slug
   */
  async getByStoreSlug(
    storeSlug: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchParams = new URLSearchParams()
    if (page) searchParams.set('page', String(page))
    if (limit) searchParams.set('limit', String(limit))

    const query = searchParams.toString()
    return fetchApi<PaginatedResponse<Product>>(
      `/stores/${storeSlug}/products${query ? `?${query}` : ''}`
    )
  },
}

// ============================================================================
// CATEGORY SERVICE
// ============================================================================

export const categoryService = {
  /**
   * Get all categories
   */
  async getAll(): Promise<ApiResponse<{ categories: Category[] }>> {
    return fetchApi<{ categories: Category[] }>('/categories')
  },

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<{ category: Category }>> {
    return fetchApi<{ category: Category }>(`/categories/${slug}`)
  },
}

// ============================================================================
// CART SERVICE
// ============================================================================

export const cartService = {
  /**
   * Get cart items
   */
  async getCart(): Promise<ApiResponse<unknown>> {
    return fetchApi('/cart')
  },

  /**
   * Add item to cart
   */
  async addItem(productId: string, quantity: number = 1): Promise<ApiResponse<unknown>> {
    return fetchApi('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(itemId: string, quantity: number): Promise<ApiResponse<unknown>> {
    return fetchApi(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<ApiResponse<unknown>> {
    return fetchApi(`/cart/${itemId}`, {
      method: 'DELETE',
    })
  },
}

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const authService = {
  /**
   * Get current user
   */
  async me(): Promise<ApiResponse<unknown>> {
    return fetchApi('/auth/me')
  },

  /**
   * Login
   */
  async login(email: string, password: string): Promise<ApiResponse<unknown>> {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  /**
   * Register
   */
  async register(data: {
    name: string
    email: string
    password: string
  }): Promise<ApiResponse<unknown>> {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Logout
   */
  async logout(): Promise<ApiResponse<unknown>> {
    return fetchApi('/auth/logout', {
      method: 'POST',
    })
  },
}
