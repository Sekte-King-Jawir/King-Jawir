import type { Elysia } from 'elysia'
import { errorResponse, ErrorCode } from '../../lib/response'
import { isSeller } from '../../lib/auth-helper'

/**
 * Middleware untuk seller-only routes
 * Akan automatically reject jika:
 * - User tidak login (401)
 * - User bukan seller/admin (403)
 */
export const sellerOnly = (app: Elysia) =>
  app.onBeforeHandle(({ user, set }: any) => {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
    }

    if (!isSeller(user)) {
      set.status = 403
      return errorResponse(
        'Forbidden - Hanya seller yang bisa mengakses endpoint ini',
        ErrorCode.FORBIDDEN
      )
    }

    // Allow request to continue
    return undefined
  })
