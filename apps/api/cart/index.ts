import { Elysia, t } from 'elysia'
import { cartController } from './cart_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'

// [unused] export const cartRoutes = new Elysia({ prefix: '/cart' })
  .use(jwtPlugin)
  .derive(authDerive)
  // GET /cart - Get user's cart
  .get(
    '/',
    async ({ user, set }) => {
      return cartController.getCart(user, set)
    },
    {
      detail: {
        tags: ['Cart'],
        summary: 'Get my cart',
        description: 'Get all items in the current user cart with totals',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // POST /cart - Add item to cart
  .post(
    '/',
    async ({ user, body, set }) => {
      return cartController.addToCart(user, body, set)
    },
    {
      body: t.Object({
        productId: t.String(),
        quantity: t.Optional(t.Number({ minimum: 1, default: 1 })),
      }),
      detail: {
        tags: ['Cart'],
        summary: 'Add to cart',
        description:
          'Add a product to cart. If product already in cart, quantity will be incremented.',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // PUT /cart/:id - Update item quantity
  .put(
    '/:id',
    async ({ user, params, body, set }) => {
      return cartController.updateQuantity(user, params.id, body, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        quantity: t.Number({ minimum: 0 }),
      }),
      detail: {
        tags: ['Cart'],
        summary: 'Update cart item quantity',
        description: 'Update quantity of a cart item. Set to 0 to remove.',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // DELETE /cart/:id - Remove item from cart
  .delete(
    '/:id',
    async ({ user, params, set }) => {
      return cartController.removeFromCart(user, params.id, set)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Cart'],
        summary: 'Remove from cart',
        description: 'Remove an item from cart',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // DELETE /cart - Clear entire cart
  .delete(
    '/',
    async ({ user, set }) => {
      return cartController.clearCart(user, set)
    },
    {
      detail: {
        tags: ['Cart'],
        summary: 'Clear cart',
        description: 'Remove all items from cart',
        security: [{ bearerAuth: [] }],
      },
    }
  )
