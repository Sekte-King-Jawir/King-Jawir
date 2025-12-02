import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { scrapeController } from '../../scrape/scrape_controller'
import { scrapeService } from '../../scrape/scrape_service'

mock.module('../../scrape/scrape_service', () => ({
  scrapeService: {
    scrapeShopee: mock(),
    scrapeTokopedia: mock(),
    scrapeAll: mock(),
  },
}))

describe('Scrape Controller', () => {
  const mockProducts = [
    {
      name: 'Test Product',
      price: 100000,
      rating: 4.5,
      imageUrl: 'https://example.com/image.jpg',
      productUrl: 'https://example.com/product',
      source: 'shopee' as const,
      sold: 100,
      location: 'Jakarta',
      shopName: 'Test Shop'
    }
  ]

  beforeEach(() => {
    ;(scrapeService.scrapeShopee as any).mockReset()
    ;(scrapeService.scrapeTokopedia as any).mockReset()
    ;(scrapeService.scrapeAll as any).mockReset()
  })

  describe('scrapeShopee', () => {
    it('should return success response with Shopee products', async () => {
      ;(scrapeService.scrapeShopee as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.scrapeShopee('laptop', 'cheapest', 10, 4.0, 200000)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Shopee successfully')
      expect(result.data?.products).toEqual(mockProducts)
      expect(result.data?.source).toBe('shopee')
      expect(result.data?.total).toBe(1)
      expect(result.data?.query).toBe('laptop')
      expect(result.data?.filters.sortBy).toBe('cheapest')
      expect(result.data?.filters.limit).toBe(10)
      expect(result.data?.filters.minRating).toBe(4.0)
      expect(result.data?.filters.maxPrice).toBe(200000)
    })

    it('should return validation error for empty query', async () => {
      const result = await scrapeController.scrapeShopee('', 'cheapest', 10)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('VALIDATION_ERROR')
      expect(result.message).toContain('minimal 2 karakter')
    })

    it('should return validation error for short query', async () => {
      const result = await scrapeController.scrapeShopee('a', 'cheapest', 10)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when scraping fails', async () => {
      ;(scrapeService.scrapeShopee as any).mockRejectedValue(new Error('Scraping failed'))

      const result = await scrapeController.scrapeShopee('laptop', 'cheapest', 10)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('INTERNAL_ERROR')
      expect(result.message).toContain('Failed to scrape')
    })

    it('should use default values when optional parameters not provided', async () => {
      ;(scrapeService.scrapeShopee as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.scrapeShopee('laptop')

      expect(result.success).toBe(true)
      expect(result.data?.filters.limit).toBe(10)
      expect(result.data?.filters.minRating).toBe(0)
      expect(result.data?.filters.maxPrice).toBeUndefined()
    })
  })

  describe('scrapeTokopedia', () => {
    it('should return success response with Tokopedia products', async () => {
      ;(scrapeService.scrapeTokopedia as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.scrapeTokopedia('laptop', 'highest_rating', 5, 3.5, 150000)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Tokopedia successfully')
      expect(result.data?.source).toBe('tokopedia')
      expect(result.data?.filters.sortBy).toBe('highest_rating')
      expect(result.data?.filters.limit).toBe(5)
      expect(result.data?.filters.minRating).toBe(3.5)
      expect(result.data?.filters.maxPrice).toBe(150000)
    })

    it('should return validation error for empty query', async () => {
      const result = await scrapeController.scrapeTokopedia('', 'highest_rating', 5)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when scraping fails', async () => {
      ;(scrapeService.scrapeTokopedia as any).mockRejectedValue(new Error('Scraping failed'))

      const result = await scrapeController.scrapeTokopedia('laptop', 'highest_rating', 5)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('INTERNAL_ERROR')
    })
  })

  describe('scrapeAll', () => {
    it('should return success response with products from all platforms', async () => {
      ;(scrapeService.scrapeAll as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.scrapeAll('laptop', 'best_selling', 20, 4.0, 300000)

      expect(result.success).toBe(true)
      expect(result.message).toContain('all platforms successfully')
      expect(result.data?.products).toEqual(mockProducts)
      expect(result.data?.summary.total).toBe(1)
      expect(result.data?.summary.shopee).toBe(0) // Assuming no shopee products in mock
      expect(result.data?.summary.tokopedia).toBe(0) // Assuming no tokopedia products in mock
      expect(result.data?.filters.sortBy).toBe('best_selling')
      expect(result.data?.filters.limit).toBe(20)
    })

    it('should return validation error for empty query', async () => {
      const result = await scrapeController.scrapeAll('', 'best_selling', 20)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when scraping fails', async () => {
      ;(scrapeService.scrapeAll as any).mockRejectedValue(new Error('Scraping failed'))

      const result = await scrapeController.scrapeAll('laptop', 'best_selling', 20)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('INTERNAL_ERROR')
    })
  })

  describe('getTop10Cheapest', () => {
    it('should return top 10 cheapest products', async () => {
      ;(scrapeService.scrapeAll as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.getTop10Cheapest('laptop', 4.0)

      expect(result.success).toBe(true)
      expect(result.message).toContain('cheapest products')
      expect(result.data?.products).toEqual(mockProducts)
      expect(result.data?.filters.sortBy).toBe('cheapest')
      expect(result.data?.filters.limit).toBe(10)
      expect(result.data?.filters.minRating).toBe(4.0)
    })

    it('should use default minRating when not provided', async () => {
      ;(scrapeService.scrapeAll as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.getTop10Cheapest('laptop')

      expect(result.success).toBe(true)
      expect(result.data?.filters.minRating).toBe(0)
    })

    it('should return validation error for empty query', async () => {
      const result = await scrapeController.getTop10Cheapest('', 4.0)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when scraping fails', async () => {
      ;(scrapeService.scrapeAll as any).mockRejectedValue(new Error('Scraping failed'))

      const result = await scrapeController.getTop10Cheapest('laptop', 4.0)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('INTERNAL_ERROR')
    })
  })

  describe('getTop10HighestRated', () => {
    it('should return top 10 highest rated products', async () => {
      ;(scrapeService.scrapeAll as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.getTop10HighestRated('laptop', 200000)

      expect(result.success).toBe(true)
      expect(result.message).toContain('highest rated products')
      expect(result.data?.products).toEqual(mockProducts)
      expect(result.data?.filters.sortBy).toBe('highest_rating')
      expect(result.data?.filters.limit).toBe(10)
      expect(result.data?.filters.maxPrice).toBe(200000)
    })

    it('should not include maxPrice when not provided', async () => {
      ;(scrapeService.scrapeAll as any).mockResolvedValue(mockProducts)

      const result = await scrapeController.getTop10HighestRated('laptop')

      expect(result.success).toBe(true)
      expect(result.data?.filters.maxPrice).toBeUndefined()
    })

    it('should return validation error for empty query', async () => {
      const result = await scrapeController.getTop10HighestRated('', 200000)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when scraping fails', async () => {
      ;(scrapeService.scrapeAll as any).mockRejectedValue(new Error('Scraping failed'))

      const result = await scrapeController.getTop10HighestRated('laptop', 200000)

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe('INTERNAL_ERROR')
    })
  })
})