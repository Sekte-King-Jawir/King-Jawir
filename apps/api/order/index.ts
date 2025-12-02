import { Elysia, t } from 'elysia'
import { orderController } from './order_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'

// Customer order routes
// [unused] export const orderRoutes = new Elysia({ prefix: '/orders' })
  .use(jwtPlugin)
  .derive(authDerive)
  // POST /orders - Checkout (create order from cart)
  .post(
    '/',
    async ({ user, set }) => {
      return orderController.checkout(user, set)
    },
    {
      detail: {
        tags: ['Orders'],
        summary: 'Checkout',
        description: 'Create order from cart items. Cart will be cleared after checkout.',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // GET /orders - Get my orders
  .get(
    '/',
    async ({ user, query, set }) => {
      return orderController.getMyOrders(user, query, set)
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Orders'],
        summary: 'Get my orders',
        description: 'Get list of current user orders with pagination',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // GET /orders/:id - Get order detail
  .get(
    '/:id',
    async ({ user, params, set }) => {
      return orderController.getOrderDetail(user, params.id, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Orders'],
        summary: 'Get order detail',
        description: 'Get detail of a specific order. Accessible by order owner or seller.',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // PUT /orders/:id/cancel - Cancel order
  .put(
    '/:id/cancel',
    async ({ user, params, set }) => {
      return orderController.cancelOrder(user, params.id, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Orders'],
        summary: 'Cancel order',
        description: 'Cancel a pending order. Only PENDING orders can be cancelled.',
        security: [{ bearerAuth: [] }],
      },
    }
  )

// Seller order routes
// [unused] export const sellerOrderRoutes = new Elysia({ prefix: '/seller/orders' })
  .use(jwtPlugin)
  .derive(authDerive)
  // GET /seller/orders - Get seller's orders
  .get(
    '/',
    async ({ user, query, set }) => {
      return orderController.getSellerOrders(user, query, set)
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Orders'],
        summary: 'Get seller orders',
        description: "Get orders containing products from seller's store",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // PUT /seller/orders/:id/status - Update order status
  .put(
    '/:id/status',
    async ({ user, params, body, set }) => {
      return orderController.updateOrderStatus(user, params.id, body, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        status: t.Union([
          t.Literal('PENDING'),
          t.Literal('PAID'),
          t.Literal('SHIPPED'),
          t.Literal('DONE'),
          t.Literal('CANCELLED'),
        ]),
      }),
      detail: {
        tags: ['Orders'],
        summary: 'Update order status',
        description: 'Update order status. Valid transitions: PENDING→PAID→SHIPPED→DONE',
        security: [{ bearerAuth: [] }],
      },
    }
  )
