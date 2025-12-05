import { Elysia, t } from 'elysia'
import { sellerStoreController } from './store_controller'
import { jwtPlugin, authDerive, isSeller } from '../../lib/auth-helper'
import { errorResponse, ErrorCode } from '../../lib/response'

export const sellerStoreRoutes = new Elysia({ prefix: '/api/seller/store' })
  .use(jwtPlugin)
  .derive(authDerive)

  // GET /seller/store - Get store profile
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

      const result = await sellerStoreController.getStore(user.id)

      if (!result.success) {
        set.status = result.error?.code === ErrorCode.NOT_FOUND ? 404 : 400
      }

      return result
    },
    {
      detail: {
        tags: ['Seller Store'],
        summary: 'Get store profile',
        description: 'Mendapatkan data toko milik seller.',
      },
    }
  )

  // PUT /seller/store - Update store profile
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

      const result = await sellerStoreController.updateStore(user.id, body)

      if (!result.success) {
        set.status = result.error?.code === ErrorCode.NOT_FOUND ? 404 : 400
      }

      return result
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
        description: t.Optional(t.String({ maxLength: 500 })),
        logo: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Seller Store'],
        summary: 'Update store profile',
        description: 'Update data toko milik seller (nama, deskripsi, logo).',
      },
    }
  )
