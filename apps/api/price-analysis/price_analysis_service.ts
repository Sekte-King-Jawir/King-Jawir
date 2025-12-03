import { priceAnalysisRepository, type TokopediaProduct } from './price_analysis_repository'
import { generateChatCompletion } from '../lib/ai'

interface PriceAnalysisResult {
  query: string
  products: TokopediaProduct[]
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
      // Step 1: Initialize
      onUpdate({
        type: 'progress',
        step: 'initializing',
        message: '🔍 Initializing price analysis...',
        progress: 5,
      })

      await this.delay(1000)

      // Step 2: Fetch products
      onUpdate({
        type: 'progress',
        step: 'fetching',
        message: '📊 Scanning Tokopedia marketplace...',
        progress: 15,
      })

      let products: any[] = []
      try {
        products = await priceAnalysisRepository.fetchTokopediaPrices(query, limit)
      } catch (fetchError) {
        console.error('Error fetching products:', fetchError)
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

      // Step 3: Calculate statistics
      onUpdate({
        type: 'progress',
        step: 'calculating',
        message: '📈 Calculating market statistics...',
        progress: 50,
      })

      let prices: number[] = []
      let stats: any = {}
      try {
        prices = products.map(p => priceAnalysisRepository.parsePrice(p.price))
        stats = priceAnalysisRepository.calculateStats(prices)
      } catch (statsError) {
        console.error('Error calculating statistics:', statsError)
        throw new Error(
          `Failed to calculate statistics: ${statsError instanceof Error ? statsError.message : 'Unknown error'}`
        )
      }

      await this.delay(1000)

      // Step 4: Prepare AI analysis
      onUpdate({
        type: 'progress',
        step: 'analyzing',
        message: '🤖 Running AI price analysis...',
        progress: 65,
      })

      const productSummary = products.map((p, i) => ({
        name: p.name,
        price: p.price,
        numericPrice: prices[i],
        rating: p.rating,
        location: p.shop_location,
      }))

      const prompt = this.buildAnalysisPrompt(query, productSummary, stats, userPrice)

      await this.delay(2000)

      // Step 5: Generate insights
      onUpdate({
        type: 'progress',
        step: 'insights',
        message: '💡 Generating market insights...',
        progress: 80,
      })

      let aiResponse: any
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
        console.error('Error generating AI response:', aiError)
        // Fallback analysis without AI
        const analysis = this.getFallbackAnalysis(stats)

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

      // Step 6: Finalize
      onUpdate({
        type: 'progress',
        step: 'finalizing',
        message: '✨ Finalizing recommendations...',
        progress: 95,
      })

      let analysis: any
      try {
        analysis = this.parseAIResponse(aiResponse.text, stats)
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
        analysis = this.getFallbackAnalysis(stats)
      }

      await this.delay(500)

      // Step 7: Complete
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
    // Fetch product data from Tokopedia
    const products = await priceAnalysisRepository.fetchTokopediaPrices(query, limit)

    if (products.length === 0) {
      throw new Error('No products found for the given query')
    }

    // Parse and calculate statistics
    const prices = products.map(p => priceAnalysisRepository.parsePrice(p.price))
    const stats = priceAnalysisRepository.calculateStats(prices)

    // Prepare data for LLM analysis
    const productSummary = products.map((p, i) => ({
      name: p.name,
      price: p.price,
      numericPrice: prices[i],
      rating: p.rating,
      location: p.shop_location,
    }))

    // Generate AI analysis using chat completion (compatible with NVIDIA API)
    const prompt = this.buildAnalysisPrompt(query, productSummary, stats, userPrice)
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

    // Parse AI response
    const analysis = this.parseAIResponse(aiResponse.text, stats)

    return {
      query,
      products,
      statistics: {
        ...stats,
        totalProducts: products.length,
      },
      analysis,
    }
  },

