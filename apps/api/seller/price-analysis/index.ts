import { Elysia, t } from 'elysia'
import { sellerPriceAnalysisController } from './price_analysis_controller'
import { isSeller } from '../../lib/auth-helper'
import { errorResponse, ErrorCode } from '../../lib/response'

// Note: jwtPlugin & authDerive sudah di-apply di parent (seller/index.ts)
export const sellerPriceAnalysisRoutes = new Elysia({
  prefix: '/api/seller/price-analysis',
})
  // GET /seller/price-analysis - Full analysis sebelum create product
  .get(
    '/',
    async ({ user, query, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await sellerPriceAnalysisController.analyze(
        query.productName,
        query.userPrice,
        query.limit
      )

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      query: t.Object({
        productName: t.String({
          minLength: 3,
          description: 'Nama produk yang ingin dianalisis',
        }),
        userPrice: t.Optional(
          t.Number({
            minimum: 0,
            description: 'Harga yang ingin dijual seller (optional)',
          })
        ),
        limit: t.Optional(
          t.Number({
            minimum: 1,
            maximum: 50,
            description: 'Jumlah produk market untuk dianalisis (default: 10)',
          })
        ),
      }),
      detail: {
        tags: ['Seller Price Analysis'],
        summary: 'Analisis harga market untuk produk',
        description:
          'Analisis harga produk dari Tokopedia dengan AI insights khusus untuk seller. Memberikan rekomendasi harga, posisi market, dan saran strategis sebelum menambahkan produk ke toko.',
      },
    }
  )

  // POST /seller/price-analysis/quick-check - Quick validation
  .post(
    '/quick-check',
    async ({ user, body, set }: any) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Silakan login sebagai seller', ErrorCode.UNAUTHORIZED)
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await sellerPriceAnalysisController.quickCheck(
        body.productName,
        body.userPrice
      )

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        productName: t.String({
          minLength: 3,
          description: 'Nama produk',
        }),
        userPrice: t.Number({
          minimum: 0,
          description: 'Harga yang ingin dijual',
        }),
      }),
      detail: {
        tags: ['Seller Price Analysis'],
        summary: 'Quick price check',
        description:
          'Validasi cepat harga produk terhadap market. Menggunakan sample kecil untuk response cepat. Cocok untuk validasi real-time saat seller input harga.',
      },
    }
  )
