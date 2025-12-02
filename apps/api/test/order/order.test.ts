import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { orderService } from '../../order/order_service'
import { orderRepository } from '../../order/order_repository'

mock.module('../../order/order_repository', () => ({
  orderRepository: {
    getCartItems: mock(),
    createOrder: mock(),
    getUserOrders: mock(),
    getOrderById: mock(),
    getUserStore: mock(),
    cancelOrder: mock(),
    getSellerOrders: mock(),
    updateOrderStatus: mock(),
  },
}))

describe('Order Service', () => {
  const mockCartItem = {
    productId: 'product-123',
    quantity: 2,
    product: {
      id: 'product-123',
      name: 'Test Product',
      price: 100000,
      stock: 10,
    },
  }

  const mockOrder = {
    id: 'order-123',
    userId: 'user-123',
    total: 200000,
    status: 'PENDING',
    items: [
      {
        productId: 'product-123',
        quantity: 2,
        price: 100000,
        product: {
          store: {
            userId: 'seller-123',
          },
        },
      },
    ],
    createdAt: new Date(),
  }

  const mockStore = {
    id: 'store-123',
    userId: 'seller-123',
  }

  beforeEach(() => {
    ;(orderRepository.getCartItems as any).mockReset()
    ;(orderRepository.createOrder as any).mockReset()
    ;(orderRepository.getUserOrders as any).mockReset()
    ;(orderRepository.getOrderById as any).mockReset()
    ;(orderRepository.getUserStore as any).mockReset()
    ;(orderRepository.cancelOrder as any).mockReset()
    ;(orderRepository.getSellerOrders as any).mockReset()
    ;(orderRepository.updateOrderStatus as any).mockReset()
  })

  describe('checkout', () => {
    it('should create order from cart successfully', async () => {
      ;(orderRepository.getCartItems as any).mockResolvedValue([mockCartItem])
      ;(orderRepository.createOrder as any).mockResolvedValue(mockOrder)

      const result = await orderService.checkout('user-123')

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(orderRepository.createOrder).toHaveBeenCalledWith(
        'user-123',
        200000,
        expect.arrayContaining([
          expect.objectContaining({
            productId: 'product-123',
            price: 100000,
            quantity: 2,
          }),
        ])
      )
    })

    it('should return error if cart is empty', async () => {
      ;(orderRepository.getCartItems as any).mockResolvedValue([])

      const result = await orderService.checkout('user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Keranjang kosong')
    })

    it('should return error if product stock insufficient', async () => {
      ;(orderRepository.getCartItems as any).mockResolvedValue([
        {
          ...mockCartItem,
          quantity: 20,
        },
      ])

      const result = await orderService.checkout('user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Stok')
      expect(result.error).toContain('tidak cukup')
    })

    it('should calculate total correctly', async () => {
      ;(orderRepository.getCartItems as any).mockResolvedValue([
        mockCartItem,
        {
          ...mockCartItem,
          productId: 'product-456',
          quantity: 1,
          product: {
            ...mockCartItem.product,
            id: 'product-456',
            price: 50000,
          },
        },
      ])
      ;(orderRepository.createOrder as any).mockResolvedValue(mockOrder)

      const result = await orderService.checkout('user-123')

      expect(result.success).toBe(true)
      expect(orderRepository.createOrder).toHaveBeenCalledWith(
        'user-123',
        250000,
        expect.any(Array)
      )
    })
  })

  describe('getMyOrders', () => {
    it('should get user orders with pagination', async () => {
      ;(orderRepository.getUserOrders as any).mockResolvedValue({
        orders: [mockOrder],
        page: 1,
        limit: 10,
        total: 1,
      })

      const result = await orderService.getMyOrders('user-123', 1, 10)

      expect(result.success).toBe(true)
      expect(result.data?.orders).toHaveLength(1)
      expect(orderRepository.getUserOrders).toHaveBeenCalledWith('user-123', 1, 10)
    })
  })

  describe('getOrderDetail', () => {
    it('should get order detail for order owner', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue(mockOrder)
      ;(orderRepository.getUserStore as any).mockResolvedValue(null)

      const result = await orderService.getOrderDetail('user-123', 'order-123')

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe('order-123')
    })

    it('should get order detail for seller with products in order', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue(mockOrder)
      ;(orderRepository.getUserStore as any).mockResolvedValue(mockStore)

      const result = await orderService.getOrderDetail('seller-123', 'order-123')

      expect(result.success).toBe(true)
    })

    it('should return error if order not found', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue(null)

      const result = await orderService.getOrderDetail('user-123', 'order-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })

    it('should return error if user has no access', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue(mockOrder)
      ;(orderRepository.getUserStore as any).mockResolvedValue(null)

      const result = await orderService.getOrderDetail('other-user', 'order-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak memiliki akses')
    })
  })

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue(mockOrder)
      ;(orderRepository.cancelOrder as any).mockResolvedValue({
        ...mockOrder,
        status: 'CANCELLED',
      })

      const result = await orderService.cancelOrder('user-123', 'order-123')

      expect(result.success).toBe(true)
      expect(result.message).toContain('berhasil dibatalkan')
      expect(orderRepository.cancelOrder).toHaveBeenCalledWith('order-123')
    })

    it('should return error if order not found', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue(null)

      const result = await orderService.cancelOrder('user-123', 'order-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })

    it('should return error if user is not owner', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue(mockOrder)

      const result = await orderService.cancelOrder('other-user', 'order-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak memiliki akses')
    })

    it('should return error if order status is not PENDING', async () => {
      ;(orderRepository.getOrderById as any).mockResolvedValue({
        ...mockOrder,
        status: 'PAID',
      })

      const result = await orderService.cancelOrder('user-123', 'order-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak dapat dibatalkan')
    })
  })

  describe('getSellerOrders', () => {
    it('should get seller orders successfully', async () => {
      ;(orderRepository.getUserStore as any).mockResolvedValue(mockStore)
      ;(orderRepository.getSellerOrders as any).mockResolvedValue({
        orders: [mockOrder],
        page: 1,
        limit: 10,
        total: 1,
      })

      const result = await orderService.getSellerOrders('seller-123', 1, 10)

      expect(result.success).toBe(true)
      expect(result.data?.orders).toHaveLength(1)
      expect(orderRepository.getSellerOrders).toHaveBeenCalledWith('store-123', 1, 10)
    })

    it('should return error if seller has no store', async () => {
      ;(orderRepository.getUserStore as any).mockResolvedValue(null)

      const result = await orderService.getSellerOrders('user-123', 1, 10)

      expect(result.success).toBe(false)
      expect(result.error).toContain('belum memiliki toko')
    })
  })
})
