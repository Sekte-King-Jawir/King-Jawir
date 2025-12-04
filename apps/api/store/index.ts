import { Elysia, t } from 'elysia'
import { storeController } from './store_controller'
import { jwtPlugin, authDerive, isSeller } from '../lib/auth-helper'
import { errorResponse, ErrorCode } from '../lib/response'
import { v } from '../lib/validators'

export const storeRoutes = new Elysia({ prefix: '/store' })
  .use(jwtPlugin)
  .derive(authDerive)

  // POST /store - Create store (upgrade to SELLER)
  .post(
    '/',
    async ({ user, body, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }

      const result = await storeController.create(user.id, {
        name: body.name,
        ...(body.slug && { slug: body.slug }),
        ...(body.description && { description: body.description }),
        ...(body.logo && { logo: body.logo }),
      })

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        name: v.name(),
        slug: t.Optional(v.slug()),
        description: t.Optional(t.String({ maxLength: 2000 })),
        logo: t.Optional(v.url()),
      }),
      detail: {
        tags: ['Store'],
        summary: 'Create store',
        description: 'Create a new store. This will upgrade your role to SELLER.',
      },
    }
  )

  // GET /store - Get my store
  .get(
    '/',
    async ({ user, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await storeController.getMyStore(user.id)

      if (!result.success) {
        set.status = 404
      }

      return result
    },
    {
      detail: {
        tags: ['Store'],
        summary: 'Get my store',
        description: 'Get current user store information.',
      },
    }
  )

  // PUT /store - Update my store
  .put(
    '/',
    async ({ user, body, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await storeController.update(user.id, body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        name: t.Optional(v.name()),
        slug: t.Optional(v.slug()),
        description: t.Optional(t.String({ maxLength: 2000 })),
        logo: t.Optional(v.url()),
      }),
      detail: {
        tags: ['Store'],
        summary: 'Update my store',
        description: 'Update store name, slug, description, or logo.',
      },
    }
  )

  // DELETE /store - Delete my store
  .delete(
    '/',
    async ({ user, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await storeController.delete(user.id)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      detail: {
        tags: ['Store'],
        summary: 'Delete my store',
        description:
          'Delete your store. This will delete all products and downgrade your role to CUSTOMER. Cannot delete if there are active orders.',
      },
    }
  )

// Public routes untuk melihat store
export const publicStoreRoutes = new Elysia({ prefix: '/stores' })

  // GET /stores - List all stores (public)
  .get(
    '/',
    async () => {
      const result = await storeController.getAll()
      return result
    },
    {
      detail: {
        tags: ['Store'],
        summary: 'List all stores',
        description: 'Get list of all public stores.',
      },
    }
  )

  // GET /stores/:slug - Get store by slug (public)
  .get(
    '/:slug',
    async ({ params, set }) => {
      const result = await storeController.getBySlug(params.slug)

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
        tags: ['Store'],
        summary: 'Get store by slug',
        description: 'Get public store information by slug.',
      },
    }
  )
