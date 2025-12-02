import { reviewService } from './review_service'
import type { Context } from 'elysia'

export const reviewController = {
  async getProductReviews(productIdOrSlug: string, query: any, set: Context['set']) {
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10

    const result = await reviewService.getProductReviews(productIdOrSlug, page, limit)

    if (!result.success) {
      set.status = 404
      return {
        success: false,
        message: result.error,
        error: { code: 'NOT_FOUND', details: null },
      }
    }

    return {
      success: true,
      message: 'Reviews berhasil diambil',
      data: result.data,
    }
  },

  async createReview(
    userId: string,
    body: { productId: string; rating: number; comment?: string },
    set: Context['set']
  ) {
    const result = await reviewService.create(userId, {
      productId: body.productId,
      rating: body.rating,
      ...(body.comment !== undefined && { comment: body.comment }),
    })

    if (!result.success) {
      set.status = 400
      return {
        success: false,
        message: result.error,
        error: { code: 'BAD_REQUEST', details: null },
      }
    }

    set.status = 201
    return {
      success: true,
      message: 'Review berhasil dibuat',
      data: result.data,
    }
  },

  async updateReview(
    userId: string,
    reviewId: string,
    body: { rating?: number; comment?: string },
    set: Context['set']
  ) {
    const result = await reviewService.update(userId, reviewId, {
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.comment !== undefined && { comment: body.comment }),
    })

    if (!result.success) {
      set.status = 400
      return {
        success: false,
        message: result.error,
        error: { code: 'BAD_REQUEST', details: null },
      }
    }

    return {
      success: true,
      message: 'Review berhasil diupdate',
      data: result.data,
    }
  },

  async deleteReview(userId: string, reviewId: string, _isAdmin: boolean, set: Context['set']) {
    const result = await reviewService.delete(userId, reviewId)

    if (!result.success) {
      set.status = 400
      return {
        success: false,
        message: result.error,
        error: { code: 'BAD_REQUEST', details: null },
      }
    }

    return {
      success: true,
      message: result.message,
    }
  },
}
