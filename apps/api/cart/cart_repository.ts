import { prisma } from '../lib/db'

export const cartRepository = {
  async getCart(userId: string) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            image: true,
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    })
  },

  async getCartItem(id: string, userId: string) {
    return prisma.cartItem.findFirst({
      where: { id, userId },
    })
  },

  async getCartItemByProduct(userId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    })
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    return prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            image: true,
          },
        },
      },
    })
  },

  async updateQuantity(id: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            image: true,
          },
        },
      },
    })
  },

  async incrementQuantity(id: string, amount: number) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity: { increment: amount } },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            image: true,
          },
        },
      },
    })
  },

  async removeFromCart(id: string) {
    return prisma.cartItem.delete({
      where: { id },
    })
  },

  async clearCart(userId: string) {
    return prisma.cartItem.deleteMany({
      where: { userId },
    })
  },

  async getProduct(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        storeId: true,
      },
    })
  },
}
