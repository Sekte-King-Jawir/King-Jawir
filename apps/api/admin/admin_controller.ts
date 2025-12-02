import { adminService } from './admin_service'
import type { Context } from 'elysia'

export const adminController = {
  // GET /admin/users
  async getUsers(query: any, set: Context['set']) {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const search = query.search
    const role = query.role

    const result = await adminService.getUsers(page, limit, search, role)

    if (!result.success) {
      set.status = 400
      return {
        success: false,
        message: result.error,
        error: { code: 'BAD_REQUEST', details: null },
      }
    }

    return {
      success: true,
      message: 'Daftar user berhasil diambil',
      data: result.data,
    }
  },

  // GET /admin/users/:id
  async getUserById(userId: string, set: Context['set']) {
    const result = await adminService.getUserById(userId)

    if (!result.success) {
      set.status = 404
      return {
        success: false,
        message: result.error,
        error: { code: 'NOT_FOUND', details: null },
      }
    }

    //return
    return {
      success: true,
      message: 'Detail user berhasil diambil',
      data: result.data,
    }
  },

  // PUT /admin/users/:id/role
  async updateUserRole(
    adminId: string,
    userId: string,
    body: { role: string },
    set: Context['set']
  ) {
    const result = await adminService.updateUserRole(adminId, userId, body.role)

    if (!result.success) {
      set.status = 400
      return {
        success: false,
        message: result.error,
        error: { code: 'BAD_REQUEST', details: null },
      }
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
    }
  },

  // DELETE /admin/users/:id
  async deleteUser(adminId: string, userId: string, set: Context['set']) {
    const result = await adminService.deleteUser(adminId, userId)

    if (!result.success) {
      set.status = 400
      return {
        success: false,
        message: result.error,
        error: { code: 'BAD_REQUEST', details: null },
      }
    }

    return {
      success: true,
      message: result.message,
    }
  },

  // GET /admin/stats
  async getStats(_set: Context['set']) {
    const result = await adminService.getStats()

    return {
      success: true,
      message: 'Statistik berhasil diambil',
      data: result.data,
    }
  },
}
