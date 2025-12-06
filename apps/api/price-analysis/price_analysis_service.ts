import { priceAnalysisRepository, type UnifiedProduct } from './price_analysis_repository'
import { generateChatCompletion } from '../lib/ai'
import { logger } from '../lib/logger'
import {
  buildAnalysisPrompt,
  buildQueryOptimizationPrompt,
  parseAIResponse,
  getFallbackAnalysis,
} from './price_analysis_ai_helper'

interface PriceAnalysisResult {
  query: string
  optimizedQuery?: string
  products: UnifiedProduct[]
  statistics: {
    min: number
    max: number
    average: number
    median: number
    totalProducts: number
  }
  analysis: {
    recommendation: string
    insights: string[]
    suggestedPrice?: number
  }
}

export const priceAnalysisService = {
  /**
   * Optimize search query using AI to make it more specific and relevant
   * @param query - Original user query
   * @returns Optimized query string
   */
  async optimizeSearchQuery(query: string): Promise<string> {
    try {
      const prompt = buildQueryOptimizationPrompt(query)

      const response = await generateChatCompletion(
        [
          {
            role: 'system',
            content:
              'Kamu adalah query optimizer. Return HANYA optimized query string, tanpa penjelasan apapun.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          temperature: 0.3,
          maxTokens: 100,
        }
      )

      const optimized = response.text.trim().replace(/["'`]/g, '').replace(/\n/g, ' ')
      logger.info({ msg: `🔍 Query optimization`, original: query, optimized })
      return optimized || query
    } catch (error) {
      logger.error({
        msg: 'Error optimizing query',
        error: error instanceof Error ? error.message : 'Unknown',
      })
      return query // Fallback to original query
    }
  },

  /**
   * Stream price analysis with real-time updates
   * @param query - Product search query
   * @param limit - Number of products to analyze
   * @param userPrice - Optional: User's intended selling price for comparison
   * @param onUpdate - Callback function for streaming updates
   */
  async streamAnalysis(
    query: string,
    onUpdate: (update: any) => void,
    limit: number = 10,
    userPrice?: number
  ): Promise<void> {
    try {
      onUpdate({
        type: 'progress',
        step: 'initializing',
        message: '🔍 Initializing price analysis...',
        progress: 5,
      })

      onUpdate({
        type: 'progress',
        step: 'optimizing',
        message: '🤖 Optimizing search query with AI...',
        progress: 10,
      })

      const optimizedQuery = await this.optimizeSearchQuery(query)

      // Step 2: Fetch products
      onUpdate({
        type: 'progress',
        step: 'fetching',
        message: `📊 Searching for "${optimizedQuery}"...`,
        progress: 15,
      })

      let products: UnifiedProduct[] = []
      try {
        products = await priceAnalysisRepository.fetchAllPrices(optimizedQuery, limit)
      } catch (fetchError) {
        logger.error({
          msg: 'Error fetching products',
          error: fetchError instanceof Error ? fetchError.message : 'Unknown',
        })
        throw new Error(
          `Failed to fetch products: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`
        )
      }

      if (products.length === 0) {
        throw new Error('No products found for the given query')
      }

      onUpdate({
        type: 'progress',
        step: 'fetching',
        message: `📦 Found ${products.length} products...`,
        progress: 35,
      })

      await this.delay(1500)

      onUpdate({
        type: 'progress',
        step: 'calculating',
        message: '📈 Calculating market statistics...',
        progress: 50,
      })

      let prices: number[] = []
      let stats: ReturnType<typeof priceAnalysisRepository.calculateStats> = {} as any
      try {
        prices = products.map(p => priceAnalysisRepository.parsePrice(p.price))
        stats = priceAnalysisRepository.calculateStats(prices)
      } catch (statsError) {
        logger.error({
          msg: 'Error calculating statistics',
          error: statsError instanceof Error ? statsError.message : 'Unknown',
        })
        throw new Error(
          `Failed to calculate statistics: ${statsError instanceof Error ? statsError.message : 'Unknown error'}`
        )
      }

      await this.delay(1000)

      onUpdate({
        type: 'progress',
        step: 'analyzing',
        message: '🤖 Running AI price analysis...',
        progress: 65,
      })

      const productSummary = products.map((p, i) => ({
        name: p.name,
        price: p.price,
        numericPrice: prices[i] ?? 0,
        rating: p.rating || undefined,
        location: p.shop_location || undefined,
        source: p.source,
      }))

      const prompt = buildAnalysisPrompt(query, productSummary, stats, userPrice)

      await this.delay(2000)

      onUpdate({
        type: 'progress',
        step: 'insights',
        message: '💡 Generating market insights...',
        progress: 80,
      })

      let aiResponse: Awaited<ReturnType<typeof generateChatCompletion>>
      try {
        aiResponse = await generateChatCompletion(
          [
            {
              role: 'system',
              content:
                'You are a pricing analyst expert specializing in Indonesian e-commerce markets. Provide clear, actionable insights.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          {
            temperature: 0.7,
            maxTokens: 1000,
          }
        )
      } catch (aiError) {
        logger.error({
          msg: 'Error generating AI response',
          error: aiError instanceof Error ? aiError.message : 'Unknown',
        })
        const analysis = getFallbackAnalysis(stats)

        onUpdate({
          type: 'complete',
          progress: 100,
          data: {
            query,
            products,
            statistics: {
              ...stats,
              totalProducts: products.length,
            },
            analysis,
          },
        })
        return
      }

      await this.delay(1000)

      onUpdate({
        type: 'progress',
        step: 'finalizing',
        message: '✨ Finalizing recommendations...',
        progress: 95,
      })

      let analysis: PriceAnalysisResult['analysis'] = {} as any
      try {
        analysis = parseAIResponse(aiResponse.text, stats)
      } catch (parseError) {
        logger.error({
          msg: 'Error parsing AI response',
          error: parseError instanceof Error ? parseError.message : 'Unknown',
        })
        analysis = getFallbackAnalysis(stats)
      }

      await this.delay(500)

      onUpdate({
        type: 'complete',
        progress: 100,
        data: {
          query,
          optimizedQuery,
          products,
          statistics: {
            ...stats,
            totalProducts: products.length,
          },
          analysis,
        },
      })
    } catch (error) {
      onUpdate({
        type: 'error',
        message: error instanceof Error ? error.message : 'Analysis failed',
      })
    }
  },

  /**
   * Add delay for realistic streaming experience
   */
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  /**
   * Analyze prices for a product query
   * @param query - Product search query
   * @param limit - Number of products to analyze
   * @param userPrice - Optional: User's intended selling price for comparison
   */
  async analyzePrices(
    query: string,
    limit: number = 10,
    userPrice?: number
  ): Promise<PriceAnalysisResult> {
    const optimizedQuery = await this.optimizeSearchQuery(query)
    logger.debug({ msg: '🔍 Using optimized query', query, optimizedQuery })

    const products = await priceAnalysisRepository.fetchAllPrices(optimizedQuery, limit)

    if (products.length === 0) {
      throw new Error('No products found for the given query')
    }

    const prices = products.map(p => priceAnalysisRepository.parsePrice(p.price))
    const stats = priceAnalysisRepository.calculateStats(prices)

    const productSummary = products.map((p, i) => ({
      name: p.name,
      price: p.price,
      numericPrice: prices[i] ?? 0,
      rating: p.rating || undefined,
      location: p.shop_location || undefined,
      source: p.source,
    }))

    // Generate AI analysis using chat completion (compatible with NVIDIA API)
    const prompt = buildAnalysisPrompt(query, productSummary, stats, userPrice)
    const aiResponse = await generateChatCompletion(
      [
        {
          role: 'system',
          content:
            'You are a pricing analyst expert specializing in Indonesian e-commerce markets. Provide clear, actionable insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        temperature: 0.7,
        maxTokens: 1000,
      }
    )

    const analysis = parseAIResponse(aiResponse.text, stats)

    return {
      query,
      optimizedQuery,
      products,
      statistics: {
        ...stats,
        totalProducts: products.length,
      },
      analysis,
    }
  },
}
