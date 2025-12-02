import { cartService } from './cart_service'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
import type { AuthUser } from '../lib/auth-helper'

interface AddToCartBody {
  productId: string
  quantity?: number
}

interface UpdateQuantityBody {
  quantity: number
}

export const cartController = {
  async getCart(user: AuthUser | null, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await cartService.getCart(user.id)
    return successResponse('Keranjang berhasil diambil', result.data)
  },

  async addToCart(user: AuthUser | null, body: AddToCartBody, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    if (!body.productId) {
      set.status = 400
      return errorResponse('productId harus diisi', ErrorCode.BAD_REQUEST)
    }

    const quantity = body.quantity || 1
    if (quantity < 1) {
      set.status = 400
      return errorResponse('Quantity minimal 1', ErrorCode.BAD_REQUEST)
    }

    const result = await cartService.addToCart(user.id, body.productId, quantity)

    if (!result.success) {
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    set.status = 201
    return successResponse(result.message || 'Produk ditambahkan ke keranjang', result.data)
  },

  async updateQuantity(
    user: AuthUser | null,
    cartItemId: string,
    body: UpdateQuantityBody,
    set: any
  ) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    if (body.quantity === undefined) {
      set.status = 400
      return errorResponse('quantity harus diisi', ErrorCode.BAD_REQUEST)
    }

    const result = await cartService.updateQuantity(user.id, cartItemId, body.quantity)

    if (!result.success) {
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse(result.message || 'Quantity berhasil diupdate', result.data)
  },

  async removeFromCart(user: AuthUser | null, cartItemId: string, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await cartService.removeFromCart(user.id, cartItemId)

    if (!result.success) {
      set.status = 404
      return errorResponse(result.error!, ErrorCode.NOT_FOUND)
    }

    return successResponse(result.message!)
  },

  async clearCart(user: AuthUser | null, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await cartService.clearCart(user.id)
    return successResponse(result.message!)
  },
}
