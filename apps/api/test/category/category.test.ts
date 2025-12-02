import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { categoryService } from '../../category/category_service'
import { categoryRepository } from '../../category/category_repository'
import { ErrorCode } from '../../lib/response'

mock.module('../../category/category_repository', () => ({
  categoryRepository: {
    findAll: mock(),
    findBySlug: mock(),
    findById: mock(),
    slugExists: mock(),
    nameExists: mock(),
    create: mock(),
    update: mock(),
    delete: mock(),
  },
}))

describe('Category Service', () => {
  const mockCategory = {
    id: 'cat-123',
    name: 'Electronics',
    slug: 'electronics',
    createdAt: new Date(),
    _count: { products: 5 },
  }

  beforeEach(() => {
    ;(categoryRepository.findAll as any).mockReset()
    ;(categoryRepository.findBySlug as any).mockReset()
    ;(categoryRepository.findById as any).mockReset()
    ;(categoryRepository.slugExists as any).mockReset()
    ;(categoryRepository.nameExists as any).mockReset()
    ;(categoryRepository.create as any).mockReset()
    ;(categoryRepository.update as any).mockReset()
    ;(categoryRepository.delete as any).mockReset()
  })

  describe('getAll', () => {
    it('should get all categories successfully', async () => {
      ;(categoryRepository.findAll as any).mockResolvedValue([mockCategory])

      const result = await categoryService.getAll()

      expect(result.success).toBe(true)
      expect(result.data?.categories).toHaveLength(1)
      expect(result.data?.categories[0]!.name).toBe('Electronics')
      expect(categoryRepository.findAll).toHaveBeenCalled()
    })

    it('should return empty array if no categories', async () => {
      ;(categoryRepository.findAll as any).mockResolvedValue([])

      const result = await categoryService.getAll()

      expect(result.success).toBe(true)
      expect(result.data?.categories).toHaveLength(0)
    })
  })

  describe('getBySlug', () => {
    it('should get category by slug successfully', async () => {
      ;(categoryRepository.findBySlug as any).mockResolvedValue(mockCategory)

      const result = await categoryService.getBySlug('electronics')

      expect(result.success).toBe(true)
      expect(result.data?.category?.slug).toBe('electronics')
      expect(categoryRepository.findBySlug).toHaveBeenCalledWith('electronics')
    })

    it('should return error if category not found', async () => {
      ;(categoryRepository.findBySlug as any).mockResolvedValue(null)

      const result = await categoryService.getBySlug('non-existent')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })
  })

  describe('create', () => {
    const createData = {
      name: 'Fashion',
      slug: 'fashion',
    }

    it('should create category successfully', async () => {
      ;(categoryRepository.nameExists as any).mockResolvedValue(false)
      ;(categoryRepository.slugExists as any).mockResolvedValue(false)
      ;(categoryRepository.create as any).mockResolvedValue({
        id: 'cat-456',
        ...createData,
        createdAt: new Date(),
      })

      const result = await categoryService.create(createData.name, createData.slug)

      expect(result.success).toBe(true)
      expect(result.data?.category?.name).toBe('Fashion')
      expect(categoryRepository.create).toHaveBeenCalledWith(createData)
    })

    it('should return error if slug already exists', async () => {
      ;(categoryRepository.slugExists as any).mockResolvedValue(true)

      const result = await categoryService.create(createData.name, createData.slug)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.ALREADY_EXISTS)
      expect(result.message).toContain('Slug sudah digunakan')
    })

    it('should auto-generate slug if not provided', async () => {
      ;(categoryRepository.nameExists as any).mockResolvedValue(false)
      ;(categoryRepository.slugExists as any).mockResolvedValue(false)
      ;(categoryRepository.create as any).mockResolvedValue({
        id: 'cat-456',
        name: 'Fashion',
        slug: expect.any(String),
        createdAt: new Date(),
      })

      const result = await categoryService.create('Fashion')

      expect(result.success).toBe(true)
      expect(categoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Fashion',
          slug: expect.any(String),
        })
      )
    })

    it('should validate name is not empty', async () => {
      ;(categoryRepository.nameExists as any).mockResolvedValue(false)
      ;(categoryRepository.create as any).mockResolvedValue(null)

      const result = await categoryService.create('')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR)
    })
  })

  describe('update', () => {
    it('should update category successfully', async () => {
      ;(categoryRepository.findById as any).mockResolvedValue(mockCategory)
      ;(categoryRepository.nameExists as any).mockResolvedValue(false)
      ;(categoryRepository.update as any).mockResolvedValue({
        ...mockCategory,
        name: 'Electronics & Gadgets',
      })

      const result = await categoryService.update('cat-123', { name: 'Electronics & Gadgets' })

      expect(result.success).toBe(true)
      expect(result.data?.category?.name).toBe('Electronics & Gadgets')
      expect(categoryRepository.update).toHaveBeenCalledWith('cat-123', {
        name: 'Electronics & Gadgets',
      })
    })

    it('should return error if category not found', async () => {
      ;(categoryRepository.findById as any).mockResolvedValue(null)

      const result = await categoryService.update('cat-123', { name: 'New Name' })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })

    it('should validate slug uniqueness if changed', async () => {
      ;(categoryRepository.findById as any).mockResolvedValue(mockCategory)
      ;(categoryRepository.slugExists as any).mockResolvedValue(true)

      const result = await categoryService.update('cat-123', { slug: 'existing-slug' })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.ALREADY_EXISTS)
    })

    it('should allow updating with same slug', async () => {
      ;(categoryRepository.findById as any).mockResolvedValue(mockCategory)
      ;(categoryRepository.slugExists as any).mockResolvedValue(false)
      ;(categoryRepository.update as any).mockResolvedValue(mockCategory)

      const result = await categoryService.update('cat-123', { slug: 'electronics' })

      expect(result.success).toBe(true)
    })
  })

  describe('delete', () => {
    it('should delete category successfully', async () => {
      ;(categoryRepository.findById as any).mockResolvedValue({
        ...mockCategory,
        _count: { products: 0 },
      })
      ;(categoryRepository.delete as any).mockResolvedValue({})

      const result = await categoryService.delete('cat-123')

      expect(result.success).toBe(true)
      expect(categoryRepository.delete).toHaveBeenCalledWith('cat-123')
    })

    it('should return error if category not found', async () => {
      ;(categoryRepository.findById as any).mockResolvedValue(null)

      const result = await categoryService.delete('cat-123')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })
  })
})
