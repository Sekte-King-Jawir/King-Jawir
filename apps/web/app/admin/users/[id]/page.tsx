'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminApi, type User } from '@/lib/api/admin'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default function UserDetailPage({ params }: UserDetailPageProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'SELLER' | 'ADMIN'>('CUSTOMER')
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()

  const loadUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await adminApi.getUserById(params.id)
      setUser(data)
      setSelectedRole(data.role)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    void loadUser()
  }, [loadUser])

  async function handleUpdateRole(): Promise<void> {
    if (user === null) return

    try {
      setActionLoading(true)
      await adminApi.updateUserRole(user.id, selectedRole)
      setShowRoleModal(false)
      void loadUser()
    } catch (err) {
      console.error('Failed to update role:', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeleteUser(): Promise<void> {
    if (user === null) return

    try {
      setActionLoading(true)
      await adminApi.deleteUser(user.id)
      router.push('/admin/users')
    } catch (err) {
      console.error('Failed to delete user:', err instanceof Error ? err.message : 'Unknown error')
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="bg-white rounded-lg shadow p-8 h-96" />
          </div>
        </div>
      </div>
    )
  }

  if ((error !== null && error.length > 0) || user === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/admin/users"
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
          >
            ← Back to Users
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{(error !== null && error.length > 0) ? error : 'User not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
          >
            ← Back to Users
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Detail</h1>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="h-24 w-24 flex-shrink-0">
                {user.avatar !== null && user.avatar.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-24 w-24 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                  {user.emailVerified === true ? (
                    <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      ✓ Email Verified
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{user.phone ?? '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Joined
                </label>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Address
                </label>
                <p className="text-gray-900">{user.address ?? '-'}</p>
              </div>
              {user.bio !== null && user.bio.length > 0 ? (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bio
                  </label>
                  <p className="text-gray-900">{user.bio}</p>
                </div>
              ) : null}
            </div>

            {/* Store Info */}
            {user.store !== null && user.store !== undefined ? (
              <div className="border-t pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Store Name
                      </label>
                      <p className="text-gray-900 font-medium">{user.store.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Store Slug
                      </label>
                      <p className="text-gray-900">@{user.store.slug}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Products
                      </label>
                      <p className="text-gray-900">{user.store._count?.products ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Statistics */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {user._count?.orders ?? 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium mb-1">Reviews</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {user._count?.reviews ?? 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium mb-1">Cart Items</p>
                  <p className="text-2xl font-bold text-green-900">
                    {user._count?.cart ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t bg-gray-50 px-8 py-4 flex gap-3">
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Change Role
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be
              undone and will delete all related data (orders, reviews, cart, store, products).
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => { void handleDeleteUser() }}
                disabled={actionLoading}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Change Role Modal */}
      {showRoleModal ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Change User Role</h3>
            <p className="text-gray-600 mb-4">
              Change role for <strong>{user.name}</strong>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'CUSTOMER' | 'SELLER' | 'ADMIN')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={actionLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => { void handleUpdateRole() }}
                disabled={actionLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    CUSTOMER: 'bg-blue-100 text-blue-800',
    SELLER: 'bg-green-100 text-green-800',
    ADMIN: 'bg-purple-100 text-purple-800',
  }
  return colors[role] ?? 'bg-gray-100 text-gray-800'
}
