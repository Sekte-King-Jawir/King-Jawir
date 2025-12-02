import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { productService } from '../../product/product_service'
import { productRepository } from '../../product/product_repository'
import { storeRepository } from '../../store/store_repository'
import { categoryRepository } from '../../category/category_repository'
import { ErrorCode } from '../../lib/response'

mock.module('../../product/product_repository', () => ({
  productRepository: {
    findAll: mock(),
    findBySlug: mock(),
    findById: mock(),
    findByStoreId: mock(),
    slugExists: mock(),
    create: mock(),
    update: mock(),
    delete: mock(),
  },
}))

mock.module('../../store/store_repository', () => ({
  storeRepository: {
    findByUserId: mock(),
    findBySlug: mock(),
  },
}))

mock.module('../../category/category_repository', () => ({
  categoryRepository: {
    findById: mock(),
  },
}))

describe('Product Service', () => {
  const mockProduct = {
    id: 'product-123',
    name: 'Test Product',
    slug: 'test-product',
    price: 100000,
    stock: 10,
    image: 'https://example.com/image.jpg',
    category: {
      id: 'cat-123',
      name: 'Electronics',
      slug: 'electronics',
    },
    store: {
      id: 'store-123',
      name: 'Test Store',
      slug: 'test-store',
      userId: 'user-123',
    },
    _count: {
      reviews: 5,
    },
    createdAt: new Date(),
  }

  const mockStore = {
    id: 'store-123',
    name: 'Test Store',
    slug: 'test-store',
    userId: 'user-123',
  }

  const mockCategory = {
    id: 'cat-123',
    name: 'Electronics',
    slug: 'electronics',
  }

  beforeEach(() => {
    ;(productRepository.findAll as any).mockReset()
    ;(productRepository.findBySlug as any).mockReset()
    ;(productRepository.findById as any).mockReset()
    ;(productRepository.findByStoreId as any).mockReset()
    ;(productRepository.slugExists as any).mockReset()
    ;(productRepository.create as any).mockReset()
    ;(productRepository.update as any).mockReset()
    ;(productRepository.delete as any).mockReset()
    ;(storeRepository.findByUserId as any).mockReset()
    ;(storeRepository.findBySlug as any).mockReset()
    ;(categoryRepository.findById as any).mockReset()
  })

  describe('getAll', () => {
    it('should get all products with pagination', async () => {
      ;(productRepository.findAll as any).mockResolvedValue({
        products: [mockProduct],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      })

      const result = await productService.getAll()

      expect(result.success).toBe(true)
      expect(result.data?.products).toHaveLength(1)
      expect(result.data?.pagination.page).toBe(1)
      expect(productRepository.findAll).toHaveBeenCalledWith(undefined, 1, 20)
    })

    it('should apply filters to product search', async () => {
      const filter = { search: 'laptop', categoryId: 'cat-123' }
      ;(productRepository.findAll as any).mockResolvedValue({
        products: [],
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      })

      await productService.getAll(filter, 1, 20)

      expect(productRepository.findAll).toHaveBeenCalledWith(filter, 1, 20)
    })

    it('should convert price to number', async () => {
      ;(productRepository.findAll as any).mockResolvedValue({
        products: [mockProduct],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      })

      const result = await productService.getAll()

      expect(typeof result.data?.products[0]!.price).toBe('number')
    })
  })

  describe('getBySlug', () => {
    it('should get product by slug successfully', async () => {
      ;(productRepository.findBySlug as any).mockResolvedValue(mockProduct)

      const result = await productService.getBySlug('test-product')

      expect(result.success).toBe(true)
      expect(result.data?.product.slug).toBe('test-product')
      expect(productRepository.findBySlug).toHaveBeenCalledWith('test-product')
    })

    it('should return error if product not found', async () => {
      ;(productRepository.findBySlug as any).mockResolvedValue(null)

      const result = await productService.getBySlug('non-existent')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })
  })

  describe('getMyProducts', () => {
    it('should get seller products successfully', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(productRepository.findByStoreId as any).mockResolvedValue({
        products: [mockProduct],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      })

      const result = await productService.getMyProducts('user-123')

      expect(result.success).toBe(true)
      expect(result.data?.products).toHaveLength(1)
    })

    it('should return error if seller has no store', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)

      const result = await productService.getMyProducts('user-123')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
      expect(result.message).toContain('toko')
    })
  })

  describe('create', () => {
    const createData = {
      categoryId: 'cat-123',
      name: 'New Product',
      price: 50000,
      stock: 5,
    }

    it('should create product successfully', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(categoryRepository.findById as any).mockResolvedValue(mockCategory)
      ;(productRepository.slugExists as any).mockResolvedValue(false)
      ;(productRepository.create as any).mockResolvedValue({
        ...mockProduct,
        ...createData,
      })

      const result = await productService.create('user-123', createData)

      expect(result.success).toBe(true)
      expect(result.data?.product.name).toBe('New Product')
      expect(productRepository.create).toHaveBeenCalled()
    })

    it('should return error if seller has no store', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)

      const result = await productService.create('user-123', createData)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })

    it('should return error if category not found', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(categoryRepository.findById as any).mockResolvedValue(null)

      const result = await productService.create('user-123', createData)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
      expect(result.message).toContain('Category')
    })

    it('should return error if slug already exists', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(categoryRepository.findById as any).mockResolvedValue(mockCategory)
      ;(productRepository.slugExists as any).mockResolvedValue(true)

      const result = await productService.create('user-123', {
        ...createData,
        slug: 'existing-slug',
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.ALREADY_EXISTS)
    })

    it('should validate price is not negative', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(categoryRepository.findById as any).mockResolvedValue(mockCategory)
      ;(productRepository.slugExists as any).mockResolvedValue(false)

      const result = await productService.create('user-123', {
        ...createData,
        price: -100,
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR)
      expect(result.message).toContain('Harga')
    })

    it('should validate stock is not negative', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(categoryRepository.findById as any).mockResolvedValue(mockCategory)
      ;(productRepository.slugExists as any).mockResolvedValue(false)

      const result = await productService.create('user-123', {
        ...createData,
        stock: -5,
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR)
      expect(result.message).toContain('Stock')
    })
  })

  describe('update', () => {
    it('should update product successfully', async () => {
      ;(productRepository.findById as any).mockResolvedValue(mockProduct)
      ;(productRepository.update as any).mockResolvedValue({
        ...mockProduct,
        price: 120000,
      })

      const result = await productService.update('user-123', 'product-123', { price: 120000 })

      expect(result.success).toBe(true)
      expect(result.data?.product.price).toBe(120000)
    })

    it('should return error if product not found', async () => {
      ;(productRepository.findById as any).mockResolvedValue(null)

      const result = await productService.update('user-123', 'product-123', { price: 120000 })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })

    it('should return error if user is not owner', async () => {
      ;(productRepository.findById as any).mockResolvedValue(mockProduct)

      const result = await productService.update('other-user', 'product-123', { price: 120000 })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_OWNER)
    })

    it('should validate category if changed', async () => {
      ;(productRepository.findById as any).mockResolvedValue(mockProduct)
      ;(categoryRepository.findById as any).mockResolvedValue(null)

      const result = await productService.update('user-123', 'product-123', {
        categoryId: 'invalid-cat',
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })

    it('should validate slug uniqueness if changed', async () => {
      ;(productRepository.findById as any).mockResolvedValue(mockProduct)
      ;(productRepository.slugExists as any).mockResolvedValue(true)

      const result = await productService.update('user-123', 'product-123', {
        slug: 'existing-slug',
      })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.ALREADY_EXISTS)
    })
  })

  describe('delete', () => {
    it('should delete product successfully', async () => {
      ;(productRepository.findById as any).mockResolvedValue(mockProduct)
      ;(productRepository.delete as any).mockResolvedValue({})

      const result = await productService.delete('user-123', 'product-123')

      expect(result.success).toBe(true)
      expect(productRepository.delete).toHaveBeenCalledWith('product-123')
    })

    it('should return error if product not found', async () => {
      ;(productRepository.findById as any).mockResolvedValue(null)

      const result = await productService.delete('user-123', 'product-123')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })

    it('should return error if user is not owner', async () => {
      ;(productRepository.findById as any).mockResolvedValue(mockProduct)

      const result = await productService.delete('other-user', 'product-123')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_OWNER)
    })
  })

  describe('getByStoreSlug', () => {
    it('should get products by store slug successfully', async () => {
      ;(storeRepository.findBySlug as any).mockResolvedValue(mockStore)
      ;(productRepository.findByStoreId as any).mockResolvedValue({
        products: [mockProduct],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      })

      const result = await productService.getByStoreSlug('test-store')

      expect(result.success).toBe(true)
      expect(result.data?.store.slug).toBe('test-store')
      expect(result.data?.products).toHaveLength(1)
    })

    it('should return error if store not found', async () => {
      ;(storeRepository.findBySlug as any).mockResolvedValue(null)

      const result = await productService.getByStoreSlug('non-existent')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })
  })
})
