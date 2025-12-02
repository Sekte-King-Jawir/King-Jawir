import { Elysia, t } from 'elysia'
import { reviewController } from './review_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'
import { v } from '../lib/validators'

// Protected review routes
export const reviewRoutes = new Elysia()
  .use(jwtPlugin)
  .derive(authDerive)
  // POST /reviews - Create review
  .post(
    '/reviews',
    async ({ user, body, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      return reviewController.createReview(user.id, body, set)
    },
    {
      body: t.Object({
        productId: t.String({ minLength: 1 }),
        rating: v.rating(),
        comment: t.Optional(t.String({ maxLength: 1000 })),
      }),
      detail: {
        tags: ['Reviews'],
        summary: 'Create review',
        description: 'Create a review for a product (must have purchased)',
      },
    }
  )
  // PUT /reviews/:id - Update review
  .put(
    '/reviews/:id',
    async ({ user, params, body, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      return reviewController.updateReview(user.id, params.id, body, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        rating: t.Optional(v.rating()),
        comment: t.Optional(t.String({ maxLength: 1000 })),
      }),
      detail: {
        tags: ['Reviews'],
        summary: 'Update review',
        description: 'Update your own review',
      },
    }
  )
  // DELETE /reviews/:id - Delete review
  .delete(
    '/reviews/:id',
    async ({ user, params, set }) => {
      if (!user) {
        set.status = 401
        return {
          success: false,
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED', details: null },
        }
      }

      const isAdmin = user.role === 'ADMIN'
      return reviewController.deleteReview(user.id, params.id, isAdmin, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Reviews'],
        summary: 'Delete review',
        description: 'Delete your own review (admin can delete any)',
      },
    }
  )

// Public product reviews route (uses :slug to match product routes)
export const productReviewsRoute = new Elysia().get(
  '/products/:slug/reviews',
  async ({ params, query, set }) => {
    return reviewController.getProductReviews(params.slug, query, set)
  },
  {
    params: t.Object({
      slug: t.String(),
    }),
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
    detail: {
      tags: ['Reviews'],
      summary: 'Get product reviews',
      description: 'Get reviews for a product by slug (public)',
    },
  }
)
