import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { scrapeService } from '../../scrape/scrape_service'
import { shopeeScraper } from '../../scrape/shopee/shopee_scraper'
import { tokopediaScraper } from '../../scrape/tokopedia/tokopedia_scraper'

mock.module('../../scrape/shopee/shopee_scraper', () => ({
  shopeeScraper: {
    scrapeProducts: mock(),
  },
}))

mock.module('../../scrape/tokopedia/tokopedia_scraper', () => ({
  tokopediaScraper: {
    scrapeProducts: mock(),
  },
}))

describe('Scrape Service', () => {
  const mockShopeeProducts = [
    {
      name: 'Shopee Product 1',
      price: 100000,
      rating: 4.5,
      imageUrl: 'https://example.com/image1.jpg',
      productUrl: 'https://shopee.co.id/product1',
      source: 'shopee' as const,
      sold: 100,
      location: 'Jakarta',
      shopName: 'Shopee Shop',
    },
    {
      name: 'Shopee Product 2',
      price: 200000,
      rating: 4.0,
      imageUrl: 'https://example.com/image2.jpg',
      productUrl: 'https://shopee.co.id/product2',
      source: 'shopee' as const,
      sold: 50,
      location: 'Bandung',
      shopName: 'Shopee Shop 2',
    },
  ]

  const mockTokopediaProducts = [
    {
      name: 'Tokopedia Product 1',
      price: 150000,
      rating: 4.8,
      imageUrl: 'https://example.com/image3.jpg',
      productUrl: 'https://tokopedia.com/product1',
      source: 'tokopedia' as const,
      sold: 80,
      location: 'Surabaya',
      shopName: 'Tokopedia Shop',
    },
    {
      name: 'Tokopedia Product 2',
      price: 120000,
      rating: 3.5,
      imageUrl: 'https://example.com/image4.jpg',
      productUrl: 'https://tokopedia.com/product2',
      source: 'tokopedia' as const,
      sold: 30,
      location: 'Yogyakarta',
      shopName: 'Tokopedia Shop 2',
    },
  ]

  beforeEach(() => {
    ;(shopeeScraper.scrapeProducts as any).mockReset()
    ;(tokopediaScraper.scrapeProducts as any).mockReset()
  })

  describe('scrapeShopee', () => {
    it('should scrape Shopee products successfully', async () => {
      ;(shopeeScraper.scrapeProducts as any).mockResolvedValue(mockShopeeProducts)

      const options = { query: 'laptop', sortBy: 'cheapest', limit: 10 }
      const result = await scrapeService.scrapeShopee(options)

      expect(result).toEqual(mockShopeeProducts)
      expect(shopeeScraper.scrapeProducts).toHaveBeenCalledWith(options)
    })

    it('should throw error when scraping fails', async () => {
      ;(shopeeScraper.scrapeProducts as any).mockRejectedValue(new Error('Scraping failed'))

      const options = { query: 'laptop' }
      await expect(scrapeService.scrapeShopee(options)).rejects.toThrow(
        'Failed to scrape products from Shopee'
      )
    })
  })

  describe('scrapeTokopedia', () => {
    it('should scrape Tokopedia products successfully', async () => {
      ;(tokopediaScraper.scrapeProducts as any).mockResolvedValue(mockTokopediaProducts)

      const options = { query: 'laptop', sortBy: 'highest_rating', limit: 10 }
      const result = await scrapeService.scrapeTokopedia(options)

      expect(result).toEqual(mockTokopediaProducts)
      expect(tokopediaScraper.scrapeProducts).toHaveBeenCalledWith(options)
    })

    it('should throw error when scraping fails', async () => {
      ;(tokopediaScraper.scrapeProducts as any).mockRejectedValue(new Error('Scraping failed'))

      const options = { query: 'laptop' }
      await expect(scrapeService.scrapeTokopedia(options)).rejects.toThrow(
        'Failed to scrape products from Tokopedia'
      )
    })
  })

  describe('scrapeAll', () => {
    it('should scrape from both platforms successfully', async () => {
      ;(shopeeScraper.scrapeProducts as any).mockResolvedValue(mockShopeeProducts)
      ;(tokopediaScraper.scrapeProducts as any).mockResolvedValue(mockTokopediaProducts)

      const options = { query: 'laptop', limit: 10 }
      const result = await scrapeService.scrapeAll(options)

      expect(result).toHaveLength(4)
      expect(result).toEqual([...mockShopeeProducts, ...mockTokopediaProducts])
    })

    it('should throw error when scraping fails', async () => {
      ;(shopeeScraper.scrapeProducts as any).mockRejectedValue(new Error('Scraping failed'))

      const options = { query: 'laptop' }
      await expect(scrapeService.scrapeAll(options)).rejects.toThrow(
        'Failed to scrape products from all platforms'
      )
    })
  })

  describe('sortAndFilterProducts', () => {
    const allProducts = [...mockShopeeProducts, ...mockTokopediaProducts]

    it('should sort by cheapest price', () => {
      const options = { query: 'laptop', sortBy: 'cheapest' as const }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      expect(result[0].price).toBeLessThanOrEqual(result[1].price)
      expect(result[0].price).toBe(100000) // Shopee Product 1
    })

    it('should sort by highest rating', () => {
      const options = { query: 'laptop', sortBy: 'highest_rating' as const }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating)
      expect(result[0].rating).toBe(4.8) // Tokopedia Product 1
    })

    it('should sort by best selling', () => {
      const options = { query: 'laptop', sortBy: 'best_selling' as const }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      expect(result[0].sold).toBeGreaterThanOrEqual(result[1].sold)
      expect(result[0].sold).toBe(100) // Shopee Product 1
    })

    it('should filter by minimum rating', () => {
      const options = { query: 'laptop', minRating: 4.0 }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      expect(result.every(p => p.rating >= 4.0)).toBe(true)
      expect(result).toHaveLength(3) // Only products with rating >= 4.0
    })

    it('should filter by maximum price', () => {
      const options = { query: 'laptop', maxPrice: 150000 }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      expect(result.every(p => p.price <= 150000)).toBe(true)
      expect(result).toHaveLength(3) // Only products with price <= 150000
    })

    it('should limit results', () => {
      const options = { query: 'laptop', limit: 2 }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      expect(result).toHaveLength(2)
    })

    it('should apply multiple filters', () => {
      const options = {
        query: 'laptop',
        sortBy: 'cheapest' as const,
        minRating: 4.0,
        maxPrice: 150000,
        limit: 2,
      }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      expect(result).toHaveLength(2)
      expect(result.every(p => p.rating >= 4.0 && p.price <= 150000)).toBe(true)
      expect(result[0].price).toBeLessThanOrEqual(result[1].price)
    })

    it('should use default sorting when no sortBy specified', () => {
      const options = { query: 'laptop' }
      const result = scrapeService.sortAndFilterProducts(allProducts, options)

      // Default: sort by rating then price
      expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating)
      if (result[0].rating === result[1].rating) {
        expect(result[0].price).toBeLessThanOrEqual(result[1].price)
      }
    })
  })
})
