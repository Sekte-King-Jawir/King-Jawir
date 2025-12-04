export interface Store {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  productCount?: number
  _count?: {
    products: number
  }
  owner?: {
    name: string
  }
  createdAt: string
}

export interface StoreProduct {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  description: string | null
  category: {
    id: string
    name: string
    slug: string
  }
}

export interface StoreApiResponse {
  success: boolean
  message: string
  data?: {
    store: Store
  }
}

export interface StoreProductsApiResponse {
  success: boolean
  message: string
  data?: {
    products: StoreProduct[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
