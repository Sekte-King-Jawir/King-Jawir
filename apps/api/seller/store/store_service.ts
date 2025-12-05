import { storeRepository } from '../../store/store_repository'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const sellerStoreService = {
  // Get store profile
  async getStore(userId: string) {
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Map to SellerStore format
    const mappedStore = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      logo: store.logo,
      productCount: store._count.products,
      createdAt: store.createdAt.toISOString(),
    }

    return successResponse('Berhasil mengambil data toko', mappedStore)
  },

  // Create store
  async createStore(
    userId: string,
    data: {
      name: string
      description?: string
      logo?: string
    }
  ) {
    // Generate slug
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug exists
    const slugExists = await storeRepository.findBySlug(slug)
    let finalSlug = slug
    if (slugExists) {
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      finalSlug = `${slug}-${randomSuffix}`
    }

    const storeData: any = {
      userId,
      name: data.name,
      slug: finalSlug,
    }
    if (data.description != null) storeData.description = data.description
    if (data.logo != null) storeData.logo = data.logo

    const store = await storeRepository.create(storeData)

    // Map to SellerStore format
    const mappedStore = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      logo: store.logo,
      productCount: 0, // New store has no products
      createdAt: store.createdAt.toISOString(),
    }

    return successResponse('Toko berhasil dibuat', mappedStore)
  },

  // Update store profile
  async updateStore(
    userId: string,
    data: {
      name?: string
      description?: string
      logo?: string
    }
  ) {
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Jika name berubah, generate slug baru
    let updateData: any = { ...data }
    if (data.name && data.name !== store.name) {
      const newSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Cek slug exists (exclude store ini)
      const slugExists = await storeRepository.slugExists(newSlug, store.id)
      if (slugExists) {
        const randomSuffix = Math.random().toString(36).substring(2, 8)
        updateData.slug = `${newSlug}-${randomSuffix}`
      } else {
        updateData.slug = newSlug
      }
    }

    await storeRepository.update(store.id, updateData)

    // Get updated store with count
    const finalStore = await storeRepository.findByUserId(userId)
    if (!finalStore) {
      return errorResponse('Toko tidak ditemukan setelah update', ErrorCode.NOT_FOUND)
    }

    // Map to SellerStore format
    const mappedStore = {
      id: finalStore.id,
      name: finalStore.name,
      slug: finalStore.slug,
      description: finalStore.description,
      logo: finalStore.logo,
      productCount: finalStore._count.products,
      createdAt: finalStore.createdAt.toISOString(),
    }

    return successResponse('Toko berhasil diupdate', mappedStore)
  },
}
