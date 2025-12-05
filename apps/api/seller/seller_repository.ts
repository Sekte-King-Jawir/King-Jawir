import { prisma } from '../lib/db'

export const sellerRepository = {
  // Get store by user ID
  async getStoreByUserId(userId: string) {
    return prisma.store.findUnique({
      where: { userId },
    })
  },

  // Get product count for store
  async getProductCount(storeId: string) {
    return prisma.product.count({
      where: { storeId },
    })
  },

  // Get order count for store
  async getOrderCount(storeId: string) {
    return prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              storeId,
            },
          },
        },
      },
    })
  },

  // Get pending order count for store
  async getPendingOrderCount(storeId: string) {
    return prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              storeId,
            },
          },
        },
        status: 'PENDING',
      },
    })
  },

  // Get completed order count for store
  async getCompletedOrderCount(storeId: string) {
    return prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              storeId,
            },
          },
        },
        status: 'DONE',
      },
    })
  },

  // Get cancelled order count for store
  async getCancelledOrderCount(storeId: string) {
    return prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              storeId,
            },
          },
        },
        status: 'CANCELLED',
      },
    })
  },

  // Get total revenue for store
  async getTotalRevenue(storeId: string) {
    // Calculate total revenue (price * quantity for each item)
    const totalRevenue = await prisma.$queryRaw`
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as total
      FROM OrderItem oi
      JOIN Product p ON oi.productId = p.id
      JOIN \`Order\` o ON oi.orderId = o.id
      WHERE p.storeId = ${storeId} AND o.status = 'DONE'
    `

    return (totalRevenue as any)[0]?.total || 0
  },

  // Get recent orders for store
  async getRecentOrders(storeId: string, limit: number) {
    return prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              storeId,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
  },

  // Get top selling products for store
  async getTopProducts(storeId: string, limit: number) {
    const topProducts = await prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        _count: {
          select: {
            orders: {
              where: {
                order: {
                  status: 'DONE',
                },
              },
            },
          },
        },
      },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
      take: limit,
    })

    // Calculate revenue for each product
    const productsWithRevenue = await Promise.all(
      topProducts.map(async product => {
        const revenueResult = await prisma.$queryRaw`
          SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
          FROM OrderItem oi
          JOIN \`Order\` o ON oi.orderId = o.id
          WHERE oi.productId = ${product.id} AND o.status = 'DONE'
        `

        return {
          ...product,
          revenue: (revenueResult as any)[0]?.revenue || 0,
        }
      })
    )

    return productsWithRevenue
  },

  // Get revenue by period
  async getRevenueByPeriod(storeId: string, startDate: Date, endDate: Date) {
    const revenueData = await prisma.$queryRaw`
      SELECT 
        DATE(o.createdAt) as date,
        SUM(oi.price * oi.quantity) as revenue
      FROM \`Order\` o
      JOIN OrderItem oi ON o.id = oi.orderId
      JOIN Product p ON oi.productId = p.id
      WHERE p.storeId = ${storeId}
        AND o.status = 'DONE'
        AND o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
      GROUP BY DATE(o.createdAt)
      ORDER BY date
    `

    return revenueData
  },

  // Get orders by period
  async getOrdersByPeriod(storeId: string, startDate: Date, endDate: Date) {
    const orderData = await prisma.$queryRaw`
      SELECT 
        DATE(o.createdAt) as date,
        COUNT(*) as orders
      FROM \`Order\` o
      JOIN OrderItem oi ON o.id = oi.orderId
      JOIN Product p ON oi.productId = p.id
      WHERE p.storeId = ${storeId}
        AND o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
      GROUP BY DATE(o.createdAt)
      ORDER BY date
    `

    return orderData
  },

  // Get product performance
  async getProductPerformance(storeId: string) {
    const products = await prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        _count: {
          select: {
            orders: {
              where: {
                order: {
                  status: 'DONE',
                },
              },
            },
          },
        },
      },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
    })

    // Calculate revenue for each product
    const productsWithRevenue = await Promise.all(
      products.map(async product => {
        const revenueResult = await prisma.$queryRaw`
          SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
          FROM OrderItem oi
          JOIN \`Order\` o ON oi.orderId = o.id
          WHERE oi.productId = ${product.id} AND o.status = 'DONE'
        `

        return {
          ...product,
          revenue: (revenueResult as any)[0]?.revenue || 0,
        }
      })
    )

    return productsWithRevenue
  },
}
