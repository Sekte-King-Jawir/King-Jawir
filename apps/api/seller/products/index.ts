import { Elysia, t } from 'elysia'
import { sellerProductController } from './product_controller'
import { isSeller } from '../../lib/auth-helper'
import { errorResponse, ErrorCode } from '../../lib/response'

// Note: jwtPlugin & authDerive sudah di-apply di parent (seller/index.ts)
export const sellerProductRoutes = new Elysia({ prefix: '/api/seller/products' })

  // GET /seller/products - List all products dari toko seller
  .get(
    '/',
    async ({ user, query, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '20')

      const result = await sellerProductController.getProducts(user.id, page, limit)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Seller Products'],
        summary: 'Get all products dari toko seller',
        description: 'Mendapatkan semua produk yang dimiliki seller (dari tokonya).',
      },
    }
  )

  // GET /seller/products/:id - Get single product
  .get(
    '/:id',
    async ({ user, params, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await sellerProductController.getProductById(user.id, params.id)

      if (!result.success) {
        set.status = result.error?.code === ErrorCode.NOT_FOUND ? 404 : 400
      }

      return result
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Seller Products'],
        summary: 'Get product by ID',
        description: 'Mendapatkan detail produk milik seller.',
      },
    }
  )

  // POST /seller/products - Create new product
  .post(
    '/',
    async ({ user, body, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await sellerProductController.createProduct(user.id, body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        categoryId: t.String({ minLength: 1 }),
        name: t.String({ minLength: 3, maxLength: 200 }),
        description: t.Optional(t.String({ maxLength: 2000 })),
        price: t.Number({ minimum: 0 }),
        stock: t.Integer({ minimum: 0 }),
        image: t.Optional(t.File()), // Changed to File for local upload
      }),
      detail: {
        tags: ['Seller Products'],
        summary: 'Create new product',
        description: 'Membuat produk baru untuk toko seller.',
      },
    }
  )

  // PUT /seller/products/:id - Update product
  .put(
    '/:id',
    async ({ user, params, body, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await sellerProductController.updateProduct(user.id, params.id, body)

      if (!result.success) {
        set.status = result.error?.code === ErrorCode.NOT_FOUND ? 404 : 400
      }

      return result
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        categoryId: t.Optional(t.String()),
        name: t.Optional(t.String({ minLength: 3, maxLength: 200 })),
        description: t.Optional(t.String({ maxLength: 2000 })),
        price: t.Optional(t.Number({ minimum: 0 })),
        stock: t.Optional(t.Integer({ minimum: 0 })),
        image: t.Optional(t.File()), // Changed to File for local upload
      }),
      detail: {
        tags: ['Seller Products'],
        summary: 'Update product',
        description: 'Update data produk milik seller.',
      },
    }
  )

  // DELETE /seller/products/:id - Delete product
  .delete(
    '/:id',
    async ({ user, params, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await sellerProductController.deleteProduct(user.id, params.id)

      if (!result.success) {
        set.status = result.error?.code === ErrorCode.NOT_FOUND ? 404 : 400
      }

      return result
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Seller Products'],
        summary: 'Delete product',
        description: 'Hapus produk milik seller.',
      },
    }
  )
