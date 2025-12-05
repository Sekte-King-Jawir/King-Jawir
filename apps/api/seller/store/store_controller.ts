import { sellerStoreService } from './store_service'

export const sellerStoreController = {
  async getStore(userId: string) {
    return sellerStoreService.getStore(userId)
  },

  async createStore(
    userId: string,
    data: {
      name: string
      description?: string
      logo?: string
    }
  ) {
    return sellerStoreService.createStore(userId, data)
  },

  async updateStore(
    userId: string,
    data: {
      name?: string
      description?: string
      logo?: string
    }
  ) {
    return sellerStoreService.updateStore(userId, data)
  },
}
