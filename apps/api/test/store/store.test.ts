import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { storeService } from '../../store/store_service'
import { storeRepository } from '../../store/store_repository'
import { userRepository } from '../../auth/shared/user_repository'
import { ErrorCode } from '../../lib/response'

mock.module('../../store/store_repository', () => ({
  storeRepository: {
    findByUserId: mock(),
    findBySlug: mock(),
    slugExists: mock(),
    create: mock(),
    update: mock(),
  },
}))

mock.module('../../auth/shared/user_repository', () => ({
  userRepository: {
    findById: mock(),
    update: mock(),
  },
}))

mock.module('../../lib/db', () => ({
  prisma: {
    $transaction: mock(async (callback: any) => {
      const mockTx = {
        store: {
          create: mock(async (data: any) => ({
            id: 'store-456',
            ...data.data,
            createdAt: new Date(),
          })),
        },
        user: {
          update: mock(async () => ({})),
        },
        product: {
          deleteMany: mock(async () => ({})),
        },
      }
      return callback(mockTx)
    }),
  },
}))

describe('Store Service', () => {
  const mockStore = {
    id: 'store-123',
    name: 'Test Store',
    slug: 'test-store',
    description: 'A test store',
    userId: 'user-123',
    createdAt: new Date(),
    _count: { products: 5 },
  }

  const mockUser = {
    id: 'user-123',
    email: 'seller@example.com',
    name: 'Seller User',
    role: 'CUSTOMER',
  }

  beforeEach(() => {
    ;(storeRepository.findByUserId as any).mockReset()
    ;(storeRepository.findBySlug as any).mockReset()
    ;(storeRepository.slugExists as any).mockReset()
    ;(storeRepository.create as any).mockReset()
    ;(storeRepository.update as any).mockReset()
    ;(userRepository.findById as any).mockReset()
  })

  describe('getMyStore', () => {
    it('should get user store successfully', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)

      const result = await storeService.getMyStore('user-123')

      expect(result.success).toBe(true)
      expect(result.data?.store?.name).toBe('Test Store')
      expect(storeRepository.findByUserId).toHaveBeenCalledWith('user-123')
    })

    it('should return error if user has no store', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)

      const result = await storeService.getMyStore('user-123')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })
  })

  describe('getBySlug', () => {
    it('should get store by slug successfully', async () => {
      ;(storeRepository.findBySlug as any).mockResolvedValue({
        ...mockStore,
        user: mockUser,
      })

      const result = await storeService.getBySlug('test-store')

      expect(result.success).toBe(true)
      expect(result.data?.store?.slug).toBe('test-store')
      expect(storeRepository.findBySlug).toHaveBeenCalledWith('test-store')
    })

    it('should return error if store not found', async () => {
      ;(storeRepository.findBySlug as any).mockResolvedValue(null)

      const result = await storeService.getBySlug('non-existent')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })
  })

  describe('create', () => {
    const createData = {
      name: 'New Store',
      slug: 'new-store',
      description: 'A new store',
    }

    it('should create store successfully', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)
      ;(userRepository.findById as any).mockResolvedValue(mockUser)
      ;(storeRepository.slugExists as any).mockResolvedValue(false)

      const result = await storeService.create('user-123', createData)

      expect(result.success).toBe(true)
      expect(result.data?.store?.name).toBe('New Store')
    })

    it('should return error if user already has store', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)

      const result = await storeService.create('user-123', createData)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.ALREADY_EXISTS)
    })

    it('should return error if slug already exists', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)
      ;(userRepository.findById as any).mockResolvedValue(mockUser)
      ;(storeRepository.slugExists as any).mockResolvedValue(true)

      const result = await storeService.create('user-123', createData)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.ALREADY_EXISTS)
    })

    it('should auto-generate slug if not provided', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)
      ;(userRepository.findById as any).mockResolvedValue(mockUser)
      ;(storeRepository.slugExists as any).mockResolvedValue(false)

      const result = await storeService.create('user-123', {
        name: 'New Store',
      })

      expect(result.success).toBe(true)
    })

    it('should validate name is not empty', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)

      const result = await storeService.create('user-123', { name: '' })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR)
    })
  })

  describe('update', () => {
    const updateData = {
      name: 'Updated Store',
      description: 'Updated description',
    }

    it('should update store successfully', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(storeRepository.update as any).mockResolvedValue({
        ...mockStore,
        ...updateData,
      })

      const result = await storeService.update('user-123', updateData)

      expect(result.success).toBe(true)
      expect(result.data?.store?.name).toBe('Updated Store')
      expect(storeRepository.update).toHaveBeenCalledWith('store-123', updateData)
    })

    it('should return error if user has no store', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(null)

      const result = await storeService.update('user-123', updateData)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.NOT_FOUND)
    })

    it('should validate slug uniqueness if changed', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(storeRepository.slugExists as any).mockResolvedValue(true)

      const result = await storeService.update('user-123', { slug: 'existing-slug' })

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.ALREADY_EXISTS)
    })

    it('should allow updating with same slug', async () => {
      ;(storeRepository.findByUserId as any).mockResolvedValue(mockStore)
      ;(storeRepository.slugExists as any).mockResolvedValue(false)
      ;(storeRepository.update as any).mockResolvedValue(mockStore)

      const result = await storeService.update('user-123', { slug: 'test-store' })

      expect(result.success).toBe(true)
    })
  })
})
