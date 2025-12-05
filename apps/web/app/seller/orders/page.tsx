'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSellerOrders, useSellerUrls } from '@/hooks'
import {
  SellerNavbar,
  SellerSidebar,
  OrdersTable,
  UpdateStatusModal,
} from '@repo/ui'
import type { SellerOrder, OrderStatus } from '@/types'

export default function SellerOrdersPage(): React.JSX.Element {
  const router = useRouter()
  const urls = useSellerUrls()
  const {
    user,
    orders,
    isLoading,
    isSubmitting,
    error,
    success,
    page,
    totalPages,
    statusFilter,
    isSeller,
    setPage,
    setStatusFilter,
    updateOrderStatus,
    clearMessages,
  } = useSellerOrders()

  // Modal state
  const [updatingOrder, setUpdatingOrder] = useState<SellerOrder | null>(null)

  // Redirect if not logged in or not seller
  useEffect(() => {
    if (!isLoading) {
      if (user === null) {
        router.push(`/auth/login?redirect=${urls.seller.orders}`)
      } else if (!isSeller) {
        router.push(urls.seller.store)
      }
    }
  }, [isLoading, user, isSeller, router, urls.seller.orders, urls.seller.store])

  const handleUpdateStatus = async (orderId: string, newStatus: string): Promise<void> => {
    const updated = await updateOrderStatus(orderId, newStatus as OrderStatus)
    if (updated) {
      setUpdatingOrder(null)
    }
  }

  // Loading State
  if (isLoading) {
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
            <NeedLoginState loginUrl={`/auth/login?redirect=${urls.seller.orders}`} />
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SellerNavbar userName={user.name} urls={urls} />

      <div className="flex">
        <SellerSidebar urls={urls} />

        <main className="flex-1 p-8 ml-64">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Pesanan Masuk
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Kelola dan proses pesanan dari pelanggan
              </p>
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

            {/* Filter */}
            <div className="mb-6">
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value as OrderStatus | '')
                  setPage(1)
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Menunggu Pembayaran</option>
                <option value="PAID">Sudah Dibayar</option>
                <option value="SHIPPED">Dikirim</option>
                <option value="DONE">Selesai</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>

            {/* Orders Table */}
            <OrdersTable
              orders={orders}
              onUpdateStatus={setUpdatingOrder}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </main>
      </div>

      {/* Update Status Modal */}
      {updatingOrder !== null && (
        <UpdateStatusModal
          order={updatingOrder}
          onConfirm={handleUpdateStatus}
          onCancel={() => setUpdatingOrder(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  )
}

function LoadingSkeleton(): React.JSX.Element {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={`skeleton-${n}`} className="h-20 bg-slate-100 dark:bg-slate-700 rounded" />
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
          Buat toko terlebih dahulu untuk melihat pesanan
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
