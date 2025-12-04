import { storeService } from './store_service'

export const storeController = {
  async getAll() {
    return storeService.getAll()
  },

  async create(userId: string, data: { name: string; slug?: string; description?: string; logo?: string }) {
    return storeService.create(userId, data)
  },

  async getMyStore(userId: string) {
    return storeService.getMyStore(userId)
  },

  async update(userId: string, data: { name?: string; slug?: string; description?: string; logo?: string }) {
    return storeService.update(userId, data)
  },

  async getBySlug(slug: string) {
    return storeService.getBySlug(slug)
  },

  async delete(userId: string) {
    return storeService.deleteStore(userId)
  },
}
