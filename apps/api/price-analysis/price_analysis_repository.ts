import { logger } from '../lib/logger'

interface TokopediaProduct {
  name: string
  price: string
  rating?: string
  image_url: string
  product_url: string
  shop_location?: string
}

interface BlibliProduct {
  name: string
  price: string
  rating?: string
  image_url: string
  product_url: string
  shop_location?: string
  sold?: string
}

interface UnifiedProduct {
  name: string
  price: string
  rating?: string
  image_url: string
  product_url: string
  shop_location?: string
  sold?: string
  source: 'tokopedia' | 'blibli'
}

interface ScraperResponse {
  success: boolean
  data: TokopediaProduct[] | BlibliProduct[]
  count: number
}

export const priceAnalysisRepository = {
  /**
   * Fetch product prices from Tokopedia scraper service
   * @param query - Search query for products
   * @param limit - Number of products to fetch (default: 10)
   * @returns Array of products with prices
   */
  async fetchTokopediaPrices(query: string, limit: number = 10): Promise<TokopediaProduct[]> {
    const scraperUrl = process.env['SCRAPER_URL'] || 'http://localhost:4103'
    const endpoint = `${scraperUrl}/api/scraper/tokopedia`

    try {
      const response = await fetch(`${endpoint}?query=${encodeURIComponent(query)}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Scraper API returned ${response.status}: ${response.statusText}`)
      }

      const result: ScraperResponse = await response.json()

      if (!result.success) {
        throw new Error('Scraper API returned unsuccessful response')
      }

      return result.data
    } catch (error) {
      logger.error({
        msg: 'Error fetching from scraper',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      throw new Error(
        `Failed to fetch prices from scraper: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Fetch product prices from Blibli scraper service
   * @param query - Search query for products
   * @param limit - Number of products to fetch (default: 10)
   * @returns Array of products with prices
   */
  async fetchBlibliPrices(query: string, limit: number = 10): Promise<BlibliProduct[]> {
    const scraperUrl = process.env['SCRAPER_URL'] || 'http://localhost:4103'
    const endpoint = `${scraperUrl}/api/scraper/blibli`

    try {
      const response = await fetch(`${endpoint}?query=${encodeURIComponent(query)}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Scraper API returned ${response.status}: ${response.statusText}`)
      }

      const result: ScraperResponse = await response.json()

      if (!result.success) {
        throw new Error('Scraper API returned unsuccessful response')
      }

      return result.data as BlibliProduct[]
    } catch (error) {
      logger.error({
        msg: 'Error fetching from Blibli scraper',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      throw new Error(
        `Failed to fetch prices from Blibli scraper: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  /**
   * Fetch product prices from both Tokopedia and Blibli scraper services
   * @param query - Search query for products
   * @param limit - Number of products to fetch from each source (default: 10)
   * @returns Array of unified products with prices from both sources
   */
  async fetchAllPrices(query: string, limit: number = 10): Promise<UnifiedProduct[]> {
    const [tokopediaProducts, blibliProducts] = await Promise.allSettled([
      this.fetchTokopediaPrices(query, limit),
      this.fetchBlibliPrices(query, limit),
    ])

    const allProducts: UnifiedProduct[] = []

    // Process Tokopedia results
    if (tokopediaProducts.status === 'fulfilled') {
      const unifiedTokopedia = tokopediaProducts.value.map(product => ({
        ...product,
        source: 'tokopedia' as const,
      }))
      allProducts.push(...unifiedTokopedia)
    } else {
      logger.warn({
        msg: 'Failed to fetch from Tokopedia',
        error: tokopediaProducts.reason instanceof Error ? tokopediaProducts.reason.message : 'Unknown',
      })
    }

    // Process Blibli results
    if (blibliProducts.status === 'fulfilled') {
      const unifiedBlibli = blibliProducts.value.map(product => ({
        ...product,
        source: 'blibli' as const,
      }))
      allProducts.push(...unifiedBlibli)
    } else {
      logger.warn({
        msg: 'Failed to fetch from Blibli',
        error: blibliProducts.reason instanceof Error ? blibliProducts.reason.message : 'Unknown',
      })
    }

    // If no products from either source, throw error
    if (allProducts.length === 0) {
      throw new Error('Failed to fetch products from both Tokopedia and Blibli')
    }

    return allProducts
  },

  /**
   * Parse price string to number
   * Handles Indonesian currency format (Rp1.234.567)
   */
  parsePrice(priceString: string): number {
    const cleaned = priceString.replace(/Rp\.?/gi, '').replace(/\s/g, '').replace(/\./g, '')
    return parseInt(cleaned, 10)
  },

  /**
   * Calculate price statistics
   */
  calculateStats(prices: number[]): {
    min: number
    max: number
    average: number
    median: number
  } {
    if (prices.length === 0) {
      return { min: 0, max: 0, average: 0, median: 0 }
    }

    const sorted = [...prices].sort((a, b) => a - b)
    const sum = sorted.reduce((acc, price) => acc + price, 0)

    return {
      min: sorted[0]!,
      max: sorted[sorted.length - 1]!,
      average: Math.round(sum / sorted.length),
      median:
        sorted.length % 2 === 0
          ? Math.round((sorted[sorted.length / 2 - 1]! + sorted[sorted.length / 2]!) / 2)
          : sorted[Math.floor(sorted.length / 2)]!,
    }
  },
}

export type { TokopediaProduct, BlibliProduct, UnifiedProduct, ScraperResponse }
