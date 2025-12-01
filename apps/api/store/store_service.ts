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
  async createStore(userId: string, name: string, slug?: string) {
    // Check apakah user sudah punya store
    const existingStore = await storeRepository.findByUserId(userId)
    if (existingStore) {
      return errorResponse('Anda sudah memiliki toko', ErrorCode.ALREADY_EXISTS)
    }

    // Generate atau validate slug
    const storeSlug = slug || generateSlug(name)
    
    // Check slug unique
    if (await storeRepository.slugExists(storeSlug)) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    // Create store dan upgrade role ke SELLER dalam transaction
    const store = await prisma.$transaction(async (tx) => {
      // Create store
      const newStore = await tx.store.create({
        data: {
          userId,
          name,
          slug: storeSlug
        }
      })

      // Upgrade user role ke SELLER
      await tx.user.update({
        where: { id: userId },
        data: { role: 'SELLER' }
      })

      return newStore
    })

    return successResponse('Toko berhasil dibuat! Role Anda sekarang SELLER', {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        createdAt: store.createdAt
      }
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
        productCount: store._count.products,
        createdAt: store.createdAt
      }
    })
  },

  // Update my store
  async updateStore(userId: string, data: { name?: string; slug?: string }) {
    const store = await storeRepository.findByUserId(userId)
    
    if (!store) {
      return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
    }

    // Check slug unique jika diubah
    if (data.slug && await storeRepository.slugExists(data.slug, store.id)) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    const updated = await storeRepository.update(store.id, data)

    return successResponse('Toko berhasil diupdate', {
      store: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        createdAt: updated.createdAt
      }
    })
  },

  // Get store by slug (public)
  async getStoreBySlug(slug: string) {
    const store = await storeRepository.findBySlug(slug)
    
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    return successResponse('Store ditemukan', {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        productCount: store._count.products,
        owner: store.user,
        createdAt: store.createdAt
      }
    })
  }
}
