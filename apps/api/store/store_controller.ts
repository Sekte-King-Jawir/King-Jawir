import { storeService } from './store_service'

export const storeController = {
  async create(userId: string, name: string, slug?: string) {
    return storeService.createStore(userId, name, slug)
  },

  async getMyStore(userId: string) {
    return storeService.getMyStore(userId)
  },

  async update(userId: string, data: { name?: string; slug?: string }) {
    return storeService.updateStore(userId, data)
  },

  async getBySlug(slug: string) {
    return storeService.getStoreBySlug(slug)
  },

  async delete(userId: string) {
    return storeService.deleteStore(userId)
  }
}
