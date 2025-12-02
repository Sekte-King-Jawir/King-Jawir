import { orderService } from './order_service'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
import type { AuthUser } from '../lib/auth-helper'

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED'

export const orderController = {
  // POST /orders - Checkout
  async checkout(user: AuthUser | null, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await orderService.checkout(user.id)

    if (!result.success) {
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    set.status = 201
    return successResponse('Order berhasil dibuat', result.data)
  },

  // GET /orders - Get my orders
  async getMyOrders(user: AuthUser | null, query: { page?: string; limit?: string }, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')

    const result = await orderService.getMyOrders(user.id, page, limit)
    return successResponse('Daftar order berhasil diambil', result.data)
  },

  // GET /orders/:id - Get order detail
  async getOrderDetail(user: AuthUser | null, orderId: string, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await orderService.getOrderDetail(user.id, orderId)

    if (!result.success) {
      set.status = result.error === 'Order tidak ditemukan' ? 404 : 403
      return errorResponse(
        result.error!,
        result.error === 'Order tidak ditemukan' ? ErrorCode.NOT_FOUND : ErrorCode.FORBIDDEN
      )
    }

    return successResponse('Detail order berhasil diambil', result.data)
  },

  // PUT /orders/:id/cancel - Cancel order
  async cancelOrder(user: AuthUser | null, orderId: string, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await orderService.cancelOrder(user.id, orderId)

    if (!result.success) {
      if (result.error === 'Order tidak ditemukan') {
        set.status = 404
        return errorResponse(result.error, ErrorCode.NOT_FOUND)
      }
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse(result.message!, result.data)
  },

  // GET /seller/orders - Get seller's orders
  async getSellerOrders(user: AuthUser | null, query: { page?: string; limit?: string }, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      set.status = 403
      return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
    }

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')

    const result = await orderService.getSellerOrders(user.id, page, limit)

    if (!result.success) {
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse('Daftar order seller berhasil diambil', result.data)
  },

  // PUT /seller/orders/:id/status - Update order status
  async updateOrderStatus(
    user: AuthUser | null,
    orderId: string,
    body: { status: OrderStatus },
    set: any
  ) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      set.status = 403
      return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
    }

    const validStatuses: OrderStatus[] = ['PENDING', 'PAID', 'SHIPPED', 'DONE', 'CANCELLED']
    if (!validStatuses.includes(body.status)) {
      set.status = 400
      return errorResponse('Status tidak valid', ErrorCode.BAD_REQUEST)
    }

    const result = await orderService.updateOrderStatus(user.id, orderId, body.status)

    if (!result.success) {
      if (result.error === 'Order tidak ditemukan') {
        set.status = 404
        return errorResponse(result.error, ErrorCode.NOT_FOUND)
      }
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse(result.message!, result.data)
  },
}
