'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'
import { Breadcrumb, FilterSidebar, ProductGrid, Pagination, SortDropdown } from './components'

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
}

interface Category {
  id: string
  name: string
  slug: string
  _count?: {
    products: number
  }
}

interface ProductsData {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'By rating' },
]

export function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = useState('rating')
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([])

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`)
        if (res.ok) {
          const data = await res.json()
          setCategories(data.data?.categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        const categoryIds = selectedFilters.brand || []
        if (categoryIds.length > 0 && categoryIds[0]) {
          params.set('categoryId', categoryIds[0])
        }

        const page = searchParams.get('page') || '1'
        params.set('page', page)
        params.set('limit', '9')

        const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          const productsData: ProductsData = data.data
          setProducts(productsData.products || [])
          setTotalProducts(productsData.total || 0)
          setCurrentPage(productsData.page || 1)
          setTotalPages(productsData.totalPages || 1)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedFilters, searchParams])

  const handleFilterChange = useCallback((key: string, values: string[]) => {
    setSelectedFilters(prev => ({ ...prev, [key]: values }))
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleAddToCart = useCallback((productId: string) => {
    console.log('Add to cart:', productId)
    // TODO: Implement add to cart
  }, [])

  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlistedIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }, [])

  const filterGroups = [
    {
      title: 'Brand',
      key: 'brand',
      searchable: true,
      options: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        count: cat._count?.products,
      })),
    },
    {
      title: 'Battery capacity',
      key: 'battery',
      options: [],
    },
    {
      title: 'Screen type',
      key: 'screen',
      options: [],
    },
    {
      title: 'Screen diagonal',
      key: 'diagonal',
      options: [],
    },
    {
      title: 'Protection class',
      key: 'protection',
      options: [],
    },
    {
      title: 'Built-in memory',
      key: 'memory',
      options: [],
    },
  ]

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/products' },
    { label: 'Smartphones' },
  ]

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.layout}>
        <FilterSidebar
          filterGroups={filterGroups}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Selected Products: <span className={styles.count}>{totalProducts}</span>
            </h1>

            <SortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
          </div>

          {loading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : (
            <>
              <ProductGrid
                products={products}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistedIds={wishlistedIds}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
