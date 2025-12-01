import { categoryService } from './category_service'

export const categoryController = {
  async getAll() {
    return categoryService.getAll()
  },

  async getBySlug(slug: string) {
    return categoryService.getBySlug(slug)
  },

  async create(name: string, slug?: string) {
    return categoryService.create(name, slug)
  },

  async update(id: string, data: { name?: string; slug?: string }) {
    return categoryService.update(id, data)
  },

  async delete(id: string) {
    return categoryService.delete(id)
  }
}
