'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type {
  SellerProduct,
  Category,
  ProductsApiResponse,
  CategoriesApiResponse,
  CreateProductData,
} from './types'
import type { User, AuthMeResponse } from '../types'
import { Navbar, Sidebar } from '../components'
import { ProductsTable, ProductForm, DeleteModal } from './components/index'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101') + '/api'

export default function SellerProductsPage(): React.JSX.Element {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<SellerProduct | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/products/mine?page=${page}&limit=10`, {
        credentials: 'include',
      })
      const result = (await res.json()) as ProductsApiResponse

      if (result.success && result.data !== undefined) {
        setProducts(result.data.products)
        setTotalPages(result.data.pagination.totalPages)
      }
    } catch {
      setError('Gagal memuat produk')
    }
  }, [page])

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // Check auth
        const authRes = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include',
        })
        const authData = (await authRes.json()) as AuthMeResponse

        if (!authData.success || authData.data === undefined) {
          router.push('/auth/login')
          return
        }

        const currentUser = authData.data.user
        if (currentUser.role !== 'SELLER' && currentUser.role !== 'ADMIN') {
          router.push('/seller/store')
          return
        }

        setUser(currentUser)

        // Fetch products
        await fetchProducts()

        // Fetch categories
        const catRes = await fetch(`${API_URL}/categories`)
        const catData = (await catRes.json()) as CategoriesApiResponse
        if (catData.success && catData.data !== undefined) {
          setCategories(catData.data)
        }
      } catch {
        setError('Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [router, fetchProducts])

  const handleCreateProduct = async (data: CreateProductData): Promise<void> => {
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as { success: boolean; message: string }

      if (result.success) {
        setSuccess('Produk berhasil ditambahkan!')
        setShowForm(false)
        await fetchProducts()
      } else {
        setError(result.message ?? 'Gagal menambah produk')
      }
    } catch {
      setError('Gagal menambah produk')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProduct = async (data: CreateProductData): Promise<void> => {
    if (editingProduct === null) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/products/${editingProduct.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = (await res.json()) as { success: boolean; message: string }

      if (result.success) {
        setSuccess('Produk berhasil diperbarui!')
        setEditingProduct(null)
        await fetchProducts()
      } else {
        setError(result.message ?? 'Gagal memperbarui produk')
      }
    } catch {
      setError('Gagal memperbarui produk')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (): Promise<void> => {
    if (deletingProduct === null) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/products/${deletingProduct.slug}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const result = (await res.json()) as { success: boolean; message: string }

      if (result.success) {
        setSuccess('Produk berhasil dihapus!')
        setDeletingProduct(null)
        await fetchProducts()
      } else {
        setError(result.message ?? 'Gagal menghapus produk')
      }
    } catch {
      setError('Gagal menghapus produk')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <LoadingSkeleton />
          </main>
        </div>
      </div>
    )
  }

  if (user === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Login Diperlukan
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Silakan login untuk mengakses halaman ini
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar userName={user.name} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Kelola Produk
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Tambah, edit, atau hapus produk di toko Anda
                </p>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                Tambah Produk
              </button>
            </div>

            {/* Alerts */}
            {error !== '' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            {success !== '' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400">
                {success}
              </div>
            )}

            {/* Products Table */}
            <ProductsTable
              products={products}
              onEdit={setEditingProduct}
              onDelete={setDeletingProduct}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {showForm ? (
        <ProductForm
          categories={categories}
          onSubmit={handleCreateProduct}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
        />
      ) : null}

      {/* Edit Modal */}
      {editingProduct !== null && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={handleUpdateProduct}
          onCancel={() => setEditingProduct(null)}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Modal */}
      {deletingProduct !== null && (
        <DeleteModal
          productName={deletingProduct.name}
          onConfirm={handleDeleteProduct}
          onCancel={() => setDeletingProduct(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64" />
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-36" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={`skeleton-${n}`} className="h-16 bg-slate-100 dark:bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
