import { Elysia, t } from 'elysia'
import { scrapeController } from './scrape_controller'

// [unused] export const scrapeRoutes = new Elysia({ prefix: '/scrape' })
  .get(
    '/shopee',
    async ({ query }) => {
      return scrapeController.scrapeShopee(
        query.q,
        query.sortBy,
        query.limit ? parseInt(query.limit) : undefined,
        query.minRating ? parseFloat(query.minRating) : undefined,
        query.maxPrice ? parseInt(query.maxPrice) : undefined
      )
    },
    {
      detail: {
        tags: ['Scraping'],
        summary: 'Scrape products from Shopee',
        description: 'Search and scrape products from Shopee with filtering options',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 2 },
            description: 'Search query',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['cheapest', 'highest_rating', 'best_selling'] },
            description: 'Sort by option',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 50 },
            description: 'Number of results (default: 10)',
          },
          {
            name: 'minRating',
            in: 'query',
            schema: { type: 'number', minimum: 0, maximum: 5 },
            description: 'Minimum rating filter',
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'integer', minimum: 0 },
            description: 'Maximum price filter',
          },
        ],
      },
      query: t.Object({
        q: t.String({ minLength: 2 }),
        sortBy: t.Optional(
          t.Union([t.Literal('cheapest'), t.Literal('highest_rating'), t.Literal('best_selling')])
        ),
        limit: t.Optional(t.String()),
        minRating: t.Optional(t.String()),
        maxPrice: t.Optional(t.String()),
      }),
    }
  )

  .get(
    '/tokopedia',
    async ({ query }) => {
      return scrapeController.scrapeTokopedia(
        query.q,
        query.sortBy,
        query.limit ? parseInt(query.limit) : undefined,
        query.minRating ? parseFloat(query.minRating) : undefined,
        query.maxPrice ? parseInt(query.maxPrice) : undefined
      )
    },
    {
      detail: {
        tags: ['Scraping'],
        summary: 'Scrape products from Tokopedia',
        description: 'Search and scrape products from Tokopedia with filtering options',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 2 },
            description: 'Search query',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['cheapest', 'highest_rating', 'best_selling'] },
            description: 'Sort by option',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 50 },
            description: 'Number of results (default: 10)',
          },
          {
            name: 'minRating',
            in: 'query',
            schema: { type: 'number', minimum: 0, maximum: 5 },
            description: 'Minimum rating filter',
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'integer', minimum: 0 },
            description: 'Maximum price filter',
          },
        ],
      },
      query: t.Object({
        q: t.String({ minLength: 2 }),
        sortBy: t.Optional(
          t.Union([t.Literal('cheapest'), t.Literal('highest_rating'), t.Literal('best_selling')])
        ),
        limit: t.Optional(t.String()),
        minRating: t.Optional(t.String()),
        maxPrice: t.Optional(t.String()),
      }),
    }
  )

  .get(
    '/all',
    async ({ query }) => {
      return scrapeController.scrapeAll(
        query.q,
        query.sortBy,
        query.limit ? parseInt(query.limit) : undefined,
        query.minRating ? parseFloat(query.minRating) : undefined,
        query.maxPrice ? parseInt(query.maxPrice) : undefined
      )
    },
    {
      detail: {
        tags: ['Scraping'],
        summary: 'Scrape products from all platforms',
        description: 'Search and scrape products from both Shopee and Tokopedia',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 2 },
            description: 'Search query',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['cheapest', 'highest_rating', 'best_selling'] },
            description: 'Sort by option',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 50 },
            description: 'Number of results per platform (default: 10)',
          },
          {
            name: 'minRating',
            in: 'query',
            schema: { type: 'number', minimum: 0, maximum: 5 },
            description: 'Minimum rating filter',
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'integer', minimum: 0 },
            description: 'Maximum price filter',
          },
        ],
      },
      query: t.Object({
        q: t.String({ minLength: 2 }),
        sortBy: t.Optional(
          t.Union([t.Literal('cheapest'), t.Literal('highest_rating'), t.Literal('best_selling')])
        ),
        limit: t.Optional(t.String()),
        minRating: t.Optional(t.String()),
        maxPrice: t.Optional(t.String()),
      }),
    }
  )

  .get(
    '/top-cheapest',
    async ({ query }) => {
      return scrapeController.getTop10Cheapest(
        query.q,
        query.minRating ? parseFloat(query.minRating) : undefined
      )
    },
    {
      detail: {
        tags: ['Scraping'],
        summary: 'Get top 10 cheapest products',
        description: 'Get the 10 cheapest products from all platforms with optional minimum rating',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 2 },
            description: 'Search query',
          },
          {
            name: 'minRating',
            in: 'query',
            schema: { type: 'number', minimum: 0, maximum: 5 },
            description: 'Minimum rating filter (default: 0)',
          },
        ],
      },
      query: t.Object({
        q: t.String({ minLength: 2 }),
        minRating: t.Optional(t.String()),
      }),
    }
  )

  .get(
    '/top-rated',
    async ({ query }) => {
      return scrapeController.getTop10HighestRated(
        query.q,
        query.maxPrice ? parseInt(query.maxPrice) : undefined
      )
    },
    {
      detail: {
        tags: ['Scraping'],
        summary: 'Get top 10 highest rated products',
        description:
          'Get the 10 highest rated products from all platforms with optional maximum price',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 2 },
            description: 'Search query',
          },
          {
            name: 'maxPrice',
            in: 'query',
            schema: { type: 'integer', minimum: 0 },
            description: 'Maximum price filter',
          },
        ],
      },
      query: t.Object({
        q: t.String({ minLength: 2 }),
        maxPrice: t.Optional(t.String()),
      }),
    }
  )
