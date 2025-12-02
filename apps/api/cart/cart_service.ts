import { cartRepository } from './cart_repository'

interface CartItemWithProduct {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: any // Decimal type from Prisma
    stock: number
    image: string | null
    store?: {
      id: string
      name: string
      slug: string
    }
  }
}

export const cartService = {
  async getCart(userId: string) {
    const items = await cartRepository.getCart(userId)

    // Calculate totals
    let totalItems = 0
    let totalPrice = 0

    const cartItems = items.map((item: CartItemWithProduct) => {
      const price = Number(item.product.price)
      const subtotal = price * item.quantity
      totalItems += item.quantity
      totalPrice += subtotal

      return {
        id: item.id,
        quantity: item.quantity,
        subtotal,
        product: {
          ...item.product,
          price,
        },
      }
    })

    return {
      success: true,
      data: {
        items: cartItems,
        totalItems,
        totalPrice,
      },
    }
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    // Check product exists and has stock
    const product = await cartRepository.getProduct(productId)
    if (!product) {
      return { success: false, error: 'Produk tidak ditemukan' }
    }

    if (product.stock < quantity) {
      return { success: false, error: `Stok tidak cukup. Tersedia: ${product.stock}` }
    }

    // Check if already in cart
    const existing = await cartRepository.getCartItemByProduct(userId, productId)

    if (existing) {
      // Update quantity instead
      const newQty = existing.quantity + quantity
      if (product.stock < newQty) {
        return {
          success: false,
          error: `Stok tidak cukup. Tersedia: ${product.stock}, di keranjang: ${existing.quantity}`,
        }
      }

      const updated = await cartRepository.incrementQuantity(existing.id, quantity)
      return { success: true, data: updated, message: 'Quantity updated' }
    }

    // Add new item
    const item = await cartRepository.addToCart(userId, productId, quantity)
    return { success: true, data: item }
  },

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    // Check cart item belongs to user
    const cartItem = await cartRepository.getCartItem(cartItemId, userId)
    if (!cartItem) {
      return { success: false, error: 'Item tidak ditemukan di keranjang' }
    }

    // Check stock
    const product = await cartRepository.getProduct(cartItem.productId)
    if (!product) {
      return { success: false, error: 'Produk tidak ditemukan' }
    }

    if (product.stock < quantity) {
      return { success: false, error: `Stok tidak cukup. Tersedia: ${product.stock}` }
    }

    if (quantity <= 0) {
      // Remove if quantity is 0 or negative
      await cartRepository.removeFromCart(cartItemId)
      return { success: true, data: null, message: 'Item dihapus dari keranjang' }
    }

    const updated = await cartRepository.updateQuantity(cartItemId, quantity)
    return { success: true, data: updated }
  },

  async removeFromCart(userId: string, cartItemId: string) {
    // Check cart item belongs to user
    const cartItem = await cartRepository.getCartItem(cartItemId, userId)
    if (!cartItem) {
      return { success: false, error: 'Item tidak ditemukan di keranjang' }
    }

    await cartRepository.removeFromCart(cartItemId)
    return { success: true, message: 'Item berhasil dihapus dari keranjang' }
  },

  async clearCart(userId: string) {
    await cartRepository.clearCart(userId)
    return { success: true, message: 'Keranjang berhasil dikosongkan' }
  },
}
