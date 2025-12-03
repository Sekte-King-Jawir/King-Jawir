import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
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
import { priceAnalysisRoutes } from './price-analysis'

const app = new Elysia()
  .onRequest(({ request }) => {
    console.log(`[${request.method}] ${request.url} | Origin: ${request.headers.get('origin')}`)
  })
  .use(
    cors({
      origin: () => true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    })
  )
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
          { name: 'Price Analysis', description: 'AI-powered price analysis from Tokopedia' },
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
  .use(priceAnalysisRoutes)
  .ws('/api/price-analysis/stream', {
    message(ws, message) {
      // Handle incoming WebSocket messages for price analysis streaming
      try {
        console.log('Received WebSocket message:', message)
        
        // Message is already parsed by Elysia, no need to JSON.parse
        const data = typeof message === 'string' ? JSON.parse(message) : message
        
        // Validate message structure
        if (!data || typeof data !== 'object') {
          throw new Error('Message must be a valid JSON object')
        }
        
        if (data.type === 'start-analysis') {
          // Validate required fields
          if (!data.query || typeof data.query !== 'string' || data.query.trim() === '') {
            throw new Error('Query field is required and must be a non-empty string')
          }
          
          // Import and start streaming analysis
          import('./price-analysis/price_analysis_service').then(({ priceAnalysisService }) => {
            priceAnalysisService.streamAnalysis(
              data.query.trim(),
              data.limit || 10,
              data.userPrice,
              (update) => {
                ws.send(JSON.stringify(update))
              }
            ).catch((error) => {
              console.error('Stream analysis error:', error)
              ws.send(JSON.stringify({
                type: 'error',
                message: error.message || 'Analysis failed'
              }))
            })
          }).catch((importError) => {
            console.error('Import error:', importError)
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Failed to load analysis service'
            }))
          })
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type. Expected "start-analysis"'
          }))
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error)
        ws.send(JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Invalid message format'
        }))
      }
    },
    open(ws) {
      console.log('WebSocket connection opened for price analysis')
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connected successfully'
      }))
    },
    close(ws) {
      console.log('WebSocket connection closed')
    }
  })
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
