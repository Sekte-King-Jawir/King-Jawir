import { storeService } from './store_service'

export const storeController = {
  async create(userId: string, name: string, slug?: string) {
    return storeService.create(userId, { name, ...(slug !== undefined && { slug }) })
  },

  async getMyStore(userId: string) {
    return storeService.getMyStore(userId)
  },

  async update(userId: string, data: { name?: string; slug?: string }) {
    return storeService.update(userId, data)
  },

  async getBySlug(slug: string) {
    return storeService.getBySlug(slug)
  },

  async delete(userId: string) {
    return storeService.deleteStore(userId)
  },
}
