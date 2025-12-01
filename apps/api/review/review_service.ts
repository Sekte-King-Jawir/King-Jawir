import { reviewRepository } from './review_repository'

export const reviewService = {
  // Get product reviews (public) - supports ID or slug
  async getProductReviews(productIdOrSlug: string, page = 1, limit = 10) {
    // Find product by ID or slug
    const product = await reviewRepository.getProductByIdOrSlug(productIdOrSlug)
    if (!product) {
      return { success: false, error: 'Produk tidak ditemukan' }
    }

    const result = await reviewRepository.getProductReviews(product.id, page, limit)
    return { success: true, data: result }
  },

  // Create review
  async createReview(userId: string, productId: string, rating: number, comment?: string) {
    // Check product exists
    const product = await reviewRepository.getProduct(productId)
    if (!product) {
      return { success: false, error: 'Produk tidak ditemukan' }
    }

    // Check if user has purchased the product
    const hasPurchased = await reviewRepository.hasUserPurchasedProduct(userId, productId)
    if (!hasPurchased) {
      return { success: false, error: 'Anda harus membeli produk terlebih dahulu sebelum memberikan review' }
    }

    // Check if user already reviewed this product
    const existingReview = await reviewRepository.getUserReview(userId, productId)
    if (existingReview) {
      return { success: false, error: 'Anda sudah memberikan review untuk produk ini' }
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating harus antara 1-5' }
    }

    const review = await reviewRepository.createReview(userId, productId, rating, comment)
    return { success: true, data: review }
  },

  // Update review
  async updateReview(userId: string, reviewId: string, rating?: number, comment?: string) {
    // Get review
    const review = await reviewRepository.getReviewById(reviewId)
    if (!review) {
      return { success: false, error: 'Review tidak ditemukan' }
    }

    // Check ownership
    if (review.userId !== userId) {
      return { success: false, error: 'Anda tidak memiliki akses ke review ini' }
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return { success: false, error: 'Rating harus antara 1-5' }
    }

    const updated = await reviewRepository.updateReview(reviewId, rating, comment)
    return { success: true, data: updated }
  },

  // Delete review
  async deleteReview(userId: string, reviewId: string, isAdmin = false) {
    // Get review
    const review = await reviewRepository.getReviewById(reviewId)
    if (!review) {
      return { success: false, error: 'Review tidak ditemukan' }
    }

    // Check ownership or admin
    if (review.userId !== userId && !isAdmin) {
      return { success: false, error: 'Anda tidak memiliki akses ke review ini' }
    }

    await reviewRepository.deleteReview(reviewId)
    return { success: true, message: 'Review berhasil dihapus' }
  }
}
