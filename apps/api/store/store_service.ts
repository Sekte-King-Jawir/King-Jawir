import { storeRepository } from './store_repository'
import { prisma } from '../lib/db'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

// Helper untuk generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const storeService = {
  // Create store (CUSTOMER -> SELLER upgrade)
  async create(userId: string, data: { name: string; slug?: string }) {
    // Check apakah user sudah punya store
    const existingStore = await storeRepository.findByUserId(userId)
    if (existingStore) {
      return errorResponse('Anda sudah memiliki toko', ErrorCode.ALREADY_EXISTS)
    }

    // Validasi name
    if (!data.name || data.name.trim().length === 0) {
      return errorResponse('Nama toko tidak boleh kosong', ErrorCode.VALIDATION_ERROR)
    }

    // Generate atau validate slug
    const storeSlug = data.slug || generateSlug(data.name)

    // Check slug unique
    if (await storeRepository.slugExists(storeSlug)) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    // Create store dan upgrade role ke SELLER dalam transaction
    const store = await prisma.$transaction(async tx => {
      // Create store
      const newStore = await tx.store.create({
        data: {
          userId,
          name: data.name,
          slug: storeSlug,
        },
      })

      // Upgrade user role ke SELLER
      await tx.user.update({
        where: { id: userId },
        data: { role: 'SELLER' },
      })

      return newStore
    })

    return successResponse('Toko berhasil dibuat! Role Anda sekarang SELLER', {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        createdAt: store.createdAt,
      },
    })
  },

  // Get my store
  async getMyStore(userId: string) {
    const store = await storeRepository.findByUserId(userId)

    if (!store) {
      return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
    }

    return successResponse('Store ditemukan', {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        productCount: store._count?.products || 0,
        createdAt: store.createdAt,
      },
    })
  },

  // Update my store
  async update(userId: string, data: { name?: string; slug?: string }) {
    const store = await storeRepository.findByUserId(userId)

    if (!store) {
      return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
    }

    // Check slug unique jika diubah
    if (data.slug && (await storeRepository.slugExists(data.slug, store.id))) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    const updated = await storeRepository.update(store.id, data)

    return successResponse('Toko berhasil diupdate', {
      store: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        createdAt: updated.createdAt,
      },
    })
  },

  // Get store by slug (public)
  async getBySlug(slug: string) {
    const store = await storeRepository.findBySlug(slug)

    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    return successResponse('Store ditemukan', {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        productCount: store._count?.products || 0,
        owner: store.user,
        createdAt: store.createdAt,
      },
    })
  },

  // Delete store (downgrade SELLER -> CUSTOMER)
  async deleteStore(userId: string) {
    const store = await storeRepository.findByUserId(userId)

    if (!store) {
      return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
    }

    // Check if store has active orders
    const hasActiveOrders = await storeRepository.hasActiveOrders(store.id)
    if (hasActiveOrders) {
      return errorResponse(
        'Tidak dapat menghapus toko. Masih ada pesanan yang belum selesai',
        ErrorCode.BAD_REQUEST
      )
    }

    // Delete store and downgrade role dalam transaction
    await prisma.$transaction(async tx => {
      // Delete all products first (cascade)
      await tx.product.deleteMany({
        where: { storeId: store.id },
      })

      // Delete store
      await tx.store.delete({
        where: { id: store.id },
      })

      // Downgrade user role ke CUSTOMER
      await tx.user.update({
        where: { id: userId },
        data: { role: 'CUSTOMER' },
      })
    })

    return successResponse('Toko berhasil dihapus. Role Anda sekarang CUSTOMER', null)
  },
}
