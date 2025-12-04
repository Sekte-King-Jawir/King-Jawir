export interface SellerProduct {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  image: string | null
  categoryId: string | null
  category?: {
    id: string
    name: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface CreateProductData {
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  categoryId?: string
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  stock?: number
  image?: string
  categoryId?: string
}

export interface ProductsApiResponse {
  success: boolean
  message: string
  data?: {
    products: SellerProduct[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface ProductApiResponse {
  success: boolean
  message: string
  data?: {
    product: SellerProduct
  }
}

export interface CategoriesApiResponse {
  success: boolean
  message: string
  data?: Category[]
}
