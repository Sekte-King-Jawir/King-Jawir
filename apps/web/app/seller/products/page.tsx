'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSellerProducts, useSellerUrls, useSellerAuth } from '@/hooks'
import { SellerNavbar, SellerSidebar, ProductsTable, ProductForm, DeleteModal } from '@repo/ui'
import type { SellerProduct, CreateProductData } from '@/types'

export default function SellerProductsPage(): React.JSX.Element {
  const router = useRouter()
  const urls = useSellerUrls()
  const { user, isLoading: authLoading, isSeller } = useSellerAuth()
  const {
    products,
    categories,
    isLoading,
    isSubmitting,
    error,
    success,
    page,
    totalPages,
    setPage,
    createProduct,
    updateProduct,
    deleteProduct,
    clearMessages,
  } = useSellerProducts()

  // Modal states
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<SellerProduct | null>(null)

  // Redirect if not logged in or not seller
  useEffect(() => {
    if (!authLoading) {
      if (user === null) {
        router.push('/seller/auth/login?redirect=/seller/products')
      }
    }
  }, [authLoading, user, router])

  const handleCreateProduct = async (data: CreateProductData): Promise<void> => {
    const created = await createProduct(data)
    if (created) {
      setShowForm(false)
    }
  }

  const handleUpdateProduct = async (data: CreateProductData): Promise<void> => {
    if (editingProduct === null) return
    const updated = await updateProduct(editingProduct.slug, data)
    if (updated) {
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = async (): Promise<void> => {
    if (deletingProduct === null) return
    const deleted = await deleteProduct(deletingProduct.slug)
    if (deleted) {
      setDeletingProduct(null)
    }
  }

  // Loading State
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <SellerNavbar urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-8 ml-64">
            <LoadingSkeleton />
          </main>
        </div>
      </div>
    )
  }

  // Not logged in
  if (user === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <SellerNavbar urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-8 ml-64">
            <NeedLoginState loginUrl="/seller/auth/login?redirect=/seller/products" />
          </main>
        </div>
      </div>
    )
  }

  // Not a seller
  if (!isSeller) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <SellerNavbar userName={user.name} urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-8 ml-64">
            <NeedStoreState storeUrl={urls.seller.store} />
          </main>
        </div>
      </div>
    )
  }

  // If API reports that store is missing, show create-store state
  if (error !== '' && error.toLowerCase().includes('toko')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <SellerNavbar userName={user?.name} urls={urls} />
        <div className="flex">
          <SellerSidebar urls={urls} />
          <main className="flex-1 p-8 ml-64">
            <NeedStoreState storeUrl={urls.seller.store} />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SellerNavbar userName={user.name} urls={urls} />

      <div className="flex">
        <SellerSidebar urls={urls} />

        <main className="flex-1 p-8 ml-64">
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
                <button
                  onClick={clearMessages}
                  className="ml-2 text-red-800 dark:text-red-300 hover:underline"
                >
                  ✕
                </button>
              </div>
            )}
            {success !== '' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400">
                {success}
                <button
                  onClick={clearMessages}
                  className="ml-2 text-green-800 dark:text-green-300 hover:underline"
                >
                  ✕
                </button>
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
          title="Hapus Produk"
          message={`Apakah Anda yakin ingin menghapus "${deletingProduct.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={() => void handleDeleteProduct()}
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

function NeedLoginState({ loginUrl }: { loginUrl: string }): React.JSX.Element {
  return (
    <div className="max-w-4xl">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <span className="text-6xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Diperlukan</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Silakan login untuk mengakses halaman ini
        </p>
        <Link
          href={loginUrl}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Masuk Sekarang
        </Link>
      </div>
    </div>
  )
}

function NeedStoreState({ storeUrl }: { storeUrl: string }): React.JSX.Element {
  return (
    <div className="max-w-4xl">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <span className="text-6xl mb-4 block">🏪</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Toko Belum Ada</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Buat toko terlebih dahulu untuk mengelola produk
        </p>
        <Link
          href={storeUrl}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Buat Toko
        </Link>
      </div>
    </div>
  )
}
