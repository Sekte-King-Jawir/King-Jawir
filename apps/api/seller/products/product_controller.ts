import { sellerProductService } from './product_service'

export const sellerProductController = {
  async getProducts(userId: string, page: number, limit: number) {
    return sellerProductService.getProducts(userId, page, limit)
  },

  async getProductById(userId: string, productId: string) {
    return sellerProductService.getProductById(userId, productId)
  },

  async createProduct(
    userId: string,
    data: {
      categoryId: string
      name: string
      description?: string
      price: number
      stock: number
      image?: File
    }
  ) {
    return sellerProductService.createProduct(userId, data)
  },

  async updateProduct(
    userId: string,
    productId: string,
    data: {
      categoryId?: string
      name?: string
      description?: string
      price?: number
      stock?: number
      image?: File
    }
  ) {
    return sellerProductService.updateProduct(userId, productId, data)
  },

  async deleteProduct(userId: string, productId: string) {
    return sellerProductService.deleteProduct(userId, productId)
  },
}
