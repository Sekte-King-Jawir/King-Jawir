import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { adminService } from '../../admin/admin_service'
import { adminRepository } from '../../admin/admin_repository'

mock.module('../../admin/admin_repository', () => ({
  adminRepository: {
    getUsers: mock(),
    getUserById: mock(),
    updateUserRole: mock(),
    deleteUser: mock(),
    getStats: mock(),
  },
}))

describe('Admin Service', () => {
  const mockUser = {
    id: 'user-123',
    email: 'user@example.com',
    name: 'Test User',
    role: 'CUSTOMER',
    emailVerified: true,
    createdAt: new Date(),
  }

  const mockAdmin = {
    id: 'admin-123',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    emailVerified: true,
    createdAt: new Date(),
  }

  const mockStats = {
    overview: {
      totalUsers: 100,
      totalProducts: 50,
      totalOrders: 200,
      totalRevenue: 10000000,
    },
    ordersByStatus: {
      PENDING: 10,
      PAID: 20,
      SHIPPED: 15,
      DONE: 150,
      CANCELLED: 5,
    },
  }

  beforeEach(() => {
    ;(adminRepository.getUsers as any).mockReset()
    ;(adminRepository.getUserById as any).mockReset()
    ;(adminRepository.updateUserRole as any).mockReset()
    ;(adminRepository.deleteUser as any).mockReset()
    ;(adminRepository.getStats as any).mockReset()
  })

  describe('getUsers', () => {
    it('should get all users with pagination', async () => {
      ;(adminRepository.getUsers as any).mockResolvedValue({
        users: [mockUser],
        page: 1,
        limit: 10,
        total: 1,
      })

      const result = await adminService.getUsers(1, 10)

      expect(result.success).toBe(true)
      expect(result.data?.users).toHaveLength(1)
      expect(adminRepository.getUsers).toHaveBeenCalledWith(1, 10, undefined, undefined)
    })

    it('should filter users by role', async () => {
      ;(adminRepository.getUsers as any).mockResolvedValue({
        users: [mockAdmin],
        page: 1,
        limit: 10,
        total: 1,
      })

      const result = await adminService.getUsers(1, 10, undefined, 'ADMIN')

      expect(result.success).toBe(true)
      expect(adminRepository.getUsers).toHaveBeenCalledWith(1, 10, undefined, 'ADMIN')
    })

    it('should search users by query', async () => {
      ;(adminRepository.getUsers as any).mockResolvedValue({
        users: [mockUser],
        page: 1,
        limit: 10,
        total: 1,
      })

      const result = await adminService.getUsers(1, 10, 'test')

      expect(result.success).toBe(true)
      expect(adminRepository.getUsers).toHaveBeenCalledWith(1, 10, 'test', undefined)
    })

    it('should validate role filter', async () => {
      const result = await adminService.getUsers(1, 10, undefined, 'INVALID_ROLE')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Role tidak valid')
    })

    it('should accept case insensitive role', async () => {
      ;(adminRepository.getUsers as any).mockResolvedValue({
        users: [],
        page: 1,
        limit: 10,
        total: 0,
      })

      const result = await adminService.getUsers(1, 10, undefined, 'customer')

      expect(result.success).toBe(true)
      expect(adminRepository.getUsers).toHaveBeenCalledWith(1, 10, undefined, 'CUSTOMER')
    })
  })

  describe('getUserById', () => {
    it('should get user by id successfully', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(mockUser)

      const result = await adminService.getUserById('user-123')

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe('user-123')
      expect(adminRepository.getUserById).toHaveBeenCalledWith('user-123')
    })

    it('should return error if user not found', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(null)

      const result = await adminService.getUserById('user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })
  })

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(mockUser)
      ;(adminRepository.updateUserRole as any).mockResolvedValue({
        ...mockUser,
        role: 'SELLER',
      })

      const result = await adminService.updateUserRole('admin-123', 'user-123', 'SELLER')

      expect(result.success).toBe(true)
      expect(result.message).toContain('SELLER')
      expect(adminRepository.updateUserRole).toHaveBeenCalledWith('user-123', 'SELLER')
    })

    it('should validate new role', async () => {
      const result = await adminService.updateUserRole('admin-123', 'user-123', 'INVALID')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Role tidak valid')
    })

    it('should return error if user not found', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(null)

      const result = await adminService.updateUserRole('admin-123', 'user-123', 'SELLER')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })

    it('should prevent admin from changing their own role', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(mockAdmin)

      const result = await adminService.updateUserRole('admin-123', 'admin-123', 'CUSTOMER')

      expect(result.success).toBe(false)
      expect(result.error).toContain('role sendiri')
    })

    it('should accept case insensitive role', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(mockUser)
      ;(adminRepository.updateUserRole as any).mockResolvedValue({
        ...mockUser,
        role: 'SELLER',
      })

      const result = await adminService.updateUserRole('admin-123', 'user-123', 'seller')

      expect(result.success).toBe(true)
      expect(adminRepository.updateUserRole).toHaveBeenCalledWith('user-123', 'SELLER')
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(mockUser)
      ;(adminRepository.deleteUser as any).mockResolvedValue({})

      const result = await adminService.deleteUser('admin-123', 'user-123')

      expect(result.success).toBe(true)
      expect(result.message).toContain('berhasil dihapus')
      expect(adminRepository.deleteUser).toHaveBeenCalledWith('user-123')
    })

    it('should return error if user not found', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(null)

      const result = await adminService.deleteUser('admin-123', 'user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })

    it('should prevent admin from deleting themselves', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(mockAdmin)

      const result = await adminService.deleteUser('admin-123', 'admin-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('akun sendiri')
    })

    it('should prevent deleting other admins', async () => {
      const otherAdmin = { ...mockAdmin, id: 'admin-456' }
      ;(adminRepository.getUserById as any).mockResolvedValue(otherAdmin)

      const result = await adminService.deleteUser('admin-123', 'admin-456')

      expect(result.success).toBe(false)
      expect(result.error).toContain('admin lain')
    })

    it('should allow deleting customers', async () => {
      ;(adminRepository.getUserById as any).mockResolvedValue(mockUser)
      ;(adminRepository.deleteUser as any).mockResolvedValue({})

      const result = await adminService.deleteUser('admin-123', 'user-123')

      expect(result.success).toBe(true)
    })

    it('should allow deleting sellers', async () => {
      const seller = { ...mockUser, role: 'SELLER' }
      ;(adminRepository.getUserById as any).mockResolvedValue(seller)
      ;(adminRepository.deleteUser as any).mockResolvedValue({})

      const result = await adminService.deleteUser('admin-123', 'user-123')

      expect(result.success).toBe(true)
    })
  })

  describe('getStats', () => {
    it('should get dashboard statistics successfully', async () => {
      ;(adminRepository.getStats as any).mockResolvedValue(mockStats)

      const result = await adminService.getStats()

      expect(result.success).toBe(true)
      expect(result.data?.overview.totalUsers).toBe(100)
      expect(result.data?.ordersByStatus['PENDING']).toBe(10)
      expect(adminRepository.getStats).toHaveBeenCalled()
    })

    it('should return all stat categories', async () => {
      ;(adminRepository.getStats as any).mockResolvedValue(mockStats)

      const result = await adminService.getStats()

      expect(result.success).toBe(true)
      expect(result.data?.overview).toBeDefined()
      expect(result.data?.ordersByStatus).toBeDefined()
    })
  })
})
