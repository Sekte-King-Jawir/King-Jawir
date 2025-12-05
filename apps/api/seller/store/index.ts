import { Elysia, t } from 'elysia'
import { sellerStoreController } from './store_controller'
import { isSeller } from '../../lib/auth-helper'
import { errorResponse, ErrorCode } from '../../lib/response'
import { uploadToMinIO } from '../../lib/minio'

// Note: jwtPlugin & authDerive sudah di-apply di parent (seller/index.ts)
export const sellerStoreRoutes = new Elysia({ prefix: '/store' })
  // POST /seller/store - Create store (if not exists)
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

      // Check if store already exists
      const existingStore = await sellerStoreController.getStore(user.id)
      if (existingStore.success) {
        set.status = 400
        return errorResponse('Toko sudah ada', ErrorCode.BAD_REQUEST)
      }

      const result = await sellerStoreController.createStore(user.id, body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 100 }),
        description: t.Optional(t.String({ maxLength: 500 })),
        logo: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Seller Store'],
        summary: 'Create store',
        description: 'Membuat toko baru untuk seller.',
      },
    }
  )

  // GET /seller/store - Get store profile
  .get(
    '/',
    async ({ user, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
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
    async ({ user, body, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
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

  // POST /seller/store/logo/upload - Upload store logo
  .post(
    '/logo/upload',
    async ({ user, body, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      if (!body.logo) {
        set.status = 400
        return errorResponse('Logo file is required', ErrorCode.BAD_REQUEST)
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(body.logo.type)) {
        set.status = 400
        return errorResponse(
          'Invalid file type. Only JPEG, PNG, and WebP are allowed',
          ErrorCode.BAD_REQUEST
        )
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (body.logo.size > maxSize) {
        set.status = 400
        return errorResponse('File size exceeds 5MB limit', ErrorCode.BAD_REQUEST)
      }

      try {
        // Upload to MinIO
        const logoUrl = await uploadToMinIO(body.logo, `stores/${user.id}`)

        // Update store with new logo URL
        const result = await sellerStoreController.updateStore(user.id, { logo: logoUrl })

        return result
      } catch (error) {
        set.status = 500
        return errorResponse('Failed to upload logo', ErrorCode.INTERNAL_ERROR)
      }
    },
    {
      body: t.Object({
        logo: t.File({
          type: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          maxSize: 5 * 1024 * 1024, // 5MB
        }),
      }),
      detail: {
        tags: ['Seller Store'],
        summary: 'Upload store logo',
        description: 'Upload store logo image file directly to MinIO storage',
      },
    }
  )
