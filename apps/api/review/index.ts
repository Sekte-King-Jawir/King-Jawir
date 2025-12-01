import { Elysia, t } from 'elysia'
import { reviewController } from './review_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'

// Public route for getting product reviews
export const productReviewsRoute = new Elysia()
  .get('/products/:slug/reviews', async ({ params, query, set }) => {
    return reviewController.getProductReviews(params.slug, query, set)
  }, {
    params: t.Object({
      slug: t.String()
    }),
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String())
    }),
    detail: {
      tags: ['Reviews'],
      summary: 'Get product reviews',
      description: 'Get reviews for a specific product by ID or slug with pagination and average rating'
    }
  })

// Protected review routes
export const reviewRoutes = new Elysia({ prefix: '/reviews' })
  .use(jwtPlugin)
  .derive(authDerive)
  // POST /reviews - Create review
  .post('/', async ({ user, body, set }) => {
    return reviewController.createReview(user, body, set)
  }, {
    body: t.Object({
      productId: t.String(),
      rating: t.Number({ minimum: 1, maximum: 5 }),
      comment: t.Optional(t.String({ maxLength: 1000 }))
    }),
    detail: {
      tags: ['Reviews'],
      summary: 'Create review',
      description: 'Create a review for a purchased product. User must have completed order with this product.',
      security: [{ bearerAuth: [] }]
    }
  })
  // PUT /reviews/:id - Update review
  .put('/:id', async ({ user, params, body, set }) => {
    return reviewController.updateReview(user, params.id, body, set)
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      rating: t.Optional(t.Number({ minimum: 1, maximum: 5 })),
      comment: t.Optional(t.String({ maxLength: 1000 }))
    }),
    detail: {
      tags: ['Reviews'],
      summary: 'Update review',
      description: 'Update your own review',
      security: [{ bearerAuth: [] }]
    }
  })
  // DELETE /reviews/:id - Delete review
  .delete('/:id', async ({ user, params, set }) => {
    return reviewController.deleteReview(user, params.id, set)
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      tags: ['Reviews'],
      summary: 'Delete review',
      description: 'Delete your own review. Admin can delete any review.',
      security: [{ bearerAuth: [] }]
    }
  })
