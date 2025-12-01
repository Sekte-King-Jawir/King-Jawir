import { prisma } from '../lib/db'

export const reviewRepository = {
  // Get product reviews
  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { productId } })
    ])

    // Calculate average rating
    const avgResult = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      averageRating: avgResult._avg.rating || 0,
      reviewCount: avgResult._count.rating
    }
  },

  // Get user's review for a product
  async getUserReview(userId: string, productId: string) {
    return prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    })
  },

  // Get review by id
  async getReviewById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })
  },

  // Create review
  async createReview(userId: string, productId: string, rating: number, comment?: string) {
    return prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })
  },

  // Update review
  async updateReview(id: string, rating?: number, comment?: string) {
    return prisma.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    })
  },

  // Delete review
  async deleteReview(id: string) {
    return prisma.review.delete({
      where: { id }
    })
  },

  // Check if product exists
  async getProduct(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true }
    })
  },

  // Get product by ID or slug
  async getProductByIdOrSlug(idOrSlug: string) {
    // Try by ID first
    let product = await prisma.product.findUnique({
      where: { id: idOrSlug },
      select: { id: true, name: true }
    })
    
    // If not found, try by slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: idOrSlug },
        select: { id: true, name: true }
      })
    }
    
    return product
  },

  // Check if user has purchased the product (has completed order with this product)
  async hasUserPurchasedProduct(userId: string, productId: string) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: 'DONE',
        items: {
          some: {
            productId
          }
        }
      }
    })
    return !!order
  }
}
