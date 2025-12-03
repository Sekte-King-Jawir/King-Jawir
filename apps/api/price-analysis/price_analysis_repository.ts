interface TokopediaProduct {
  name: string
  price: string
  rating?: string
  image_url: string
  product_url: string
  shop_location?: string
}

interface ScraperResponse {
  success: boolean
  data: TokopediaProduct[]
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
      console.error('Error fetching from scraper:', error)
      throw new Error(`Failed to fetch prices from scraper: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  /**
   * Parse price string to number
   * Handles Indonesian currency format (Rp1.234.567)
   */
  parsePrice(priceString: string): number {
    // Remove "Rp", spaces, and dots (thousands separator)
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
      median: sorted.length % 2 === 0
        ? Math.round((sorted[sorted.length / 2 - 1]! + sorted[sorted.length / 2]!) / 2)
        : sorted[Math.floor(sorted.length / 2)]!,
    }
  },
}

export type { TokopediaProduct, ScraperResponse }
