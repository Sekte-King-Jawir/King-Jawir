import { Elysia } from 'elysia'
import { jwtPlugin, authDerive, isSeller } from '../lib/auth-helper'
import { errorResponse, ErrorCode } from '../lib/response'
import { sellerController } from './seller_controller'
import { sellerAuthRoutes } from './auth'
import { sellerStoreRoutes } from './store'

export const sellerRoutes = new Elysia({ prefix: '/api/seller' })
  .use(jwtPlugin)
  .derive(authDerive)

  // Auth routes
  .use(sellerAuthRoutes)

  // Protected routes - require seller authentication
  .use(sellerStoreRoutes)

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
  // .get(
  //   '/analytics',
  //   async ({ user, query, set }) => {
  //     if (!user) {
  //       set.status = 401
  //       return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
  //     }
  //     if (!isSeller(user)) {
  //       set.status = 403
  //       return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
  //     }

  //     const result = await sellerController.getAnalyticsData(
  //       user.id,
  //       query.period as 'day' | 'week' | 'month' | undefined
  //     )

  //     if (!result.success) {
  //       set.status = 400
  //     }

  //     return result
  //   },
  //   {
  //     query: t.Object({
  //       period: t.Optional(t.Union([t.Literal('day'), t.Literal('week'), t.Literal('month')])),
  //     }),
  //     detail: {
  //       tags: ['Seller'],
  //       summary: 'Get seller analytics data',
  //       description: 'Get analytics data for seller.',
  //     },
  //   }
  // )
