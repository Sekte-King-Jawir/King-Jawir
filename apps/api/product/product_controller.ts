import { productService } from './product_service'
import type { ProductFilter } from './product_repository'

export const productController = {
  async getAll(filter?: ProductFilter, page?: number, limit?: number) {
    return productService.getAll(filter, page, limit)
  },

  async getBySlug(slug: string) {
    return productService.getBySlug(slug)
  },

  async getMyProducts(userId: string, page?: number, limit?: number) {
    return productService.getMyProducts(userId, page, limit)
  },

  async create(
    userId: string,
    data: {
      categoryId: string
      name: string
      slug?: string
      price: number
      stock: number
      image?: string
    }
  ) {
    return productService.create(userId, data)
  },

  async update(
    userId: string,
    productId: string,
    data: {
      categoryId?: string
      name?: string
      slug?: string
      price?: number
      stock?: number
      image?: string
    }
  ) {
    return productService.update(userId, productId, data)
  },

  async delete(userId: string, productId: string) {
    return productService.delete(userId, productId)
  },

  async getByStoreSlug(storeSlug: string, page?: number, limit?: number) {
    return productService.getByStoreSlug(storeSlug, page, limit)
  },
}
