import { scrapeService, ScrapingOptions } from './scrape_service'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

export const scrapeController = {
  async scrapeShopee(
    query: string,
    sortBy?: string,
    limit?: number,
    minRating?: number,
    maxPrice?: number
  ) {
    try {
      // Validate input
      if (!query || query.trim().length < 2) {
        return errorResponse('Query minimal 2 karakter', ErrorCode.VALIDATION_ERROR)
      }

      const options: ScrapingOptions = {
        query: query.trim(),
        sortBy: sortBy as any,
        limit: limit || 10,
        minRating: minRating || 0,
        maxPrice: maxPrice,
      }

      const products = await scrapeService.scrapeShopee(options)

      return successResponse('Products scraped from Shopee successfully', {
        products,
        source: 'shopee',
        total: products.length,
        query: options.query,
        filters: {
          sortBy: options.sortBy,
          limit: options.limit,
          minRating: options.minRating,
          maxPrice: options.maxPrice,
        },
      })
    } catch (error) {
      console.error('Error in scrapeShopee controller:', error)
      return errorResponse('Failed to scrape products from Shopee', ErrorCode.INTERNAL_ERROR)
    }
  },

  async scrapeTokopedia(
    query: string,
    sortBy?: string,
    limit?: number,
    minRating?: number,
    maxPrice?: number
  ) {
    try {
      // Validate input
      if (!query || query.trim().length < 2) {
        return errorResponse('Query minimal 2 karakter', ErrorCode.VALIDATION_ERROR)
      }

      const options: ScrapingOptions = {
        query: query.trim(),
        sortBy: sortBy as any,
        limit: limit || 10,
        minRating: minRating || 0,
        maxPrice: maxPrice,
      }

      const products = await scrapeService.scrapeTokopedia(options)

      return successResponse('Products scraped from Tokopedia successfully', {
        products,
        source: 'tokopedia',
        total: products.length,
        query: options.query,
        filters: {
          sortBy: options.sortBy,
          limit: options.limit,
          minRating: options.minRating,
          maxPrice: options.maxPrice,
        },
      })
    } catch (error) {
      console.error('Error in scrapeTokopedia controller:', error)
      return errorResponse('Failed to scrape products from Tokopedia', ErrorCode.INTERNAL_ERROR)
    }
  },

  async scrapeAll(
    query: string,
    sortBy?: string,
    limit?: number,
    minRating?: number,
    maxPrice?: number
  ) {
    try {
      // Validate input
      if (!query || query.trim().length < 2) {
        return errorResponse('Query minimal 2 karakter', ErrorCode.VALIDATION_ERROR)
      }

      const options: ScrapingOptions = {
        query: query.trim(),
        sortBy: sortBy as any,
        limit: limit || 10,
        minRating: minRating || 0,
        maxPrice: maxPrice,
      }

      const products = await scrapeService.scrapeAll(options)

      // Group by source
      const shopeeProducts = products.filter(p => p.source === 'shopee')
      const tokopediaProducts = products.filter(p => p.source === 'tokopedia')

      return successResponse('Products scraped from all platforms successfully', {
        products,
        summary: {
          total: products.length,
          shopee: shopeeProducts.length,
          tokopedia: tokopediaProducts.length,
        },
        query: options.query,
        filters: {
          sortBy: options.sortBy,
          limit: options.limit,
          minRating: options.minRating,
          maxPrice: options.maxPrice,
        },
      })
    } catch (error) {
      console.error('Error in scrapeAll controller:', error)
      return errorResponse('Failed to scrape products from all platforms', ErrorCode.INTERNAL_ERROR)
    }
  },

  async getTop10Cheapest(query: string, minRating?: number) {
    try {
      // Validate input
      if (!query || query.trim().length < 2) {
        return errorResponse('Query minimal 2 karakter', ErrorCode.VALIDATION_ERROR)
      }

      const options: ScrapingOptions = {
        query: query.trim(),
        sortBy: 'cheapest',
        limit: 10,
        minRating: minRating || 0,
      }

      const products = await scrapeService.scrapeAll(options)

      return successResponse('Top 10 cheapest products retrieved successfully', {
        products,
        total: products.length,
        query: options.query,
        filters: {
          sortBy: 'cheapest',
          limit: 10,
          minRating: options.minRating,
        },
      })
    } catch (error) {
      console.error('Error in getTop10Cheapest controller:', error)
      return errorResponse('Failed to retrieve cheapest products', ErrorCode.INTERNAL_ERROR)
    }
  },

  async getTop10HighestRated(query: string, maxPrice?: number) {
    try {
      // Validate input
      if (!query || query.trim().length < 2) {
        return errorResponse('Query minimal 2 karakter', ErrorCode.VALIDATION_ERROR)
      }

      const options: ScrapingOptions = {
        query: query.trim(),
        sortBy: 'highest_rating',
        limit: 10,
        maxPrice: maxPrice,
      }

      const products = await scrapeService.scrapeAll(options)

      return successResponse('Top 10 highest rated products retrieved successfully', {
        products,
        total: products.length,
        query: options.query,
        filters: {
          sortBy: 'highest_rating',
          limit: 10,
          maxPrice: options.maxPrice,
        },
      })
    } catch (error) {
      console.error('Error in getTop10HighestRated controller:', error)
      return errorResponse('Failed to retrieve highest rated products', ErrorCode.INTERNAL_ERROR)
    }
  },
}
