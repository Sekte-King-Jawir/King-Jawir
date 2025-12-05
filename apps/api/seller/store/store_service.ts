import { storeRepository } from '../../store/store_repository'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const sellerStoreService = {
  // Get store profile
  async getStore(userId: string) {
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    return successResponse('Berhasil mengambil data toko', store)
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

    const updatedStore = await storeRepository.update(store.id, updateData)
    return successResponse('Toko berhasil diupdate', updatedStore)
  },
}
