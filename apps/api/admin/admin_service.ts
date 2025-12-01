import { adminRepository } from './admin_repository'

type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN'

export const adminService = {
  // Get all users with filters
  async getUsers(page = 1, limit = 10, search?: string, role?: string) {
    // Validate role if provided
    let validRole: Role | undefined
    if (role) {
      if (!['CUSTOMER', 'SELLER', 'ADMIN'].includes(role.toUpperCase())) {
        return { success: false, error: 'Role tidak valid. Gunakan CUSTOMER, SELLER, atau ADMIN' }
      }
      validRole = role.toUpperCase() as Role
    }

    const result = await adminRepository.getUsers(page, limit, search, validRole)
    return { success: true, data: result }
  },

  // Get user detail
  async getUserById(userId: string) {
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      return { success: false, error: 'User tidak ditemukan' }
    }
    return { success: true, data: user }
  },

  // Update user role
  async updateUserRole(adminId: string, userId: string, newRole: string) {
    // Validate role
    if (!['CUSTOMER', 'SELLER', 'ADMIN'].includes(newRole.toUpperCase())) {
      return { success: false, error: 'Role tidak valid. Gunakan CUSTOMER, SELLER, atau ADMIN' }
    }

    // Check if user exists
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      return { success: false, error: 'User tidak ditemukan' }
    }

    // Prevent admin from changing their own role
    if (adminId === userId) {
      return { success: false, error: 'Tidak dapat mengubah role sendiri' }
    }

    // Update role
    const updated = await adminRepository.updateUserRole(userId, newRole.toUpperCase() as Role)
    return { 
      success: true, 
      data: updated,
      message: `Role berhasil diubah ke ${newRole.toUpperCase()}`
    }
  },

  // Delete user
  async deleteUser(adminId: string, userId: string) {
    // Check if user exists
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      return { success: false, error: 'User tidak ditemukan' }
    }

    // Prevent admin from deleting themselves
    if (adminId === userId) {
      return { success: false, error: 'Tidak dapat menghapus akun sendiri' }
    }

    // Prevent deleting other admins
    if (user.role === 'ADMIN') {
      return { success: false, error: 'Tidak dapat menghapus admin lain' }
    }

    await adminRepository.deleteUser(userId)
    return { success: true, message: 'User berhasil dihapus' }
  },

  // Get dashboard stats
  async getStats() {
    const stats = await adminRepository.getStats()
    return { success: true, data: stats }
  }
}
