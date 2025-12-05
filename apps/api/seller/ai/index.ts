import { Elysia, t } from 'elysia'
import { aiDescriptionController } from './ai_description_controller'
import { isSeller } from '../../lib/auth-helper'
import { errorResponse, ErrorCode } from '../../lib/response'

// Note: jwtPlugin & authDerive sudah di-apply di parent (seller/index.ts)
export const sellerAIRoutes = new Elysia({ prefix: '/api/seller/ai' })

  // POST /seller/ai/generate-description - Generate deskripsi produk dengan AI
  .post(
    '/generate-description',
    async ({ user, body, set }: any) => {
      // Auth check
      if (!user) {
        set.status = 401
        return errorResponse(
          'Unauthorized - Silakan login sebagai seller',
          ErrorCode.UNAUTHORIZED
        )
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await aiDescriptionController.generateDescription(body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        productName: t.String({ minLength: 3, maxLength: 200 }),
        category: t.Optional(t.String({ maxLength: 100 })),
        specs: t.Optional(t.Array(t.String())),
        targetMarket: t.Optional(
          t.Union([t.Literal('premium'), t.Literal('budget'), t.Literal('general')])
        ),
        currentDescription: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Seller AI Tools'],
        summary: 'Generate product description dengan AI',
        description:
          'Generate deskripsi produk yang menarik, SEO-friendly, dan persuasif menggunakan AI. Cocok untuk UMKM yang kesulitan menulis copywriting produk.',
      },
    }
  )

  // POST /seller/ai/improve-description - Improve deskripsi yang sudah ada
  .post(
    '/improve-description',
    async ({ user, body, set }: any) => {
      // Auth check
      if (!user) {
        set.status = 401
        return errorResponse(
          'Unauthorized - Silakan login sebagai seller',
          ErrorCode.UNAUTHORIZED
        )
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      const result = await aiDescriptionController.improveDescription(body)

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        currentDescription: t.String({ minLength: 10 }),
        productName: t.String({ minLength: 3 }),
        improvements: t.Array(t.String(), {
          minItems: 1,
          description:
            'Area yang ingin di-improve, contoh: ["lebih persuasif", "tambah SEO keywords", "fokus pada benefit"]',
        }),
      }),
      detail: {
        tags: ['Seller AI Tools'],
        summary: 'Improve existing product description',
        description:
          'Improve deskripsi produk yang sudah ada berdasarkan feedback atau area spesifik yang ingin diperbaiki.',
      },
    }
  )

  // GET /seller/ai/description-tips - Tips menulis deskripsi produk (no AI call)
  .get(
    '/description-tips',
    async ({ user, set }: any) => {
      // Auth check
      if (!user) {
        set.status = 401
        return errorResponse(
          'Unauthorized - Silakan login sebagai seller',
          ErrorCode.UNAUTHORIZED
        )
      }
      if (!isSeller(user)) {
        set.status = 403
        return errorResponse('Forbidden - Hanya seller yang bisa mengakses', ErrorCode.FORBIDDEN)
      }

      return {
        success: true,
        data: {
          tips: [
            {
              title: '🎯 Fokus pada Benefit, Bukan Fitur',
              description:
                'Customer lebih tertarik dengan "apa manfaatnya untuk saya" dibanding spesifikasi teknis.',
              example: '❌ "Kamera 48MP" → ✅ "Foto jernih seperti kamera profesional"',
            },
            {
              title: '📝 Gunakan Storytelling',
              description:
                'Ceritakan bagaimana produk ini menyelesaikan masalah customer.',
              example:
                'Bosan nasi bungkus biasa? Cobain nasi kotak premium kami dengan lauk homemade...',
            },
            {
              title: '🔍 SEO-Friendly Keywords',
              description: 'Masukkan kata kunci yang sering dicari customer di marketplace.',
              keywords: [
                'Nama produk + brand',
                'Manfaat utama',
                'Target audience',
                'Lokasi/origin (jika relevan)',
              ],
            },
            {
              title: '✨ Call-to-Action Jelas',
              description: 'Ajak customer untuk action dengan urgency.',
              examples: [
                'Order sekarang, stok terbatas!',
                'Chat admin untuk diskon reseller',
                'Gratis ongkir untuk pembelian hari ini',
              ],
            },
            {
              title: '📊 Struktur yang Rapi',
              description: 'Gunakan bullet points, emoji, dan paragraf pendek agar mudah dibaca.',
            },
          ],
          targetMarketGuide: {
            premium: {
              tone: 'Elegant, sophisticated, exclusive',
              keywords: ['premium', 'luxury', 'exclusive', 'limited edition', 'high-quality'],
              avoid: 'Kata-kata seperti "murah", "diskon", terlalu banyak emoji',
            },
            budget: {
              tone: 'Friendly, value-focused, relatable',
              keywords: [
                'terjangkau',
                'hemat',
                'value for money',
                'berkualitas',
                'ekonomis',
              ],
              highlight: 'Harga kompetitif + kualitas yang tetap baik',
            },
            general: {
              tone: 'Conversational, engaging, trustworthy',
              keywords: ['berkualitas', 'terpercaya', 'best seller', 'recommended'],
              highlight: 'Balance antara kualitas dan harga',
            },
          },
        },
      }
    },
    {
      detail: {
        tags: ['Seller AI Tools'],
        summary: 'Tips menulis deskripsi produk yang menarik',
        description:
          'Panduan praktis untuk seller tentang cara menulis deskripsi produk yang efektif dan menarik customer.',
      },
    }
  )
