import { Elysia, t } from 'elysia'
import { marketingController } from './marketing_controller'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
import { logger } from '../lib/logger'

export const marketingRoutes = new Elysia({ prefix: '/api/marketing' }).post(
  '/generate',
  async ({ body }) => {
    try {
      const { productDescription, platform } = body
      const result = await marketingController.generate(productDescription, platform)
      return successResponse('Konten pemasaran berhasil dihasilkan', result)
    } catch (error) {
      logger.error({ msg: 'Marketing content generation error', error: error instanceof Error ? error.message : 'Unknown' })
      return errorResponse(error instanceof Error ? error.message : 'Failed to generate marketing content', ErrorCode.INTERNAL_ERROR)
    }
  },
  {
    body: t.Object({
      productDescription: t.Object({
        short: t.String(),
        long: t.String(),
        bullets: t.Array(t.String()),
        seoKeywords: t.Array(t.String()),
      }),
      platform: t.Union([t.Literal('instagram'), t.Literal('facebook'), t.Literal('twitter'), t.Literal('linkedin'), t.Literal('email'), t.Literal('tiktok')]),
    }),
    detail: {
      tags: ['AI Tools'],
      summary: 'Generate marketing content using AI',
      description: 'Generate engaging marketing content (social media posts, emails, etc.) based on product description using AI. Response `data` contains `platform`, `content`, `hashtags`, and `callToAction`.',
    },
  }
)