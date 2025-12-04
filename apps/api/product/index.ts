import { Elysia, t } from 'elysia'
import { productController } from './product_controller'
import { jwtPlugin, authDerive, isSeller } from '../lib/auth-helper'
import { errorResponse, ErrorCode } from '../lib/response'
import { v } from '../lib/validators'

export const productRoutes = new Elysia({ prefix: '/products' })
  .use(jwtPlugin)
  .derive(authDerive)

  // GET /products - List all products (public)
  .get(
    '/',
    async ({ query }) => {
      const filter = {
        ...(query.categoryId && { categoryId: query.categoryId }),
        ...(query.search && { search: query.search }),
        ...(query.minPrice && { minPrice: Number(query.minPrice) }),
        ...(query.maxPrice && { maxPrice: Number(query.maxPrice) }),
      }

      return productController.getAll(
        filter,
        query.page ? Number(query.page) : 1,
        query.limit ? Number(query.limit) : 20
      )
    },
    {
      query: t.Object({
        categoryId: t.Optional(t.String()),
        search: t.Optional(t.String()),
        minPrice: t.Optional(t.String()),
        maxPrice: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Products'],
        summary: 'List all products',
        description: 'Get all products with optional filters and pagination.',
      },
    }
  )

  // GET /products/:slug - Get product by slug (public)
  .get(
    '/:slug',
    async ({ params, set }) => {
      const result = await productController.getBySlug(params.slug)

      if (!result.success) {
        set.status = 404
      }

      return result
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      detail: {
        tags: ['Products'],
        summary: 'Get product by slug',
        description: 'Get product details by slug.',
      },
    }
  )

  // POST /products - Create product (SELLER only)
  .post(
    '/',
    async ({ user, body, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await productController.create(user.id, {
        categoryId: body.categoryId,
        name: body.name,
        price: body.price,
        stock: body.stock,
        ...(body.slug && { slug: body.slug }),
        ...(body.description && { description: body.description }),
        ...(body.image && { image: body.image }),
      })

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        categoryId: t.String(),
        name: v.name(),
        slug: t.Optional(v.slug()),
        description: t.Optional(t.String({ maxLength: 5000 })),
        price: v.price(),
        stock: v.stock(),
        image: t.Optional(v.url()),
      }),
      detail: {
        tags: ['Products'],
        summary: 'Create product',
        description: 'Create a new product. Seller only.',
      },
    }
  )

  // PUT /products/:id - Update product (SELLER only, own products)
  .put(
    '/:id',
    async ({ user, params, body, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await productController.update(user.id, params.id, body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        categoryId: t.Optional(t.String()),
        name: t.Optional(v.name()),
        slug: t.Optional(v.slug()),
        description: t.Optional(t.String({ maxLength: 5000 })),
        price: t.Optional(v.price()),
        stock: t.Optional(v.stock()),
        image: t.Optional(v.url()),
      }),
      detail: {
        tags: ['Products'],
        summary: 'Update product',
        description: 'Update a product. Seller only, must own the product.',
      },
    }
  )

  // DELETE /products/:id - Delete product (SELLER only, own products)
  .delete(
    '/:id',
    async ({ user, params, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await productController.delete(user.id, params.id)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ['Products'],
        summary: 'Delete product',
        description: 'Delete a product. Seller only, must own the product.',
      },
    }
  )

// My products route
export const myProductsRoute = new Elysia()
  .use(jwtPlugin)
  .derive(authDerive)

  // GET /my-products - Get my products (SELLER)
  .get(
    '/my-products',
    async ({ user, query, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Seller only', ErrorCode.FORBIDDEN)
      }

      const result = await productController.getMyProducts(
        user.id,
        query.page ? Number(query.page) : 1,
        query.limit ? Number(query.limit) : 20
      )

      if (!result.success) {
        set.status = 404
      }

      return result
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Products'],
        summary: 'Get my products',
        description: 'Get all products from my store. Seller only.',
      },
    }
  )

// Store products (add to public store routes)
export const storeProductsRoute = new Elysia()

  // GET /stores/:slug/products - Get products by store (public)
  .get(
    '/stores/:slug/products',
    async ({ params, query, set }) => {
      const result = await productController.getByStoreSlug(
        params.slug,
        query.page ? Number(query.page) : 1,
        query.limit ? Number(query.limit) : 20
      )

      if (!result.success) {
        set.status = 404
      }

      return result
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Store'],
        summary: 'Get store products',
        description: 'Get all products from a store by store slug.',
      },
    }
  )
