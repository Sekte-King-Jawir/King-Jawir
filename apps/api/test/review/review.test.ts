import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { reviewService } from '../../review/review_service'
import { reviewRepository } from '../../review/review_repository'

mock.module('../../review/review_repository', () => ({
  reviewRepository: {
    getProductByIdOrSlug: mock(),
    getProductReviews: mock(),
    getReviewById: mock(),
    hasUserReviewed: mock(),
    hasUserPurchased: mock(),
    create: mock(),
    update: mock(),
    delete: mock(),
  },
}))

describe('Review Service', () => {
  const mockReview = {
    id: 'review-123',
    userId: 'user-123',
    productId: 'product-123',
    rating: 5,
    comment: 'Great product!',
    user: {
      name: 'Test User',
      avatar: null,
    },
    createdAt: new Date(),
  }

  beforeEach(() => {
    ;(reviewRepository.getProductByIdOrSlug as any).mockReset()
    ;(reviewRepository.getProductReviews as any).mockReset()
    ;(reviewRepository.getReviewById as any).mockReset()
    ;(reviewRepository.hasUserReviewed as any).mockReset()
    ;(reviewRepository.hasUserPurchased as any).mockReset()
    ;(reviewRepository.create as any).mockReset()
    ;(reviewRepository.update as any).mockReset()
    ;(reviewRepository.delete as any).mockReset()
  })

  describe('getProductReviews', () => {
    it('should get product reviews with pagination', async () => {
      ;(reviewRepository.getProductByIdOrSlug as any).mockResolvedValue({ id: 'product-123' })
      ;(reviewRepository.getProductReviews as any).mockResolvedValue({
        reviews: [mockReview],
        page: 1,
        limit: 10,
        total: 1,
      })

      const result = await reviewService.getProductReviews('product-123', 1, 10)

      expect(result.success).toBe(true)
      expect(result.data?.reviews).toHaveLength(1)
      expect(reviewRepository.getProductReviews).toHaveBeenCalledWith('product-123', 1, 10)
    })
  })

  describe('create', () => {
    const createData = {
      productId: 'product-123',
      rating: 5,
      comment: 'Great product!',
    }

    it('should create review successfully', async () => {
      ;(reviewRepository.hasUserReviewed as any).mockResolvedValue(false)
      ;(reviewRepository.hasUserPurchased as any).mockResolvedValue(true)
      ;(reviewRepository.create as any).mockResolvedValue(mockReview)

      const result = await reviewService.create('user-123', createData)

      expect(result.success).toBe(true)
      expect(result.data?.review?.rating).toBe(5)
      expect(reviewRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          ...createData,
        })
      )
    })

    it('should return error if user already reviewed', async () => {
      ;(reviewRepository.hasUserReviewed as any).mockResolvedValue(true)

      const result = await reviewService.create('user-123', createData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('sudah')
    })

    it('should return error if user has not purchased product', async () => {
      ;(reviewRepository.hasUserReviewed as any).mockResolvedValue(false)
      ;(reviewRepository.hasUserPurchased as any).mockResolvedValue(false)

      const result = await reviewService.create('user-123', createData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('membeli')
    })

    it('should validate rating is between 1 and 5', async () => {
      ;(reviewRepository.hasUserReviewed as any).mockResolvedValue(false)
      ;(reviewRepository.hasUserPurchased as any).mockResolvedValue(true)

      const result = await reviewService.create('user-123', {
        ...createData,
        rating: 6,
      })

      expect(result.success).toBe(false)
      expect(result.message).toContain('Rating')
    })

    it('should validate comment length', async () => {
      ;(reviewRepository.hasUserReviewed as any).mockResolvedValue(false)
      ;(reviewRepository.hasUserPurchased as any).mockResolvedValue(true)

      const longComment = 'x'.repeat(1001)
      const result = await reviewService.create('user-123', {
        ...createData,
        comment: longComment,
      })

      expect(result.success).toBe(false)
      expect(result.message).toContain('Comment')
    })
  })

  describe('update', () => {
    const updateData = {
      rating: 4,
      comment: 'Updated review',
    }

    it('should update review successfully', async () => {
      ;(reviewRepository.getReviewById as any).mockResolvedValue(mockReview)
      ;(reviewRepository.update as any).mockResolvedValue({
        ...mockReview,
        ...updateData,
      })

      const result = await reviewService.update('user-123', 'review-123', updateData)

      expect(result.success).toBe(true)
      expect(result.data?.review?.rating).toBe(4)
      expect(reviewRepository.update).toHaveBeenCalledWith('review-123', updateData)
    })

    it('should return error if review not found', async () => {
      ;(reviewRepository.getReviewById as any).mockResolvedValue(null)

      const result = await reviewService.update('user-123', 'review-123', updateData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('tidak ditemukan')
    })

    it('should return error if user is not owner', async () => {
      ;(reviewRepository.getReviewById as any).mockResolvedValue(mockReview)

      const result = await reviewService.update('other-user', 'review-123', updateData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('tidak memiliki akses')
    })

    it('should validate rating if provided', async () => {
      ;(reviewRepository.getReviewById as any).mockResolvedValue(mockReview)

      const result = await reviewService.update('user-123', 'review-123', { rating: 0 })

      expect(result.success).toBe(false)
      expect(result.message).toContain('Rating')
    })
  })

  describe('delete', () => {
    it('should delete review successfully', async () => {
      ;(reviewRepository.getReviewById as any).mockResolvedValue(mockReview)
      ;(reviewRepository.delete as any).mockResolvedValue({})

      const result = await reviewService.delete('user-123', 'review-123')

      expect(result.success).toBe(true)
      expect(reviewRepository.delete).toHaveBeenCalledWith('review-123')
    })

    it('should return error if review not found', async () => {
      ;(reviewRepository.getReviewById as any).mockResolvedValue(null)

      const result = await reviewService.delete('user-123', 'review-123')

      expect(result.success).toBe(false)
      expect(result.message).toContain('tidak ditemukan')
    })

    it('should return error if user is not owner', async () => {
      ;(reviewRepository.getReviewById as any).mockResolvedValue(mockReview)

      const result = await reviewService.delete('other-user', 'review-123')

      expect(result.success).toBe(false)
      expect(result.message).toContain('tidak memiliki akses')
    })
  })
})
