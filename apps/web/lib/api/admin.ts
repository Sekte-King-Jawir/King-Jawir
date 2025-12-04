/**
 * Admin API Service
 * Handles all API calls to admin endpoints
 */

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'}/api`

// Types
export interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  avatar: string | null
  phone: string | null
  address: string | null
  bio: string | null
  emailVerified: boolean
  createdAt: string
  store?: {
    id: string
    name: string
    slug: string
    _count?: {
      products: number
    }
  } | null
  _count?: {
    orders: number
    reviews: number
    cart?: number
  }
}

export interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Stats {
  overview: {
    totalUsers: number
    totalSellers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
  }
  recentOrders: {
    id: string
    status: string
    total: number
    createdAt: string
    user: {
      name: string
      email: string
    }
  }[]
  topProducts: {
    id: string
    name: string
    slug: string
    price: number
    image: string | null
    totalSold: number | null
  }[]
  ordersByStatus: Record<string, number>
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  createdAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  store: {
    id: string
    name: string
    slug: string
    user: {
      name: string
      email: string
    }
  }
  _count?: {
    reviews: number
    orders: number
  }
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Order {
  id: string
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED'
  total: number
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  items: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      slug: string
      image: string | null
    }
  }[]
}

export interface Store {
  id: string
  name: string
  slug: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  _count: {
    products: number
  }
}

// Helper to get auth token from cookies (via fetch with credentials)
function getAuthHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
  }
}

// API Client
export const adminApi = {
  /**
   * Get list of users with filters
   */
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
  }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page !== null && params?.page !== undefined)
      queryParams.append('page', params.page.toString())
    if (params?.limit !== null && params?.limit !== undefined)
      queryParams.append('limit', params.limit.toString())
    if (params?.search !== null && params?.search !== undefined && params.search.length > 0)
      queryParams.append('search', params.search)
    if (params?.role !== null && params?.role !== undefined && params.role.length > 0)
      queryParams.append('role', params.role)

    const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams.toString()}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const result = (await response.json()) as { data: UsersResponse }
    return result.data
  },

  /**
   * Get user detail by ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    const result = (await response.json()) as { data: User }
    return result.data
  },

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: 'CUSTOMER' | 'SELLER' | 'ADMIN'): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ role }),
    })

    if (!response.ok) {
      const error = (await response.json()) as { message?: string }
      throw new Error(error.message ?? 'Failed to update user role')
    }

    const result = (await response.json()) as { data: User }
    return result.data
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = (await response.json()) as { message?: string }
      throw new Error(error.message ?? 'Failed to delete user')
    }
  },

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }

    const result = (await response.json()) as { data: Stats }
    return result.data
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`)

    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    const result = (await response.json()) as { data: { categories: Category[] } }
    return result.data.categories
  },

  /**
   * Get all products with filters
   */
  async getProducts(params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page !== null && params?.page !== undefined)
      queryParams.append('page', params.page.toString())
    if (params?.limit !== null && params?.limit !== undefined)
      queryParams.append('limit', params.limit.toString())
    if (params?.search !== null && params?.search !== undefined && params.search.length > 0)
      queryParams.append('search', params.search)
    if (
      params?.categoryId !== null &&
      params?.categoryId !== undefined &&
      params.categoryId.length > 0
    )
      queryParams.append('categoryId', params.categoryId)

    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const result = (await response.json()) as { data: ProductsResponse }
    return result.data
  },

  /**
   * Get all stores
   */
  async getStores(): Promise<Store[]> {
    const response = await fetch(`${API_BASE_URL}/stores`)

    if (!response.ok) {
      throw new Error('Failed to fetch stores')
    }

    const result = (await response.json()) as { data: { stores: Store[] } }
    return result.data.stores
  },
}
