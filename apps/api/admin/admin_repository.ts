import { prisma } from '../lib/db'

type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN'

export const adminRepository = {
  // Get all users with pagination and filters
  async getUsers(page = 1, limit = 10, search?: string, role?: Role) {
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [{ name: { contains: search } }, { email: { contains: search } }]
    }

    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          emailVerified: true,
          createdAt: true,
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  },

  // Get user by ID
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        address: true,
        bio: true,
        emailVerified: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            cart: true,
          },
        },
      },
    })
  },

  // Update user role
  async updateUserRole(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
  },

  // Delete user (soft delete by clearing data, or hard delete)
  async deleteUser(id: string) {
    // Delete related data first (cascade)
    await prisma.$transaction([
      // Delete reviews
      prisma.review.deleteMany({ where: { userId: id } }),
      // Delete cart items
      prisma.cartItem.deleteMany({ where: { userId: id } }),
      // Delete orders (and their items)
      prisma.orderItem.deleteMany({
        where: { order: { userId: id } },
      }),
      prisma.order.deleteMany({ where: { userId: id } }),
      // Delete store products if seller
      prisma.product.deleteMany({
        where: { store: { userId: id } },
      }),
      // Delete store
      prisma.store.deleteMany({ where: { userId: id } }),
      // Finally delete user
      prisma.user.delete({ where: { id } }),
    ])
  },

  // Get dashboard statistics
  async getStats() {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      ordersByStatus,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Total sellers
      prisma.user.count({ where: { role: 'SELLER' } }),

      // Total products
      prisma.product.count(),

      // Total orders
      prisma.order.count(),

      // Total revenue (only DONE orders)
      prisma.order.aggregate({
        where: { status: 'DONE' },
        _sum: { total: true },
      }),

      // Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
    ])

    // Get product details for top products
    const topProductIds = topProducts.map(p => p.productId)
    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        image: true,
      },
    })

    const topProductsWithDetails = topProducts.map(tp => {
      const product = productDetails.find(p => p.id === tp.productId)
      return {
        ...product,
        totalSold: tp._sum.quantity,
      }
    })

    return {
      overview: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.total) || 0,
      },
      recentOrders: recentOrders.map(o => ({
        ...o,
        total: Number(o.total),
      })),
      topProducts: topProductsWithDetails,
      ordersByStatus: ordersByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count
          return acc
        },
        {} as Record<string, number>
      ),
    }
  },
}
