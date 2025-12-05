import { Elysia, t } from 'elysia'
import { sellerController } from './seller_controller'
import { jwtPlugin, authDerive, isSeller } from '../lib/auth-helper'
import { errorResponse, ErrorCode } from '../lib/response'
import { sellerAuthRoutes } from './auth'
import { sellerProductRoutes } from './products'
import { sellerStoreRoutes } from './store'
import { sellerPriceAnalysisRoutes } from './price-analysis'
import { sellerAIRoutes } from './ai'

export const sellerRoutes = new Elysia({ prefix: '/api/seller' })
  // Auth routes tidak perlu jwt (karena register & login)
  .use(sellerAuthRoutes)

  // Apply JWT & auth middleware untuk semua routes selanjutnya
  .use(jwtPlugin)
  .derive(authDerive)

  // Protected routes - require seller authentication
  .use(sellerProductRoutes)
  .use(sellerStoreRoutes)
  .use(sellerPriceAnalysisRoutes)
  .use(sellerAIRoutes)

  // GET /seller/dashboard - Get seller dashboard data
  .get(
    '/dashboard',
    async ({ user, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await sellerController.getDashboardData(user.id)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      detail: {
        tags: ['Seller'],
        summary: 'Get seller dashboard data',
        description: 'Get dashboard statistics for seller.',
      },
    }
  )

  // GET /seller/analytics - Get seller analytics data
  .get(
    '/analytics',
    async ({ user, query, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await sellerController.getAnalyticsData(
        user.id,
        query.period as 'day' | 'week' | 'month' | undefined
      )

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      query: t.Object({
        period: t.Optional(t.Union([t.Literal('day'), t.Literal('week'), t.Literal('month')])),
      }),
      detail: {
        tags: ['Seller'],
        summary: 'Get seller analytics data',
        description: 'Get analytics data for seller.',
      },
    }
  )
