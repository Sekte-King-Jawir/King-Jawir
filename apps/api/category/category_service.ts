import { categoryRepository } from './category_repository'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

// Helper untuk generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const categoryService = {
  // Get all categories (public)
  async getAll() {
    const categories = await categoryRepository.findAll()

    return successResponse('Categories retrieved', {
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        productCount: c._count.products,
      })),
    })
  },

  // Get category by slug (public)
  async getBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug)

    if (!category) {
      return errorResponse('Category tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    return successResponse('Category ditemukan', {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: category._count.products,
      },
    })
  },

  // Create category (ADMIN only)
  async create(name: string, slug?: string) {
    // Validasi name tidak kosong
    if (!name || name.trim().length === 0) {
      return errorResponse('Nama category tidak boleh kosong', ErrorCode.VALIDATION_ERROR)
    }

    // Check name unique
    if (await categoryRepository.nameExists(name)) {
      return errorResponse('Nama category sudah ada', ErrorCode.ALREADY_EXISTS)
    }

    const categorySlug = slug || generateSlug(name)

    // Check slug unique
    if (await categoryRepository.slugExists(categorySlug)) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    const category = await categoryRepository.create({
      name,
      slug: categorySlug,
    })

    return successResponse('Category berhasil dibuat', {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    })
  },

  // Update category (ADMIN only)
  async update(id: string, data: { name?: string; slug?: string }) {
    const category = await categoryRepository.findById(id)

    if (!category) {
      return errorResponse('Category tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Check name unique jika diubah
    if (data.name && (await categoryRepository.nameExists(data.name, id))) {
      return errorResponse('Nama category sudah ada', ErrorCode.ALREADY_EXISTS)
    }

    // Check slug unique jika diubah
    if (data.slug && (await categoryRepository.slugExists(data.slug, id))) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    const updated = await categoryRepository.update(id, data)

    return successResponse('Category berhasil diupdate', {
      category: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
      },
    })
  },

  // Delete category (ADMIN only)
  async delete(id: string) {
    const category = await categoryRepository.findById(id)

    if (!category) {
      return errorResponse('Category tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Check apakah masih ada products
    if (category._count.products > 0) {
      return errorResponse(
        `Tidak bisa hapus category yang masih memiliki ${category._count.products} produk`,
        ErrorCode.VALIDATION_ERROR
      )
    }

    await categoryRepository.delete(id)

    return successResponse('Category berhasil dihapus')
  },
}
