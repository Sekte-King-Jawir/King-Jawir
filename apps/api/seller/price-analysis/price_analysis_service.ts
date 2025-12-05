import { priceAnalysisService } from '../../price-analysis/price_analysis_service'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'
import { logger } from '../../lib/logger'

export const sellerPriceAnalysisService = {
  /**
   * Analyze product price sebelum seller menambahkan ke toko
   * Memberikan rekomendasi harga berdasarkan market data dari Tokopedia
   */
  async analyzeBeforeCreate(
    productName: string,
    userPrice?: number,
    limit: number = 10
  ) {
    try {
      if (!productName || productName.trim() === '') {
        return errorResponse('Nama produk tidak boleh kosong', ErrorCode.VALIDATION_ERROR)
      }

      const analysisLimit = limit > 0 && limit <= 50 ? limit : 10

      logger.info({
        msg: 'Seller price analysis',
        productName,
        userPrice,
        limit: analysisLimit,
      })

      // Gunakan service yang sudah ada untuk analisis
      const result = await priceAnalysisService.analyzePrices(
        productName,
        analysisLimit,
        userPrice
      )

      // Format response untuk seller dengan informasi lebih contextual
      return successResponse('Analisis harga berhasil', {
        ...result,
        sellerGuidance: {
          shouldProceed: this.shouldProceed(result, userPrice),
          pricePosition: this.getPricePosition(result, userPrice),
          warnings: this.getWarnings(result, userPrice),
          suggestions: this.getSuggestions(result, userPrice),
        },
      })
    } catch (error) {
      logger.error({
        msg: 'Seller price analysis error',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      return errorResponse(
        error instanceof Error ? error.message : 'Gagal menganalisis harga',
        ErrorCode.INTERNAL_ERROR
      )
    }
  },

  /**
   * Determine apakah seller sebaiknya proceed dengan harga yang dipilih
   */
  shouldProceed(result: any, userPrice?: number): boolean {
    if (!userPrice) return true

    const stats = result.statistics

    // Jika harga user terlalu tinggi (>20% dari max)
    if (userPrice > stats.max * 1.2) return false

    // Jika harga user terlalu rendah (<50% dari min)
    if (userPrice < stats.min * 0.5) return false

    return true
  },

  /**
   * Get posisi harga user relatif terhadap market
   */
  getPricePosition(result: any, userPrice?: number): string {
    if (!userPrice) return 'not_specified'

    const stats = result.statistics

    if (userPrice < stats.min * 0.7) return 'very_low'
    if (userPrice < stats.min) return 'low'
    if (userPrice <= stats.average * 0.9) return 'below_average'
    if (userPrice <= stats.average * 1.1) return 'average'
    if (userPrice <= stats.max) return 'above_average'
    if (userPrice <= stats.max * 1.2) return 'high'
    return 'very_high'
  },

  /**
   * Get warnings untuk seller
   */
  getWarnings(result: any, userPrice?: number): string[] {
    const warnings: string[] = []

    if (!userPrice) {
      warnings.push('Harga belum ditentukan. Pertimbangkan analisis di bawah.')
      return warnings
    }

    const position = this.getPricePosition(result, userPrice)

    switch (position) {
      case 'very_low':
        warnings.push('⚠️ Harga sangat rendah! Produk mungkin terlihat tidak berkualitas.')
        warnings.push('Pastikan harga masih menguntungkan setelah dikurangi biaya operasional.')
        break
      case 'low':
        warnings.push('💡 Harga di bawah rata-rata market. Bisa menarik banyak pembeli.')
        warnings.push('Pastikan margin profit masih cukup.')
        break
      case 'very_high':
        warnings.push('⚠️ Harga sangat tinggi! Produk mungkin sulit bersaing.')
        warnings.push('Pastikan ada value proposition yang jelas (garansi, bonus, dll).')
        break
      case 'high':
        warnings.push('💡 Harga di atas rata-rata. Pastikan produk memiliki keunggulan.')
        break
    }

    // Warning jika total products yang ditemukan sedikit
    if (result.statistics.totalProducts < 5) {
      warnings.push('⚠️ Data market terbatas. Pertimbangkan riset tambahan.')
    }

    return warnings
  },

  /**
   * Get suggestions untuk seller
   */
  getSuggestions(result: any, userPrice?: number): string[] {
    const suggestions: string[] = []
    const stats = result.statistics

    // Suggestion berdasarkan suggested price dari AI
    if (result.analysis.suggestedPrice) {
      const suggestedPrice = result.analysis.suggestedPrice
      suggestions.push(
        `💰 Harga yang disarankan: Rp${suggestedPrice.toLocaleString('id-ID')}`
      )

      if (userPrice) {
        const diff = ((userPrice - suggestedPrice) / suggestedPrice) * 100
        if (Math.abs(diff) > 10) {
          if (diff > 0) {
            suggestions.push(
              `📊 Harga Anda ${diff.toFixed(1)}% lebih tinggi dari saran AI.`
            )
          } else {
            suggestions.push(
              `📊 Harga Anda ${Math.abs(diff).toFixed(1)}% lebih rendah dari saran AI.`
            )
          }
        }
      }
    }

    // Suggestion berdasarkan range
    suggestions.push(
      `📈 Range harga market: Rp${stats.min.toLocaleString('id-ID')} - Rp${stats.max.toLocaleString('id-ID')}`
    )
    suggestions.push(
      `📊 Harga rata-rata: Rp${stats.average.toLocaleString('id-ID')}`
    )
    suggestions.push(
      `📌 Harga median: Rp${stats.median.toLocaleString('id-ID')}`
    )

    // Suggestion strategis
    if (userPrice) {
      const position = this.getPricePosition(result, userPrice)
      
      if (position === 'below_average' || position === 'low') {
        suggestions.push('💡 Strategi: Volume tinggi dengan margin rendah')
        suggestions.push('🎯 Fokus pada kecepatan pengiriman dan service')
      } else if (position === 'above_average' || position === 'high') {
        suggestions.push('💡 Strategi: Premium positioning')
        suggestions.push('🎯 Tonjolkan kualitas, garansi, atau bonus ekstra')
      } else {
        suggestions.push('💡 Strategi: Kompetitif dengan harga median')
        suggestions.push('🎯 Bersaing melalui review, foto produk, dan deskripsi')
      }
    }

    return suggestions
  },

  /**
   * Quick price check - untuk validasi cepat saat seller input harga
   */
  async quickPriceCheck(productName: string, userPrice: number) {
    try {
      if (!productName || productName.trim() === '') {
        return errorResponse('Nama produk tidak boleh kosong', ErrorCode.VALIDATION_ERROR)
      }

      if (!userPrice || userPrice <= 0) {
        return errorResponse('Harga tidak valid', ErrorCode.VALIDATION_ERROR)
      }

      // Analisis dengan limit kecil untuk speed
      const result = await priceAnalysisService.analyzePrices(productName, 5, userPrice)

      const position = this.getPricePosition(result, userPrice)
      const shouldProceed = this.shouldProceed(result, userPrice)

      return successResponse('Quick check berhasil', {
        userPrice,
        marketAverage: result.statistics.average,
        marketRange: {
          min: result.statistics.min,
          max: result.statistics.max,
        },
        position,
        shouldProceed,
        quickAdvice:
          position === 'very_low' || position === 'very_high'
            ? 'Harga ekstrem - pertimbangkan adjustment'
            : position === 'average'
              ? 'Harga kompetitif'
              : 'Harga wajar',
      })
    } catch (error) {
      logger.error({
        msg: 'Quick price check error',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      return errorResponse(
        'Gagal melakukan quick check',
        ErrorCode.INTERNAL_ERROR
      )
    }
  },
}
