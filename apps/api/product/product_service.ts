import { productRepository } from './product_repository'
import type { ProductFilter } from './product_repository'
import { storeRepository } from '../store/store_repository'
import { categoryRepository } from '../category/category_repository'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

// Helper untuk generate slug
function generateSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now().toString(36)
  ) // Tambah unique suffix
}

export const productService = {
  // Get all products (public, dengan filter & pagination)
  async getAll(filter?: ProductFilter, page = 1, limit = 20) {
    const result = await productRepository.findAll(filter, page, limit)

    return successResponse('Products retrieved', {
      products: result.products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        image: p.image,
        category: p.category,
        store: p.store,
        reviewCount: p._count.reviews,
        createdAt: p.createdAt,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  },

  // Get product by slug (public)
  async getBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug)

    if (!product) {
      return errorResponse('Product tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    return successResponse('Product ditemukan', {
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        image: product.image,
        category: product.category,
        store: product.store,
        reviewCount: product._count.reviews,
        createdAt: product.createdAt,
      },
    })
  },

  // Get my products (SELLER)
  async getMyProducts(userId: string, page = 1, limit = 20) {
    const store = await storeRepository.findByUserId(userId)

    if (!store) {
      return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
    }

    const result = await productRepository.findByStoreId(store.id, page, limit)

    return successResponse('Products retrieved', {
      products: result.products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        image: p.image,
        category: p.category,
        reviewCount: p._count.reviews,
        createdAt: p.createdAt,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  },

  // Create product (SELLER)
  async create(
    userId: string,
    data: {
      categoryId: string
      name: string
      slug?: string
      description?: string
      price: number
      stock: number
      image?: string
    }
  ) {
    // Get user's store
    const store = await storeRepository.findByUserId(userId)

    if (!store) {
      return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
    }

    // Validate category
    const category = await categoryRepository.findById(data.categoryId)
    if (!category) {
      return errorResponse('Category tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Generate or validate slug
    const productSlug = data.slug || generateSlug(data.name)

    if (await productRepository.slugExists(productSlug)) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    // Validate price
    if (data.price < 0) {
      return errorResponse('Harga tidak boleh negatif', ErrorCode.VALIDATION_ERROR)
    }

    // Validate stock
    if (data.stock < 0) {
      return errorResponse('Stock tidak boleh negatif', ErrorCode.VALIDATION_ERROR)
    }

    const product = await productRepository.create({
      storeId: store.id,
      categoryId: data.categoryId,
      name: data.name,
      slug: productSlug,
      price: data.price,
      stock: data.stock,
      ...(data.description && { description: data.description }),
      ...(data.image && { image: data.image }),
    })

    return successResponse('Product berhasil dibuat', {
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        image: product.image,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
      },
    })
  },

  // Update product (SELLER - only own products)
  async update(
    userId: string,
    productId: string,
    data: {
      categoryId?: string
      name?: string
      slug?: string
      description?: string
      price?: number
      stock?: number
      image?: string
    }
  ) {
    const product = await productRepository.findById(productId)

    if (!product) {
      return errorResponse('Product tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Check ownership
    if (product.store.userId !== userId) {
      return errorResponse('Anda tidak memiliki akses ke product ini', ErrorCode.NOT_OWNER)
    }

    // Validate category if changed
    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId)
      if (!category) {
        return errorResponse('Category tidak ditemukan', ErrorCode.NOT_FOUND)
      }
    }

    // Check slug unique if changed
    if (data.slug && (await productRepository.slugExists(data.slug, productId))) {
      return errorResponse('Slug sudah digunakan', ErrorCode.ALREADY_EXISTS)
    }

    // Validate price
    if (data.price !== undefined && data.price < 0) {
      return errorResponse('Harga tidak boleh negatif', ErrorCode.VALIDATION_ERROR)
    }

    // Validate stock
    if (data.stock !== undefined && data.stock < 0) {
      return errorResponse('Stock tidak boleh negatif', ErrorCode.VALIDATION_ERROR)
    }

    const updated = await productRepository.update(productId, data)

    return successResponse('Product berhasil diupdate', {
      product: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        price: Number(updated.price),
        stock: updated.stock,
        image: updated.image,
        category: updated.category,
        createdAt: updated.createdAt,
      },
    })
  },

  // Delete product (SELLER - only own products)
  async delete(userId: string, productId: string) {
    const product = await productRepository.findById(productId)

    if (!product) {
      return errorResponse('Product tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Check ownership
    if (product.store.userId !== userId) {
      return errorResponse('Anda tidak memiliki akses ke product ini', ErrorCode.NOT_OWNER)
    }

    await productRepository.delete(productId)

    return successResponse('Product berhasil dihapus')
  },

  // Get products by store slug (public)
  async getByStoreSlug(storeSlug: string, page = 1, limit = 20) {
    const store = await storeRepository.findBySlug(storeSlug)

    if (!store) {
      return errorResponse('Store tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    const result = await productRepository.findByStoreId(store.id, page, limit)

    return successResponse('Products retrieved', {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
      },
      products: result.products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        image: p.image,
        category: p.category,
        reviewCount: p._count.reviews,
        createdAt: p.createdAt,
      })),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    })
  },
}
