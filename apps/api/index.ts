import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { authRoutes } from './auth'
import { storeRoutes, publicStoreRoutes } from './store'
import { categoryRoutes } from './category'
import { productRoutes, myProductsRoute, storeProductsRoute } from './product'
import { profileRoutes } from './profile'
import { cartRoutes } from './cart'
import { orderRoutes, sellerOrderRoutes } from './order'
import { reviewRoutes, productReviewsRoute } from './review'
import { adminRoutes } from './admin'

const app = new Elysia()
  .use(
    swagger({
      path: '/docs',
      documentation: {
        info: {
          title: 'King Jawir Marketplace API',
          version: '1.0.0',
          description: 'API documentation for King Jawir Marketplace - Hackathon Project',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Profile', description: 'User profile management' },
          { name: 'Store', description: 'Store management' },
          { name: 'Categories', description: 'Product categories' },
          { name: 'Products', description: 'Product management' },
          { name: 'Cart', description: 'Shopping cart' },
          { name: 'Orders', description: 'Order management' },
          { name: 'Reviews', description: 'Product reviews' },
          { name: 'Admin', description: 'Admin management' },
        ],
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'accessToken',
            },
          },
        },
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .use(authRoutes)
  .use(profileRoutes)
  .use(storeRoutes)
  .use(publicStoreRoutes)
  .use(categoryRoutes)
  .use(productRoutes)
  .use(myProductsRoute)
  .use(storeProductsRoute)
  .use(cartRoutes)
  .use(orderRoutes)
  .use(sellerOrderRoutes)
  .use(reviewRoutes)
  .use(productReviewsRoute)
  .use(adminRoutes)
  .get('/', () => ({ message: 'Marketplace API' }), {
    detail: {
      tags: ['General'],
      summary: 'Health check',
      description: 'Check if API is running',
    },
  })
  .listen(process.env['API_PORT'] || 4101)

const port = process.env['API_PORT'] || 4101
console.log(`🚀 Server running at http://localhost:${port}`)
console.log(`📚 Swagger docs at http://localhost:${port}/docs`)

export { app }
