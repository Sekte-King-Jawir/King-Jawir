/**
 * AI Helper Functions for Price Analysis
 * 
 * @description Provides utilities for building AI prompts, parsing responses,
 * and generating fallback analysis when AI services are unavailable.
 * 
 * @module price-analysis/price_analysis_ai_helper
 * 
 * @example
 * // Build analysis prompt
 * const prompt = buildAnalysisPrompt('laptop gaming', products, stats, userPrice)
 * 
 * @example
 * // Parse AI response
 * const analysis = parseAIResponse(aiText, stats)
 * 
 * @example
 * // Fallback when AI fails
 * const fallback = getFallbackAnalysis(stats)
 */

/**
 * Builds comprehensive LLM prompt for price analysis
 * 
 * @param {string} query - Product search query
 * @param {Array<Object>} products - Array of product data with prices and ratings
 * @param {Object} stats - Statistical summary (min, max, average, median)
 * @param {number} [userPrice] - Optional user's intended price for comparison
 * @returns {string} Formatted prompt text for LLM
 * 
 * @example
 * const prompt = buildAnalysisPrompt(
 *   'laptop gaming',
 *   [{ name: 'ASUS ROG', price: 'Rp15.000.000', numericPrice: 15000000, rating: '4.8' }],
 *   { min: 10000000, max: 20000000, average: 15000000, median: 14500000 },
 *   12000000
 * )
 */
export function buildAnalysisPrompt(
  query: string,
  products: Array<{
    name: string
    price: string
    numericPrice: number
    rating?: string | undefined
    location?: string | undefined
  }>,
  stats: {
    min: number
    max: number
    average: number
    median: number
  },
  userPrice?: number
): string {
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
}

/**
 * Parses AI response text into structured analysis object
 * 
 * @description Extracts recommendation, insights, and suggested price from AI text output.
 * Handles various response formats and provides fallback values if parsing fails.
 * 
 * @param {string} aiText - Raw text response from AI model
 * @param {Object} stats - Statistical data for fallback calculations
 * @returns {Object} Structured analysis with recommendation, insights, and suggestedPrice
 * 
 * @example
 * const analysis = parseAIResponse(
 *   'RECOMMENDATION: Price competitively\nINSIGHTS:\n- Market is saturated',
 *   { min: 100000, max: 500000, average: 300000, median: 280000 }
 * )
 * // Returns: { recommendation: '...', insights: ['...'], suggestedPrice: 280000 }
 */
export function parseAIResponse(
  aiText: string,
  stats: {
    min: number
    max: number
    average: number
    median: number
  }
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
    } else if (currentSection === 'insights' && trimmed && !trimmed.startsWith('SUGGESTED_PRICE')) {
      insights.push(trimmed)
    }
  }

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
}

/**
 * Generates fallback analysis when AI service is unavailable
 * 
 * @description Provides statistical-based analysis using market data without AI.
 * Used as emergency fallback to ensure service availability.
 * 
 * @param {Object} stats - Market statistics (min, max, average, median)
 * @returns {Object} Fallback analysis with recommendation, insights, and suggestedPrice
 * 
 * @example
 * const fallback = getFallbackAnalysis({
 *   min: 1000000,
 *   max: 5000000,
 *   average: 3000000,
 *   median: 2800000
 * })
 * // Returns analysis based purely on statistics
 */
export function getFallbackAnalysis(stats: {
  min: number
  max: number
  average: number
  median: number
}): {
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
}

/**
 * Builds prompt for AI-powered search query optimization
 * 
 * @description Creates instructions for AI to optimize marketplace search queries.
 * Adds relevant keywords while preserving user intent for accessory searches.
 * 
 * @param {string} query - Original user search query
 * @returns {string} Formatted prompt for query optimization
 * 
 * @example
 * const prompt = buildQueryOptimizationPrompt('iphone')
 * // AI will return: 'iphone smartphone'
 * 
 * @example
 * const prompt = buildQueryOptimizationPrompt('case iphone')
 * // AI will return: 'case iphone' (unchanged, user wants case)
 */
export function buildQueryOptimizationPrompt(query: string): string {
  return `Kamu adalah search query optimizer untuk marketplace Indonesia (Tokopedia).

Query user: "${query}"

Tugas:
1. Jika query hanya menyebutkan merek/model TANPA menyebut aksesori, tambahkan kata kunci spesifik produk utama
2. Jika query SUDAH menyebutkan aksesori/produk spesifik (case, charger, dll), JANGAN ubah
3. Gunakan bahasa Indonesia untuk marketplace lokal
4. Buat query lebih spesifik dan menghindari hasil yang tidak relevan

Contoh:
- "iphone" → "iphone smartphone" (tambahkan kata kunci produk utama)
- "samsung" → "samsung hp" (tambahkan kata kunci)
- "laptop asus" → "laptop asus" (sudah spesifik)
- "case iphone" → "case iphone" (JANGAN ubah, user memang cari case)
- "charger samsung" → "charger samsung" (JANGAN ubah, user memang cari charger)
- "macbook" → "macbook laptop" (tambahkan kata kunci)
- "iphone 15" → "iphone 15 smartphone" (tambahkan kata kunci)
- "sepatu nike" → "sepatu nike" (sudah spesifik)
- "tempered glass iphone" → "tempered glass iphone" (JANGAN ubah)

Outputkan HANYA query yang sudah dioptimasi, tanpa penjelasan tambahan.`
}
