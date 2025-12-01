import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { authRoutes } from "./auth"

const app = new Elysia()
  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'King Jawir Marketplace API',
        version: '1.0.0',
        description: 'API documentation for King Jawir Marketplace - Hackathon Project'
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Products', description: 'Product management' },
        { name: 'Cart', description: 'Shopping cart' },
        { name: 'Orders', description: 'Order management' },
        { name: 'Store', description: 'Store management' }
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'accessToken'
          }
        }
      }
    },
    swaggerOptions: {
      persistAuthorization: true
    }
  }))
  .use(authRoutes)
  .get("/", () => ({ message: "Marketplace API" }), {
    detail: {
      tags: ['General'],
      summary: 'Health check',
      description: 'Check if API is running'
    }
  })
  .listen(3000)

console.log(`🚀 Server running at http://localhost:3000`)
console.log(`📚 Swagger docs at http://localhost:3000/docs`)