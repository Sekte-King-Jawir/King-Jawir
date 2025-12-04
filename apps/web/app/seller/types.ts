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

export interface StoreApiResponse {
  success: boolean
  message: string
  data?: {
    store: SellerStore
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
}

export interface AuthMeResponse {
  success: boolean
  message: string
  data?: {
    user: User
  }
}
