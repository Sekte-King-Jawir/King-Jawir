'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SellerOrder, OrdersApiResponse } from './types'
import type { User, AuthMeResponse } from '../types'
import { Navbar, Sidebar } from '../components'
import { OrdersTable, UpdateStatusModal } from './components/index'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101') + '/api'

export default function SellerOrdersPage(): React.JSX.Element {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal state
  const [updatingOrder, setUpdatingOrder] = useState<SellerOrder | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination & filters
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = useCallback(async (): Promise<void> => {
    try {
      let url = `${API_URL}/orders/seller?page=${page}&limit=10`
      if (statusFilter !== '') {
        url += `&status=${statusFilter}`
      }

      const res = await fetch(url, {
        credentials: 'include',
      })
      const result = (await res.json()) as OrdersApiResponse

      if (result.success && result.data !== undefined) {
        setOrders(result.data.orders)
        setTotalPages(result.data.pagination.totalPages)
      }
    } catch {
      setError('Gagal memuat pesanan')
    }
  }, [page, statusFilter])

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
        await fetchOrders()
      } catch {
        setError('Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [router, fetchOrders])

  const handleUpdateStatus = async (orderId: string, newStatus: string): Promise<void> => {
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
        setUpdatingOrder(null)
        await fetchOrders()
      } else {
        setError(result.message ?? 'Gagal memperbarui status')
      }
    } catch {
      setError('Gagal memperbarui status')
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
              </div>
            )}
            {success !== '' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400">
                {success}
              </div>
            )}

            {/* Filter */}
            <div className="mb-6">
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Menunggu Pembayaran</option>
                <option value="PAID">Sudah Dibayar</option>
                <option value="SHIPPED">Dikirim</option>
                <option value="DELIVERED">Selesai</option>
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
