import { reviewRepository } from './review_repository'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

export const reviewService = {
  // Get product reviews (public) - supports ID or slug
  async getProductReviews(productIdOrSlug: string, page = 1, limit = 10) {
    const product = await reviewRepository.getProductByIdOrSlug(productIdOrSlug)
    if (!product) {
      return errorResponse('Produk tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    const result = await reviewRepository.getProductReviews(product.id, page, limit)
    return successResponse('Reviews retrieved', result)
  },

  // Create review
  async create(userId: string, data: { productId: string; rating: number; comment?: string }) {
    // Validasi rating
    if (data.rating < 1 || data.rating > 5) {
      return errorResponse('Rating harus antara 1-5', ErrorCode.VALIDATION_ERROR)
    }

    // Validasi comment length jika ada
    if (data.comment && data.comment.length > 1000) {
      return errorResponse('Comment maksimal 1000 karakter', ErrorCode.VALIDATION_ERROR)
    }

    // Cek apakah user sudah review
    const hasReviewed = await reviewRepository.hasUserReviewed(userId, data.productId)
    if (hasReviewed) {
      return errorResponse(
        'Anda sudah memberikan review untuk produk ini',
        ErrorCode.ALREADY_EXISTS
      )
    }

    // Cek apakah user sudah beli produk
    const hasPurchased = await reviewRepository.hasUserPurchased(userId, data.productId)
    if (!hasPurchased) {
      return errorResponse('Anda harus membeli produk terlebih dahulu', ErrorCode.BAD_REQUEST)
    }

    const review = await reviewRepository.create({
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
    })

    return successResponse('Review berhasil dibuat', { review })
  },

  // Update review
  async update(userId: string, reviewId: string, data: { rating?: number; comment?: string }) {
    // Validasi rating jika ada
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      return errorResponse('Rating harus antara 1-5', ErrorCode.VALIDATION_ERROR)
    }

    // Validasi comment length jika ada
    if (data.comment && data.comment.length > 1000) {
      return errorResponse('Comment maksimal 1000 karakter', ErrorCode.VALIDATION_ERROR)
    }

    const review = await reviewRepository.getReviewById(reviewId)
    if (!review) {
      return errorResponse('Review tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    if (review.userId !== userId) {
      return errorResponse('Anda tidak memiliki akses', ErrorCode.FORBIDDEN)
    }

    const updated = await reviewRepository.update(reviewId, data)

    return successResponse('Review berhasil diupdate', { review: updated })
  },

  // Delete review
  async delete(userId: string, reviewId: string) {
    const review = await reviewRepository.getReviewById(reviewId)
    if (!review) {
      return errorResponse('Review tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    if (review.userId !== userId) {
      return errorResponse('Anda tidak memiliki akses', ErrorCode.FORBIDDEN)
    }

    await reviewRepository.delete(reviewId)

    return successResponse('Review berhasil dihapus', null)
  },
}
