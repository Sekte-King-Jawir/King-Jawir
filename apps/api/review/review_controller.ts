import { reviewService } from './review_service'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
import type { AuthUser } from '../lib/auth-helper'

interface CreateReviewBody {
  productId: string
  rating: number
  comment?: string
}

interface UpdateReviewBody {
  rating?: number
  comment?: string
}

export const reviewController = {
  // GET /products/:productId/reviews - Get product reviews (public)
  async getProductReviews(productId: string, query: { page?: string, limit?: string }, set: any) {
    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')

    const result = await reviewService.getProductReviews(productId, page, limit)

    if (!result.success) {
      set.status = 404
      return errorResponse(result.error!, ErrorCode.NOT_FOUND)
    }

    return successResponse('Reviews berhasil diambil', result.data)
  },

  // POST /reviews - Create review
  async createReview(user: AuthUser | null, body: CreateReviewBody, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    if (!body.productId) {
      set.status = 400
      return errorResponse('productId harus diisi', ErrorCode.BAD_REQUEST)
    }

    if (!body.rating) {
      set.status = 400
      return errorResponse('rating harus diisi', ErrorCode.BAD_REQUEST)
    }

    const result = await reviewService.createReview(user.id, body.productId, body.rating, body.comment)

    if (!result.success) {
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    set.status = 201
    return successResponse('Review berhasil dibuat', result.data)
  },

  // PUT /reviews/:id - Update review
  async updateReview(user: AuthUser | null, reviewId: string, body: UpdateReviewBody, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await reviewService.updateReview(user.id, reviewId, body.rating, body.comment)

    if (!result.success) {
      if (result.error === 'Review tidak ditemukan') {
        set.status = 404
        return errorResponse(result.error, ErrorCode.NOT_FOUND)
      }
      if (result.error === 'Anda tidak memiliki akses ke review ini') {
        set.status = 403
        return errorResponse(result.error, ErrorCode.FORBIDDEN)
      }
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse('Review berhasil diupdate', result.data)
  },

  // DELETE /reviews/:id - Delete review
  async deleteReview(user: AuthUser | null, reviewId: string, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const isAdmin = user.role === 'ADMIN'
    const result = await reviewService.deleteReview(user.id, reviewId, isAdmin)

    if (!result.success) {
      if (result.error === 'Review tidak ditemukan') {
        set.status = 404
        return errorResponse(result.error, ErrorCode.NOT_FOUND)
      }
      if (result.error === 'Anda tidak memiliki akses ke review ini') {
        set.status = 403
        return errorResponse(result.error, ErrorCode.FORBIDDEN)
      }
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse(result.message!)
  }
}
