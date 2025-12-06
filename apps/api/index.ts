import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { rateLimit } from 'elysia-rate-limit'
import { priceAnalysisRoutes } from './price-analysis'
import { priceAnalysisWebSocket } from './price-analysis/websocket'
import { logger } from './lib/logger'
import { initMinIO } from './lib/minio'

await initMinIO().catch(error => {
  logger.warn('⚠️ MinIO initialization failed, continuing without it:', error)
})

const app = new Elysia()
  .onRequest(({ request }) => {
    const startTime = Date.now()
    ;(request as any).__startTime = startTime
  })
  .onAfterHandle(({ request, set }) => {
    const startTime = (request as any).__startTime || Date.now()
    const duration = Date.now() - startTime
    const status = typeof set.status === 'number' ? set.status : 200
    const url = new URL(request.url)

    const origin =
      request.headers.get('origin') ||
      request.headers.get('referer') ||
      request.headers.get('host') ||
      'direct'

    const logData = {
      msg: `${request.method} ${url.pathname} ${status} ${duration}ms`,
      method: request.method,
      path: url.pathname,
      status,
      duration: `${duration}ms`,
      origin,
    }

    if (status >= 500) {
      logger.error(logData)
    } else if (status >= 400) {
      logger.warn(logData)
    } else {
      logger.info(logData)
    }
  })
  .onError(({ request, error, code }) => {
    const url = new URL(request.url)
    logger.error({
      msg: `${request.method} ${url.pathname} ERROR`,
      method: request.method,
      path: url.pathname,
      error: error instanceof Error ? error.message : String(error),
      code,
      stack: error instanceof Error ? error.stack : undefined,
    })
  })
  .use(
    rateLimit({
      duration: 60000,
      max: 200, // Increased for development
      errorResponse: new Response(
        JSON.stringify({ success: false, message: 'Rate limit exceeded. Please wait a moment.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    })
  )
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
          title: 'King Jawir - AI Price Analysis & Product Description Generator',
          version: '1.0.0',
          description:
            'API untuk analisis harga produk dari Tokopedia dan generator deskripsi produk dengan AI',
        },
        tags: [
          { name: 'Price Analysis', description: 'AI-powered price analysis from Tokopedia' },
          {
            name: 'AI Tools',
            description: 'Product description generator and other AI-powered tools',
          },
        ],
        components: {
          securitySchemes: {},
        },
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .use(priceAnalysisRoutes)
  .use(priceAnalysisWebSocket)
  .get(
    '/api',
    () => ({ message: 'King Jawir - AI Price Analysis & Product Description Generator API' }),
    {
      detail: {
        tags: ['General'],
        summary: 'Health check',
        description: 'Check if API is running',
      },
    }
  )
  .listen(process.env['API_PORT'] || 4101)

const port = process.env['API_PORT'] || 4101
logger.info(`🚀 Server running at http://localhost:${port}`)
logger.info(`📚 Swagger docs at http://localhost:${port}/docs`)

export { app }
