import { Elysia, t } from 'elysia'
import { adminController } from './admin_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'

// Admin routes - all require ADMIN role
export const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(jwtPlugin)
  .derive(authDerive)
  // GET /admin/users - List all users
  .get(
    '/users',
    async ({ user, query, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      if (user.role !== 'ADMIN') {
        set.status = 403
        return {
          success: false,
          message: 'Forbidden - Admin only',
          error: { code: 'FORBIDDEN', details: null },
        }
      }

      return adminController.getUsers(query, set)
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        search: t.Optional(t.String()),
        role: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Admin'],
        summary: 'List all users',
        description: 'Get paginated list of users with optional filters (Admin only)',
      },
    }
  )
  // GET /admin/users/:id - Get user detail
  .get(
    '/users/:id',
    async ({ user, params, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      if (user.role !== 'ADMIN') {
        set.status = 403
        return {
          success: false,
          message: 'Forbidden - Admin only',
          error: { code: 'FORBIDDEN', details: null },
        }
      }

      return adminController.getUserById(params.id, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Admin'],
        summary: 'Get user detail',
        description: 'Get detailed information about a specific user (Admin only)',
      },
    }
  )
  // PUT /admin/users/:id/role - Update user role
  .put(
    '/users/:id/role',
    async ({ user, params, body, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      if (user.role !== 'ADMIN') {
        set.status = 403
        return {
          success: false,
          message: 'Forbidden - Admin only',
          error: { code: 'FORBIDDEN', details: null },
        }
      }

      return adminController.updateUserRole(user.id, params.id, body, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        role: t.String({ minLength: 1 }),
      }),
      detail: {
        tags: ['Admin'],
        summary: 'Update user role',
        description: 'Change user role to CUSTOMER, SELLER, or ADMIN (Admin only)',
      },
    }
  )
  // DELETE /admin/users/:id - Delete user
  .delete(
    '/users/:id',
    async ({ user, params, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      if (user.role !== 'ADMIN') {
        set.status = 403
        return {
          success: false,
          message: 'Forbidden - Admin only',
          error: { code: 'FORBIDDEN', details: null },
        }
      }

      return adminController.deleteUser(user.id, params.id, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Admin'],
        summary: 'Delete user',
        description: 'Delete a user and all their related data (Admin only)',
      },
    }
  )
  // GET /admin/stats - Dashboard statistics
  .get(
    '/stats',
    async ({ user, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      if (user.role !== 'ADMIN') {
        set.status = 403
        return {
          success: false,
          message: 'Forbidden - Admin only',
          error: { code: 'FORBIDDEN', details: null },
        }
      }

      return adminController.getStats(set)
    },
    {
      detail: {
        tags: ['Admin'],
        summary: 'Get dashboard statistics',
        description: 'Get overview statistics for admin dashboard (Admin only)',
      },
    }
  )
