import Navbar from './components/Navbar'
import {
  HeroSection,
  FeaturedProducts,
  CategorySection,
  PromoBanner,
  NewArrivals,
  PopularProducts,
  Newsletter,
  Footer,
} from './components/home'

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
  } | null
  store: {
    id: string
    name: string
  } | null
}

interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface ProductsResponse {
  success?: boolean
  data?: {
    products?: Product[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

interface CategoriesResponse {
  success?: boolean
  data?: {
    categories?: Category[]
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:4101/products?limit=12', {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const json = (await res.json()) as ProductsResponse
    if (json.success === true && json.data?.products !== undefined) {
      return json.data.products
    }
    return []
  } catch {
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch('http://localhost:4101/categories', {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const json = (await res.json()) as CategoriesResponse
    if (json.success === true && json.data?.categories !== undefined) {
      return json.data.categories
    }
    return []
  } catch {
    return []
  }
}

export default async function Home(): Promise<React.JSX.Element> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  // Ensure products is always an array before slicing
  const productList = Array.isArray(products) ? products : []
  const featuredProducts = productList.slice(0, 8)
  const newArrivals = productList.slice(0, 8)
  const popularProducts = productList.slice(0, 4)

  return (
    <main className="min-h-screen w-full bg-white">
      <Navbar />
      <HeroSection />
      <div className="h-0" /> {/* Seamless transition from black hero */}
      <CategorySection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <PopularProducts products={popularProducts} />
      <PromoBanner />
      <NewArrivals products={newArrivals} />
      <Newsletter />
      <Footer />
    </main>
  )
}