  /**
   * Build prompt for LLM analysis
   */
  buildAnalysisPrompt(query: string, products: any[], stats: any, userPrice?: number): string {
    const formatRupiah = (num: number) => `Rp${num.toLocaleString('id-ID')}`

    let prompt = `Analyze the following price data for "${query}" from Tokopedia marketplace:\n\n`

    prompt += `MARKET STATISTICS:\n`
    prompt += `- Minimum Price: ${formatRupiah(stats.min)}\n`
    prompt += `- Maximum Price: ${formatRupiah(stats.max)}\n`
    prompt += `- Average Price: ${formatRupiah(stats.average)}\n`
    prompt += `- Median Price: ${formatRupiah(stats.median)}\n`
    prompt += `- Total Products Analyzed: ${products.length}\n\n`

    prompt += `TOP PRODUCTS:\n`
    products.slice(0, 5).forEach((p, i) => {
      prompt += `${i + 1}. ${p.name}\n`
      prompt += `   Price: ${p.price} (${formatRupiah(p.numericPrice)})\n`
      if (p.rating) prompt += `   Rating: ${p.rating}\n`
      if (p.location) prompt += `   Location: ${p.location}\n`
      prompt += `\n`
    })

    if (userPrice) {
      prompt += `USER'S INTENDED PRICE: ${formatRupiah(userPrice)}\n\n`
      prompt += `Compare this price against the market data and provide specific feedback on whether it's competitive.\n\n`
    }

    prompt += `Please provide:\n`
    prompt += `1. RECOMMENDATION: A concise pricing recommendation (1-2 sentences)\n`
    prompt += `2. INSIGHTS: 3-5 key insights about this market segment\n`
    prompt += `3. SUGGESTED_PRICE: A single optimal price point in Indonesian Rupiah (just the number)\n\n`

    prompt += `Format your response as:\n`
    prompt += `RECOMMENDATION: [your recommendation]\n`
    prompt += `INSIGHTS:\n- [insight 1]\n- [insight 2]\n- [insight 3]\n`
    prompt += `SUGGESTED_PRICE: [numeric value only]\n`

    return prompt
  },

  /**
   * Parse AI response into structured format
   */
  parseAIResponse(
    aiText: string,
    stats: any
  ): {
    recommendation: string
    insights: string[]
    suggestedPrice?: number
  } {
    const lines = aiText.split('\n').filter(line => line.trim())

    let recommendation = ''
    const insights: string[] = []
    let suggestedPrice: number | undefined

    let currentSection = ''

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith('RECOMMENDATION:')) {
        currentSection = 'recommendation'
        recommendation = trimmed.replace('RECOMMENDATION:', '').trim()
      } else if (trimmed.startsWith('INSIGHTS:')) {
        currentSection = 'insights'
      } else if (trimmed.startsWith('SUGGESTED_PRICE:')) {
        const priceMatch = trimmed.match(/[\d.,]+/)
        if (priceMatch) {
          suggestedPrice = parseInt(priceMatch[0].replace(/[.,]/g, ''), 10)
        }
      } else if (currentSection === 'recommendation' && recommendation === '') {
        recommendation = trimmed
      } else if (currentSection === 'insights' && trimmed.startsWith('-')) {
        insights.push(trimmed.replace(/^-\s*/, ''))
      } else if (
        currentSection === 'insights' &&
        trimmed &&
        !trimmed.startsWith('SUGGESTED_PRICE')
      ) {
        insights.push(trimmed)
      }
    }

    // Fallbacks
    if (!recommendation) {
      recommendation = `Based on market data, prices range from Rp${stats.min.toLocaleString('id-ID')} to Rp${stats.max.toLocaleString('id-ID')}. The median price of Rp${stats.median.toLocaleString('id-ID')} represents a competitive market position.`
    }

    if (insights.length === 0) {
      insights.push(`Market average is Rp${stats.average.toLocaleString('id-ID')}`)
      insights.push(
        `Price range shows ${(((stats.max - stats.min) / stats.average) * 100).toFixed(1)}% variability`
      )
      insights.push('Consider product condition, brand, and seller reputation when pricing')
    }

    if (!suggestedPrice || isNaN(suggestedPrice)) {
      suggestedPrice = stats.median
    }

    return {
      recommendation,
      insights,
      ...(suggestedPrice ? { suggestedPrice } : {}),
    }
  },

  /**
   * Provide fallback analysis when AI fails
   */
  getFallbackAnalysis(stats: any): {
    recommendation: string
    insights: string[]
    suggestedPrice?: number
  } {
    const formatRupiah = (num: number) => `Rp${num.toLocaleString('id-ID')}`

    const recommendation = `Based on market analysis of available products, prices range from ${formatRupiah(stats.min)} to ${formatRupiah(stats.max)}. The median price of ${formatRupiah(stats.median)} represents a competitive market position for your product.`

    const insights = [
      `Market average price is ${formatRupiah(stats.average)}`,
      `Price volatility: ${(((stats.max - stats.min) / stats.average) * 100).toFixed(1)}% range`,
      'Consider product condition, brand reputation, and seller location when setting your price',
      'Monitor competitor pricing regularly for optimal market positioning',
    ]

    return {
      recommendation,
      insights,
      suggestedPrice: stats.median,
    }
  },
}
