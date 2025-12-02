import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { cartService } from '../../cart/cart_service'
import { cartRepository } from '../../cart/cart_repository'

mock.module('../../cart/cart_repository', () => ({
  cartRepository: {
    getCart: mock(),
    getCartItem: mock(),
    getCartItemByProduct: mock(),
    getProduct: mock(),
    addToCart: mock(),
    incrementQuantity: mock(),
    updateQuantity: mock(),
    removeFromCart: mock(),
    clearCart: mock(),
  },
}))

describe('Cart Service', () => {
  const mockProduct = {
    id: 'product-123',
    name: 'Test Product',
    slug: 'test-product',
    price: 100000,
    stock: 10,
    image: 'https://example.com/image.jpg',
  }

  const mockCartItem = {
    id: 'cart-item-123',
    userId: 'user-123',
    productId: 'product-123',
    quantity: 2,
    product: mockProduct,
  }

  beforeEach(() => {
    ;(cartRepository.getCart as any).mockReset()
    ;(cartRepository.getCartItem as any).mockReset()
    ;(cartRepository.getCartItemByProduct as any).mockReset()
    ;(cartRepository.getProduct as any).mockReset()
    ;(cartRepository.addToCart as any).mockReset()
    ;(cartRepository.incrementQuantity as any).mockReset()
    ;(cartRepository.updateQuantity as any).mockReset()
    ;(cartRepository.removeFromCart as any).mockReset()
    ;(cartRepository.clearCart as any).mockReset()
  })

  describe('getCart', () => {
    it('should get user cart with calculated totals', async () => {
      ;(cartRepository.getCart as any).mockResolvedValue([mockCartItem])

      const result = await cartService.getCart('user-123')

      expect(result.success).toBe(true)
      expect(result.data?.items).toHaveLength(1)
      expect(result.data?.totalItems).toBe(2)
      expect(result.data?.totalPrice).toBe(200000)
      expect(result.data?.items[0]!.subtotal).toBe(200000)
    })

    it('should return empty cart if no items', async () => {
      ;(cartRepository.getCart as any).mockResolvedValue([])

      const result = await cartService.getCart('user-123')

      expect(result.success).toBe(true)
      expect(result.data?.items).toHaveLength(0)
      expect(result.data?.totalItems).toBe(0)
      expect(result.data?.totalPrice).toBe(0)
    })

    it('should convert price to number', async () => {
      ;(cartRepository.getCart as any).mockResolvedValue([mockCartItem])

      const result = await cartService.getCart('user-123')

      expect(typeof result.data?.items[0]!.product.price).toBe('number')
    })
  })

  describe('addToCart', () => {
    it('should add new item to cart successfully', async () => {
      ;(cartRepository.getProduct as any).mockResolvedValue(mockProduct)
      ;(cartRepository.getCartItemByProduct as any).mockResolvedValue(null)
      ;(cartRepository.addToCart as any).mockResolvedValue(mockCartItem)

      const result = await cartService.addToCart('user-123', 'product-123', 2)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(cartRepository.addToCart).toHaveBeenCalledWith('user-123', 'product-123', 2)
    })

    it('should return error if product not found', async () => {
      ;(cartRepository.getProduct as any).mockResolvedValue(null)

      const result = await cartService.addToCart('user-123', 'product-123', 2)

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })

    it('should return error if insufficient stock', async () => {
      ;(cartRepository.getProduct as any).mockResolvedValue(mockProduct)

      const result = await cartService.addToCart('user-123', 'product-123', 20)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Stok tidak cukup')
    })

    it('should increment quantity if item already in cart', async () => {
      ;(cartRepository.getProduct as any).mockResolvedValue(mockProduct)
      ;(cartRepository.getCartItemByProduct as any).mockResolvedValue({
        ...mockCartItem,
        quantity: 2,
      })
      ;(cartRepository.incrementQuantity as any).mockResolvedValue({
        ...mockCartItem,
        quantity: 4,
      })

      const result = await cartService.addToCart('user-123', 'product-123', 2)

      expect(result.success).toBe(true)
      expect(result.message).toContain('updated')
      expect(cartRepository.incrementQuantity).toHaveBeenCalledWith('cart-item-123', 2)
    })

    it('should return error if total quantity exceeds stock', async () => {
      ;(cartRepository.getProduct as any).mockResolvedValue(mockProduct)
      ;(cartRepository.getCartItemByProduct as any).mockResolvedValue({
        ...mockCartItem,
        quantity: 9,
      })

      const result = await cartService.addToCart('user-123', 'product-123', 5)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Stok tidak cukup')
    })
  })

  describe('updateQuantity', () => {
    it('should update cart item quantity successfully', async () => {
      ;(cartRepository.getCartItem as any).mockResolvedValue(mockCartItem)
      ;(cartRepository.getProduct as any).mockResolvedValue(mockProduct)
      ;(cartRepository.updateQuantity as any).mockResolvedValue({
        ...mockCartItem,
        quantity: 5,
      })

      const result = await cartService.updateQuantity('user-123', 'cart-item-123', 5)

      expect(result.success).toBe(true)
      expect(cartRepository.updateQuantity).toHaveBeenCalledWith('cart-item-123', 5)
    })

    it('should return error if cart item not found', async () => {
      ;(cartRepository.getCartItem as any).mockResolvedValue(null)

      const result = await cartService.updateQuantity('user-123', 'cart-item-123', 5)

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })

    it('should return error if insufficient stock', async () => {
      ;(cartRepository.getCartItem as any).mockResolvedValue(mockCartItem)
      ;(cartRepository.getProduct as any).mockResolvedValue(mockProduct)

      const result = await cartService.updateQuantity('user-123', 'cart-item-123', 20)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Stok tidak cukup')
    })

    it('should remove item if quantity is 0 or negative', async () => {
      ;(cartRepository.getCartItem as any).mockResolvedValue(mockCartItem)
      ;(cartRepository.getProduct as any).mockResolvedValue(mockProduct)
      ;(cartRepository.removeFromCart as any).mockResolvedValue({})

      const result = await cartService.updateQuantity('user-123', 'cart-item-123', 0)

      expect(result.success).toBe(true)
      expect(result.message).toContain('dihapus')
      expect(cartRepository.removeFromCart).toHaveBeenCalledWith('cart-item-123')
    })
  })

  describe('removeFromCart', () => {
    it('should remove cart item successfully', async () => {
      ;(cartRepository.getCartItem as any).mockResolvedValue(mockCartItem)
      ;(cartRepository.removeFromCart as any).mockResolvedValue({})

      const result = await cartService.removeFromCart('user-123', 'cart-item-123')

      expect(result.success).toBe(true)
      expect(cartRepository.removeFromCart).toHaveBeenCalledWith('cart-item-123')
    })

    it('should return error if cart item not found', async () => {
      ;(cartRepository.getCartItem as any).mockResolvedValue(null)

      const result = await cartService.removeFromCart('user-123', 'cart-item-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })

    it('should not allow removing other users cart items', async () => {
      ;(cartRepository.getCartItem as any).mockResolvedValue(null)

      const result = await cartService.removeFromCart('other-user', 'cart-item-123')

      expect(result.success).toBe(false)
    })
  })

  describe('clearCart', () => {
    it('should clear all cart items successfully', async () => {
      ;(cartRepository.clearCart as any).mockResolvedValue({})

      const result = await cartService.clearCart('user-123')

      expect(result.success).toBe(true)
      expect(result.message).toContain('dikosongkan')
      expect(cartRepository.clearCart).toHaveBeenCalledWith('user-123')
    })
  })
})
