const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'

interface ProductFilter {
  categoryId?: string
  storeId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  store: {
    id: string
    name: string
    slug: string
  }
  _count: {
    reviews: number
  }
}

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface Category {
  id: string
  name: string
  slug: string
  _count?: {
    products: number
  }
}

export async function getProducts(
  filter?: ProductFilter,
  page = 1,
  limit = 9
): Promise<ProductsResponse> {
  const params = new URLSearchParams()
  
  if (filter?.categoryId) params.set('categoryId', filter.categoryId)
  if (filter?.storeId) params.set('storeId', filter.storeId)
  if (filter?.search) params.set('search', filter.search)
  if (filter?.minPrice) params.set('minPrice', filter.minPrice.toString())
  if (filter?.maxPrice) params.set('maxPrice', filter.maxPrice.toString())
  params.set('page', page.toString())
  params.set('limit', limit.toString())

  const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  const data = await res.json()
  return data.data
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  const data = await res.json()
  return data.data
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error('Failed to fetch product')
  }

  const data = await res.json()
  return data.data
}
