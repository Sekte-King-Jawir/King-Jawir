'use client'

import { useState, useEffect, useCallback } from 'react'
import { API_ENDPOINTS } from '@/lib/config/api'
import type {
  SellerStore,
  CreateStoreData,
  UpdateStoreData,
  StoreApiResponse,
  SellerProduct,
  CreateProductData,
  ProductsApiResponse,
  CategoriesApiResponse,
  Category,
  SellerOrder,
  OrdersApiResponse,
  SellerUrls,
  User,
  AuthMeResponse,
} from '@/types'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'}`

// ============================================================================
// URL HOOK - Provides consistent URLs across seller pages
// ============================================================================

export function useSellerUrls(): SellerUrls {
  return {
    home: '/',
    products: '/products',
    seller: {
      dashboard: '/seller',
      store: '/seller/store',
      products: '/seller/products',
      orders: '/seller/orders',
      analytics: '/seller/analytics',
    },
    priceAnalysis: '/price-analysis',
  }
}

// ============================================================================
// SELLER STORE HOOK
// ============================================================================

interface UseSellerStoreReturn {
  user: User | null
  store: SellerStore | null
  isLoading: boolean
  isSubmitting: boolean
  error: string
  success: string
  isSeller: boolean
  createStore: (data: CreateStoreData) => Promise<boolean>
  updateStore: (data: UpdateStoreData) => Promise<boolean>
  refresh: () => Promise<void>
  clearMessages: () => void
}

