import { prisma } from '../lib/db'

export const orderRepository = {
  // Get user's cart items for checkout
  async getCartItems(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            storeId: true,
            store: {
              select: {
                id: true,
                name: true,
                userId: true,
              }
            }
          }
        }
      }
    })
  },

  // Create order with items
  async createOrder(userId: string, total: number, items: { productId: string, price: number, quantity: number }[]) {
    return prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          items: {
            create: items.map(item => ({
              productId: item.productId,
              price: item.price,
              quantity: item.quantity,
            }))
          }
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  image: true,
                  store: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    }
                  }
                }
              }
            }
          }
        }
      })

      // Reduce stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId }
      })

      return order
    })
  },

  // Get user's orders
  async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  image: true,
                  store: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } })
    ])

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  // Get single order
  async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
                store: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    userId: true,
                  }
                }
              }
            }
          }
        }
      }
    })
  },

  // Cancel order
  async cancelOrder(orderId: string) {
    return prisma.$transaction(async (tx) => {
      // Get order items to restore stock
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      })

      if (!order) return null

      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })
      }

      // Update order status
      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' }
      })
    })
  },

  // Get seller's orders (orders containing their products)
  async getSellerOrders(storeId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    // Get orders that have items from this store
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                storeId
              }
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            }
          },
          items: {
            where: {
              product: {
                storeId
              }
            },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  image: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: {
          items: {
            some: {
              product: {
                storeId
              }
            }
          }
        }
      })
    ])

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED') {
    return prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
  },

  // Get user's store
  async getUserStore(userId: string) {
    return prisma.store.findUnique({
      where: { userId }
    })
  },

  // Check if product belongs to store
  async isProductFromStore(productId: string, storeId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, storeId }
    })
    return !!product
  }
}
