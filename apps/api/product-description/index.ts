import { Elysia, t } from 'elysia'
import { productDescriptionController } from './product_description_controller'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
import { logger } from '../lib/logger'

export const productDescriptionRoutes = new Elysia({ prefix: '/api/product-description' }).post(
  '/generate',
  async ({ body }) => {
    try {
      const { productInput } = body
      const result = await productDescriptionController.generate(productInput)
      return successResponse('Deskripsi produk berhasil dihasilkan', result)
    } catch (error) {
      logger.error({ msg: 'Product description generation error', error: error instanceof Error ? error.message : 'Unknown' })
      return errorResponse(error instanceof Error ? error.message : 'Failed to generate product description', ErrorCode.INTERNAL_ERROR)
    }
  },
  {
    body: t.Object({
      productInput: t.String({ minLength: 1, maxLength: 500, description: 'Input describing the product' }),
    }),
    detail: {
      tags: ['AI Tools'],
      summary: 'Generate product description using AI',
      description: 'Generate structured product description with short/long descriptions, bullets, and SEO keywords using AI. Response `data` contains `short`, `long`, `bullets`, and `seoKeywords`.',
    },
  }
)
