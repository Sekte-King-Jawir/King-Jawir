import { storeRepository } from '../../store/store_repository'
import { productRepository } from '../../product/product_repository'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const sellerProductService = {
  // Get all products untuk seller (dari tokonya sendiri)
  async getProducts(userId: string, page = 1, limit = 20) {
    // Cari store milik seller
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Ambil products dari store
    const result = await productRepository.findByStoreId(store.id, page, limit)

    return successResponse('Berhasil mengambil produk', result)
  },

  // Get single product by ID (hanya milik seller tersebut)
  async getProductById(userId: string, productId: string) {
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    const product = await productRepository.findById(productId)
    if (!product) {
      return errorResponse('Produk tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Validasi product milik seller ini
    if (product.storeId !== store.id) {
      return errorResponse('Anda tidak memiliki akses ke produk ini', ErrorCode.FORBIDDEN)
    }

    return successResponse('Berhasil mengambil produk', product)
  },

  // Create product
  async createProduct(
    userId: string,
    data: {
      categoryId: string
      name: string
      description?: string
      price: number
      stock: number
      image?: string
    }
  ) {
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan. Buat toko terlebih dahulu.', ErrorCode.NOT_FOUND)
    }

    // Generate slug dari name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Cek slug sudah ada
    const slugExists = await productRepository.slugExists(slug)
    if (slugExists) {
      // Tambahkan random suffix jika slug sudah ada
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      const newSlug = `${slug}-${randomSuffix}`
      
      const productData = {
        storeId: store.id,
        categoryId: data.categoryId,
        name: data.name,
        slug: newSlug,
        ...(data.description && { description: data.description }),
        price: data.price,
        stock: data.stock,
        ...(data.image && { image: data.image }),
      }

      const product = await productRepository.create(productData)
      return successResponse('Produk berhasil dibuat', product)
    }

    const productData = {
      storeId: store.id,
      categoryId: data.categoryId,
      name: data.name,
      slug,
      ...(data.description && { description: data.description }),
      price: data.price,
      stock: data.stock,
      ...(data.image && { image: data.image }),
    }

    const product = await productRepository.create(productData)
    return successResponse('Produk berhasil dibuat', product)
  },

  // Update product
  async updateProduct(
    userId: string,
    productId: string,
    data: {
      categoryId?: string
      name?: string
      description?: string
      price?: number
      stock?: number
      image?: string
    }
  ) {
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    const product = await productRepository.findById(productId)
    if (!product) {
      return errorResponse('Produk tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Validasi product milik seller ini
    if (product.storeId !== store.id) {
      return errorResponse('Anda tidak memiliki akses ke produk ini', ErrorCode.FORBIDDEN)
    }

    // Jika name berubah, generate slug baru
    let updateData: any = { ...data }
    if (data.name && data.name !== product.name) {
      const newSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Cek slug exists (exclude product ini)
      const slugExists = await productRepository.slugExists(newSlug, productId)
      if (slugExists) {
        const randomSuffix = Math.random().toString(36).substring(2, 8)
        updateData.slug = `${newSlug}-${randomSuffix}`
      } else {
        updateData.slug = newSlug
      }
    }

    const updatedProduct = await productRepository.update(productId, updateData)
    return successResponse('Produk berhasil diupdate', updatedProduct)
  },

  // Delete product
  async deleteProduct(userId: string, productId: string) {
    const store = await storeRepository.findByUserId(userId)
    if (!store) {
      return errorResponse('Toko tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    const product = await productRepository.findById(productId)
    if (!product) {
      return errorResponse('Produk tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Validasi product milik seller ini
    if (product.storeId !== store.id) {
      return errorResponse('Anda tidak memiliki akses ke produk ini', ErrorCode.FORBIDDEN)
    }

    await productRepository.delete(productId)
    return successResponse('Produk berhasil dihapus', null)
  },
}