export function useSellerStore(): UseSellerStoreReturn {
  const [user, setUser] = useState<User | null>(null)
  const [store, setStore] = useState<SellerStore | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchData = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      // Check auth with seller endpoint
      const meRes = await fetch(`${API_URL}${API_ENDPOINTS.SELLER_AUTH.ME}`, { credentials: 'include' })
      const meData = (await meRes.json()) as AuthMeResponse

      if (!meData.success || meData.data === undefined) {
        setUser(null)
        return
      }

      setUser(meData.data.user)

      // Fetch store if user is seller
      if (meData.data.user.role === 'SELLER' || meData.data.user.role === 'ADMIN') {
        const storeRes = await fetch(`${API_URL}${API_ENDPOINTS.SELLER.STORE}`, { credentials: 'include' })
        const storeData = (await storeRes.json()) as StoreApiResponse

        if (storeData.success && storeData.data !== undefined) {
          setStore(storeData.data.store)
        }
      }
    } catch {
      setError('Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const createStore = useCallback(async (data: CreateStoreData): Promise<boolean> => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as StoreApiResponse

      if (result.success && result.data !== undefined) {
        setStore(result.data.store)
        setUser(prev => (prev !== null ? { ...prev, role: 'SELLER' } : null))
        setSuccess('Toko berhasil dibuat! Anda sekarang menjadi SELLER.')
        return true
      } else {
        setError(result.message ?? 'Gagal membuat toko')
        return false
      }
    } catch {
      setError('Gagal membuat toko')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const updateStore = useCallback(async (data: UpdateStoreData): Promise<boolean> => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER.STORE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as StoreApiResponse

      if (result.success && result.data !== undefined) {
        setStore(result.data.store)
        setSuccess('Toko berhasil diperbarui!')
        return true
      } else {
        setError(result.message ?? 'Gagal memperbarui toko')
        return false
      }
    } catch {
      setError('Gagal memperbarui toko')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  return {
    user,
    store,
    isLoading,
    isSubmitting,
    error,
    success,
    isSeller: user !== null && (user.role === 'SELLER' || user.role === 'ADMIN'),
    createStore,
    updateStore,
    refresh: fetchData,
    clearMessages,
  }
}

// ============================================================================
// SELLER PRODUCTS HOOK
// ============================================================================

interface UseSellerProductsReturn {
  user: User | null
  products: SellerProduct[]
  categories: Category[]
  isLoading: boolean
  isSubmitting: boolean
  error: string
  success: string
  page: number
  totalPages: number
  isSeller: boolean
  setPage: (page: number) => void
  createProduct: (data: CreateProductData) => Promise<boolean>
  updateProduct: (slug: string, data: CreateProductData) => Promise<boolean>
  deleteProduct: (slug: string) => Promise<boolean>
  refresh: () => Promise<void>
  clearMessages: () => void
}

export function useSellerProducts(): UseSellerProductsReturn {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER.PRODUCTS}?page=${page}&limit=10`, {
        credentials: 'include',
      })
      const result = (await res.json()) as ProductsApiResponse

      if (result.success && result.data !== undefined) {
        setProducts(result.data.products)
        setTotalPages(result.data.totalPages)
      }
    } catch {
      setError('Gagal memuat produk')
    }
  }, [page])

  const fetchData = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      // Check auth with seller endpoint
      const authRes = await fetch(`${API_URL}${API_ENDPOINTS.SELLER_AUTH.ME}`, { credentials: 'include' })
      const authData = (await authRes.json()) as AuthMeResponse

      if (!authData.success || authData.data === undefined) {
        setUser(null)
        return
      }

      setUser(authData.data.user)

      // Fetch products
      await fetchProducts()

      // Fetch categories
      const catRes = await fetch(`${API_URL}/api/categories`)
      const catData = (await catRes.json()) as CategoriesApiResponse
      if (catData.success && catData.data !== undefined) {
        // Normalize data shape: API may return data as Category[] or { categories: Category[] }
        if (Array.isArray(catData.data)) {
          setCategories(catData.data)
        } else {
          const maybeObj = catData.data as unknown as { categories?: Category[] }
          if (Array.isArray(maybeObj.categories)) {
            setCategories(maybeObj.categories)
          } else {
            // Fallback to empty array to avoid runtime errors
            setCategories([])
          }
        }
      }
    } catch {
      setError('Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }, [fetchProducts])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!isLoading) {
      void fetchProducts()
    }
  }, [page, fetchProducts, isLoading])

  const createProduct = useCallback(
    async (data: CreateProductData): Promise<boolean> => {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      try {
        const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER.PRODUCTS}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data),
        })

        const result = (await res.json()) as { success: boolean; message: string }

        if (result.success) {
          setSuccess('Produk berhasil ditambahkan!')
          await fetchProducts()
          return true
        } else {
          setError(result.message ?? 'Gagal menambah produk')
          return false
        }
      } catch {
        setError('Gagal menambah produk')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchProducts]
  )

  const updateProduct = useCallback(
    async (id: string, data: CreateProductData): Promise<boolean> => {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      try {
        const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER.PRODUCT_BY_ID(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data),
        })

        const result = (await res.json()) as { success: boolean; message: string }

        if (result.success) {
          setSuccess('Produk berhasil diperbarui!')
          await fetchProducts()
          return true
        } else {
          setError(result.message ?? 'Gagal memperbarui produk')
          return false
        }
      } catch {
        setError('Gagal memperbarui produk')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchProducts]
  )

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      try {
        const res = await fetch(`${API_URL}${API_ENDPOINTS.SELLER.PRODUCT_BY_ID(id)}`, {
          method: 'DELETE',
          credentials: 'include',
        })

        const result = (await res.json()) as { success: boolean; message: string }

        if (result.success) {
          setSuccess('Produk berhasil dihapus!')
          await fetchProducts()
          return true
        } else {
          setError(result.message ?? 'Gagal menghapus produk')
          return false
        }
      } catch {
        setError('Gagal menghapus produk')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchProducts]
  )

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  return {
    user,
    products,
    categories,
    isLoading,
    isSubmitting,
    error,
    success,
    page,
    totalPages,
    isSeller: user !== null && (user.role === 'SELLER' || user.role === 'ADMIN'),
    setPage,
    createProduct,
    updateProduct,
    deleteProduct,
    refresh: fetchData,
    clearMessages,
  }
}

// ============================================================================
// SELLER ORDERS HOOK
// ============================================================================

interface UseSellerOrdersReturn {
  user: User | null
  orders: SellerOrder[]
  isLoading: boolean
  isSubmitting: boolean
  error: string
  success: string
  page: number
  totalPages: number
  statusFilter: string
  isSeller: boolean
  setPage: (page: number) => void
  setStatusFilter: (status: string) => void
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<boolean>
  refresh: () => Promise<void>
  clearMessages: () => void
}

export function useSellerOrders(): UseSellerOrdersReturn {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = useCallback(async (): Promise<void> => {
    try {
      let url = `${API_URL}/seller/orders?page=${page}&limit=10`
      if (statusFilter !== '') {
        url += `&status=${statusFilter}`
      }

      const res = await fetch(url, { credentials: 'include' })
      const result = (await res.json()) as OrdersApiResponse

      if (result.success && result.data !== undefined) {
        setOrders(result.data.orders)
        setTotalPages(result.data.pagination.totalPages)
      }
    } catch {
      setError('Gagal memuat pesanan')
    }
  }, [page, statusFilter])

  const fetchData = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      // Check auth
      const authRes = await fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      const authData = (await authRes.json()) as AuthMeResponse

      if (!authData.success || authData.data === undefined) {
        setUser(null)
        return
      }

      setUser(authData.data.user)
      await fetchOrders()
    } catch {
      setError('Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }, [fetchOrders])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!isLoading) {
      void fetchOrders()
    }
  }, [page, statusFilter, fetchOrders, isLoading])

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: string): Promise<boolean> => {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      try {
        const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        })

        const result = (await res.json()) as { success: boolean; message: string }

        if (result.success) {
          setSuccess('Status pesanan berhasil diperbarui!')
          await fetchOrders()
          return true
        } else {
          setError(result.message ?? 'Gagal memperbarui status')
          return false
        }
      } catch {
        setError('Gagal memperbarui status')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchOrders]
  )

  const handleSetStatusFilter = useCallback((status: string) => {
    setStatusFilter(status)
    setPage(1) // Reset to first page when filter changes
  }, [])

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  return {
    user,
    orders,
    isLoading,
    isSubmitting,
    error,
    success,
    page,
    totalPages,
    statusFilter,
    isSeller: user !== null && (user.role === 'SELLER' || user.role === 'ADMIN'),
    setPage,
    setStatusFilter: handleSetStatusFilter,
    updateOrderStatus,
    refresh: fetchData,
    clearMessages,
  }
}
