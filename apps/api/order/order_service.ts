import { orderRepository } from './order_repository'

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED'

export const orderService = {
  // Checkout - create order from cart
  async checkout(userId: string) {
    // Get cart items
    const cartItems = await orderRepository.getCartItems(userId)

    if (cartItems.length === 0) {
      return { success: false, error: 'Keranjang kosong' }
    }

    // Validate stock and calculate total
    let total = 0
    const orderItems: { productId: string; price: number; quantity: number }[] = []

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return {
          success: false,
          error: `Stok ${item.product.name} tidak cukup. Tersedia: ${item.product.stock}`,
        }
      }

      const price = Number(item.product.price)
      total += price * item.quantity
      orderItems.push({
        productId: item.productId,
        price,
        quantity: item.quantity,
      })
    }

    // Create order
    const order = await orderRepository.createOrder(userId, total, orderItems)

    return { success: true, data: order }
  },

  // Get user's orders
  async getMyOrders(userId: string, page = 1, limit = 10) {
    const result = await orderRepository.getUserOrders(userId, page, limit)
    return { success: true, data: result }
  },

  // Get single order detail
  async getOrderDetail(userId: string, orderId: string) {
    const order = await orderRepository.getOrderById(orderId)

    if (!order) {
      return { success: false, error: 'Order tidak ditemukan' }
    }

    // Check if user owns this order or is a seller with products in this order
    const userStore = await orderRepository.getUserStore(userId)
    const isOwner = order.userId === userId
    const isSeller = userStore && order.items.some(item => item.product.store?.userId === userId)

    if (!isOwner && !isSeller) {
      return { success: false, error: 'Anda tidak memiliki akses ke order ini' }
    }

    return { success: true, data: order }
  },

  // Cancel order (only PENDING orders)
  async cancelOrder(userId: string, orderId: string) {
    const order = await orderRepository.getOrderById(orderId)

    if (!order) {
      return { success: false, error: 'Order tidak ditemukan' }
    }

    if (order.userId !== userId) {
      return { success: false, error: 'Anda tidak memiliki akses ke order ini' }
    }

    if (order.status !== 'PENDING') {
      return { success: false, error: `Order dengan status ${order.status} tidak dapat dibatalkan` }
    }

    const cancelled = await orderRepository.cancelOrder(orderId)
    return { success: true, data: cancelled, message: 'Order berhasil dibatalkan' }
  },

  // Get seller's orders
  async getSellerOrders(userId: string, page = 1, limit = 10) {
    const store = await orderRepository.getUserStore(userId)

    if (!store) {
      return { success: false, error: 'Anda belum memiliki toko' }
    }

    const result = await orderRepository.getSellerOrders(store.id, page, limit)
    return { success: true, data: result }
  },

  // Update order status (seller only)
  async updateOrderStatus(userId: string, orderId: string, status: OrderStatus) {
    const order = await orderRepository.getOrderById(orderId)

    if (!order) {
      return { success: false, error: 'Order tidak ditemukan' }
    }

    // Check if user is seller with products in this order
    const store = await orderRepository.getUserStore(userId)
    if (!store) {
      return { success: false, error: 'Anda belum memiliki toko' }
    }

    const hasProductsInOrder = order.items.some(item => item.product.store?.userId === userId)
    if (!hasProductsInOrder) {
      return { success: false, error: 'Anda tidak memiliki produk dalam order ini' }
    }

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['PAID', 'CANCELLED'],
      PAID: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DONE'],
      DONE: [],
      CANCELLED: [],
    }

    if (!validTransitions[order.status as OrderStatus].includes(status)) {
      return {
        success: false,
        error: `Status tidak dapat diubah dari ${order.status} ke ${status}`,
      }
    }

    // If cancelling, restore stock
    if (status === 'CANCELLED') {
      await orderRepository.cancelOrder(orderId)
      return { success: true, message: 'Order berhasil dibatalkan' }
    }

    const updated = await orderRepository.updateOrderStatus(orderId, status)
    return { success: true, data: updated, message: `Status order diubah ke ${status}` }
  },
}
