import { chromium, type Browser } from 'playwright'
import type { ScrapedProduct, ScrapingOptions } from '../scrape_service'

export class TokopediaScraper {
  private browser: Browser | null = null

  async scrapeProducts(options: ScrapingOptions): Promise<ScrapedProduct[]> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
      })

      const context = await this.browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        viewport: { width: 1366, height: 768 },
      })

      const page = await context.newPage()

      // Build search URL
      const searchUrl = this.buildSearchUrl(options)
      await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 })

      // Wait for product listings to load
      await page.waitForSelector('[data-testid="masterProductCard"]', { timeout: 10000 })

      // Extract product data
      const rawProducts = await page.evaluate(() => {
        const productElements = document.querySelectorAll('[data-testid="masterProductCard"]')
        const items: any[] = []

        productElements.forEach((element) => {
          try {
            // Product name
            const nameElement = element.querySelector('[data-testid="masterProductName"]')
            const name = nameElement?.textContent?.trim() || ''

            // Product URL
            const linkElement = element.querySelector('a')
            const productUrl = linkElement?.href || ''

            // Product image
            const imageElement = element.querySelector('img') as HTMLImageElement | null
            const imageUrl = imageElement?.src || imageElement?.getAttribute('data-src') || ''

            // Price
            const priceElement = element.querySelector('[data-testid="masterProductPrice"]')
            const priceText = priceElement?.textContent?.trim() || ''

            // Rating
            const ratingElement = element.querySelector('[data-testid="masterProductRating"]')
            const ratingText = ratingElement?.textContent || ''

            // Sold count
            const soldElement = element.querySelector('[data-testid="masterProductSoldCount"]')
            const soldText = soldElement?.textContent || ''

            // Shop name
            const shopElement = element.querySelector('[data-testid="masterProductShopName"]')
            const shopName = shopElement?.textContent?.trim() || ''

            // Location
            const locationElement = element.querySelector('[data-testid="masterProductLocation"]')
            const location = locationElement?.textContent?.trim() || ''

            items.push({
              name,
              priceText,
              ratingText,
              imageUrl,
              productUrl,
              soldText,
              location,
              shopName,
            })
          } catch (error) {
            console.error('Error parsing product element:', error)
          }
        })

        return items
      })

      await this.browser.close()
      this.browser = null

      // Process raw data
      const products: ScrapedProduct[] = []
      for (const raw of rawProducts) {
        const price = this.parsePrice(raw.priceText)
        const rating = this.parseRating(raw.ratingText)
        const sold = this.parseSold(raw.soldText)

        if (raw.name && price > 0) {
          products.push({
            name: raw.name,
            price,
            rating,
            imageUrl: raw.imageUrl,
            productUrl: raw.productUrl,
            source: 'tokopedia',
            sold,
            location: raw.location,
            shopName: raw.shopName,
          })
        }
      }

      return products
    } catch (error) {
      if (this.browser) {
        await this.browser.close()
        this.browser = null
      }
      throw error
    }
  }

  private buildSearchUrl(options: ScrapingOptions): string {
    const baseUrl = 'https://www.tokopedia.com/search'
    const params = new URLSearchParams()

    params.set('q', options.query)

    // Add sorting parameters
    switch (options.sortBy) {
      case 'cheapest':
        params.set('order', 'asc')
        params.set('sort', 'price')
        break
      case 'highest_rating':
        params.set('order', 'desc')
        params.set('sort', 'rating')
        break
      case 'best_selling':
        params.set('order', 'desc')
        params.set('sort', 'sold')
        break
    }

    return `${baseUrl}?${params.toString()}`
  }

  private parsePrice(priceText: string): number {
    // Remove currency symbols and convert to number
    const cleaned = priceText.replace(/[Rp$,.]/g, '').replace(/\s+/g, '')
    const parsed = parseInt(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  private parseRating(ratingText: string): number {
    // Extract rating number (e.g., "4.5 (123)" -> 4.5)
    const match = ratingText.match(/(\d+\.?\d*)/)
    return match && match[1] ? parseFloat(match[1]) : 0
  }

  private parseSold(soldText: string): number {
    // Extract sold count (e.g., "123 terjual" -> 123)
    const match = soldText.match(/(\d+)/)
    return match && match[1] ? parseInt(match[1]) : 0
  }
}

export const tokopediaScraper = new TokopediaScraper()
