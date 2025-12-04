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
