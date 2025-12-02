import { shopeeScraper } from './shopee/shopee_scraper'
import { tokopediaScraper } from './tokopedia/tokopedia_scraper'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

export interface ScrapedProduct {
  name: string
  price: number
  rating: number
  imageUrl: string
  productUrl: string
  source: 'shopee' | 'tokopedia'
  sold?: number
  location?: string
  shopName?: string
}

export interface ScrapingOptions {
  query: string
  sortBy?: 'cheapest' | 'highest_rating' | 'best_selling'
  limit?: number
  minRating?: number
  maxPrice?: number
}

export const scrapeService = {
  async scrapeShopee(options: ScrapingOptions): Promise<ScrapedProduct[]> {
    try {
      const products = await shopeeScraper.scrapeProducts(options)
      return this.sortAndFilterProducts(products, options)
    } catch (error) {
      console.error('Error scraping Shopee:', error)
      throw new Error('Failed to scrape products from Shopee')
    }
  },

  async scrapeTokopedia(options: ScrapingOptions): Promise<ScrapedProduct[]> {
    try {
      const products = await tokopediaScraper.scrapeProducts(options)
      return this.sortAndFilterProducts(products, options)
    } catch (error) {
      console.error('Error scraping Tokopedia:', error)
      throw new Error('Failed to scrape products from Tokopedia')
    }
  },

  async scrapeAll(options: ScrapingOptions): Promise<ScrapedProduct[]> {
    try {
      const [shopeeProducts, tokopediaProducts] = await Promise.all([
        this.scrapeShopee(options),
        this.scrapeTokopedia(options),
      ])

      const allProducts = [...shopeeProducts, ...tokopediaProducts]
      return this.sortAndFilterProducts(allProducts, options)
    } catch (error) {
      console.error('Error scraping all platforms:', error)
      throw new Error('Failed to scrape products from all platforms')
    }
  },

  sortAndFilterProducts(products: ScrapedProduct[], options: ScrapingOptions): ScrapedProduct[] {
    let filtered = products

    // Filter by minimum rating
    if (options.minRating) {
      filtered = filtered.filter(p => p.rating >= options.minRating!)
    }

    // Filter by maximum price
    if (options.maxPrice) {
      filtered = filtered.filter(p => p.price <= options.maxPrice!)
    }

    // Sort products
    switch (options.sortBy) {
      case 'cheapest':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'highest_rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'best_selling':
        filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0))
        break
      default:
        // Default: sort by rating then price
        filtered.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating
          }
          return a.price - b.price
        })
    }

    // Limit results
    if (options.limit) {
      filtered = filtered.slice(0, options.limit)
    }

    return filtered
  },
}
