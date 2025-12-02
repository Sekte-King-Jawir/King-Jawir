import { Elysia, t } from 'elysia'
import { categoryController } from './category_controller'
import { jwtPlugin, authDerive, isAdmin, type AuthUser } from '../lib/auth-helper'
import { errorResponse, ErrorCode } from '../lib/response'

// [unused] export const categoryRoutes = new Elysia({ prefix: '/categories' })
  .use(jwtPlugin)
  .derive(authDerive)

  // GET /categories - List all categories (public)
  .get(
    '/',
    async () => {
      return categoryController.getAll()
    },
    {
      detail: {
        tags: ['Categories'],
        summary: 'List all categories',
        description: 'Get all product categories.',
      },
    }
  )

  // GET /categories/:slug - Get category by slug (public)
  .get(
    '/:slug',
    async ({ params, set }) => {
      const result = await categoryController.getBySlug(params.slug)

      if (!result.success) {
        set.status = 404
      }

      return result
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      detail: {
        tags: ['Categories'],
        summary: 'Get category by slug',
        description: 'Get category details by slug.',
      },
    }
  )

  // POST /categories - Create category (ADMIN only)
  .post(
    '/',
    async ({ user, body, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isAdmin(user)) {
        set.status = 403
        return errorResponse('Forbidden - Admin only', ErrorCode.FORBIDDEN)
      }

      const result = await categoryController.create(body.name, body.slug)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 50 }),
        slug: t.Optional(t.String({ minLength: 2, maxLength: 50 })),
      }),
      detail: {
        tags: ['Categories'],
        summary: 'Create category',
        description: 'Create a new category. Admin only.',
      },
    }
  )

  // PUT /categories/:id - Update category (ADMIN only)
  .put(
    '/:id',
    async ({ user, params, body, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isAdmin(user)) {
        set.status = 403
        return errorResponse('Forbidden - Admin only', ErrorCode.FORBIDDEN)
      }

      const result = await categoryController.update(params.id, body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 2, maxLength: 50 })),
        slug: t.Optional(t.String({ minLength: 2, maxLength: 50 })),
      }),
      detail: {
        tags: ['Categories'],
        summary: 'Update category',
        description: 'Update category name or slug. Admin only.',
      },
    }
  )

  // DELETE /categories/:id - Delete category (ADMIN only)
  .delete(
    '/:id',
    async ({ user, params, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isAdmin(user)) {
        set.status = 403
        return errorResponse('Forbidden - Admin only', ErrorCode.FORBIDDEN)
      }

      const result = await categoryController.delete(params.id)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Categories'],
        summary: 'Delete category',
        description: 'Delete a category. Admin only. Cannot delete if category has products.',
      },
    }
  )
