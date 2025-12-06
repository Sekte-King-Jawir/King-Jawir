'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, ShoppingBag, BarChart3 } from 'lucide-react'
import { ThemeToggle } from '@repo/ui'
import { usePriceAnalysis } from '@/hooks'
import { formatPrice } from '@/lib/utils'
import type { PriceAnalysisRequest } from '@/lib/api'

const analysisSteps = [
  '🔍 Initializing price analysis...',
  '📊 Scanning Tokopedia and Blibli marketplaces...',
  '📈 Calculating market statistics...',
  '🤖 Running AI price analysis...',
  '💡 Generating market insights...',
  '✨ Finalizing recommendations...',
]

export default function SupportPage(): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [userPrice, setUserPrice] = useState<number | undefined>(undefined)

  const { result, loading, error, streamProgress, streamMessage, analyzeWithStream } =
    usePriceAnalysis()

  const limit = 60
  const currentAnalysisStep = Math.floor((streamProgress / 100) * (analysisSteps.length - 1))

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const params: PriceAnalysisRequest = {
      query,
      limit,
    }
    if (typeof userPrice === 'number' && userPrice > 0) {
      params.userPrice = userPrice
    }
    analyzeWithStream(params)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Add floating elements for consistency with homepage */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/5"
            style={{
              width: `${(i * 8 + 20) % 80 + 20}px`,
              height: `${(i * 6 + 20) % 80 + 20}px`,
              top: `${(i * 10) % 100}%`,
              left: `${(i * 15) % 100}%`,
            }}
          />
        ))}
      </div>
      <ThemeToggle />

      <main className="w-full max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 mb-6">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            PriceScope AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover market insights with AI-powered price analysis across multiple marketplaces
          </p>
        </div>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="query"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <Search size={16} className="text-blue-500 dark:text-blue-400" />
                Product Query
              </label>
              <input
                id="query"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for products, e.g., iPhone 15 Pro"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="userPrice"
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                <ShoppingBag size={16} className="text-blue-500 dark:text-blue-400" />
                Your Budget (Optional)
              </label>
              <input
                id="userPrice"
                type="number"
                value={userPrice ?? ''}
                onChange={e =>
                  setUserPrice(e.target.value.length > 0 ? parseInt(e.target.value) : undefined)
                }
                placeholder="Enter your budget in Rupiah"
                min="0"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 px-6 gap-2 shadow-lg shadow-blue-600/30"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Analyze Market Prices
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-8 mb-8 shadow-lg">
            <div className="text-center space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                <div className="absolute inset-2 rounded-full animate-ping bg-primary/40 animation-delay-200" />
                <div className="relative">
                  <BarChart3 size={48} className="text-primary" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Analyzing Market Data
                </h3>
                <p className="text-muted-foreground">This may take up to 30 seconds...</p>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${streamProgress}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-foreground">
                  {Math.round(streamProgress)}% Complete
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-lg text-foreground">
                  {streamMessage.length > 0 ? streamMessage : analysisSteps[currentAnalysisStep]}
                </div>
                <div className="flex justify-center gap-2">
                  {analysisSteps.map((step, index) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index <= currentAnalysisStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="text-sm text-left">
                    <strong className="text-foreground">Did you know?</strong>
                    <span className="text-muted-foreground ml-1">
                      Our AI analyzes pricing patterns, market trends, and competitor data to give
                      you the most accurate price recommendations.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Error State */}
        {error !== null && error.length > 0 ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-4 mb-8">
            <strong>❌ Error:</strong> {error}
          </div>
        ) : null}

        {/* Results */}
        {result !== null ? (
          <div className="space-y-8">
            {/* Query Info */}
            {result.optimizedQuery !== null &&
            result.optimizedQuery !== undefined &&
            result.optimizedQuery !== '' &&
            result.optimizedQuery !== result.query ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">🔍 Optimized Query:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">{result.optimizedQuery}</span>
                  <span className="text-muted-foreground ml-2">(from: {result.query})</span>
                </p>
              </div>
            ) : null}

            {/* Statistics */}
            <section className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                📊 Market Statistics
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Minimum</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(result.statistics.min)}
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Average</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(result.statistics.average)}
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Median</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(result.statistics.median)}
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Maximum</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(result.statistics.max)}
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Analyzed {result.statistics.totalProducts} products
                {(() => {
                  const tokopediaCount = result.products.filter(
                    p => p.source === 'tokopedia'
                  ).length
                  const blibliCount = result.products.filter(p => p.source === 'blibli').length
                  return tokopediaCount > 0 && blibliCount > 0
                    ? ` (${tokopediaCount} from Tokopedia, ${blibliCount} from Blibli)`
                    : tokopediaCount > 0
                      ? ' from Tokopedia'
                      : blibliCount > 0
                        ? ' from Blibli'
                        : ''
                })()}
              </p>
            </section>

            {/* AI Analysis */}
            <section className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                🤖 AI Analysis
              </h2>
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Recommendation:</h3>
                  <p className="text-foreground leading-relaxed">
                    {result.analysis.recommendation}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Price Range:</h3>
                  <p className="text-foreground leading-relaxed">
                    Median: {formatPrice(result.statistics.median)}
                    {result.statistics.q1 !== null &&
                    result.statistics.q1 !== undefined &&
                    result.statistics.q3 !== null &&
                    result.statistics.q3 !== undefined ? (
                      <span>
                        {' | Q1-Q3: '}
                        {formatPrice(result.statistics.q1)} - {formatPrice(result.statistics.q3)}
                      </span>
                    ) : null}
                  </p>
                  {result.analysis.suggestedPrice !== null &&
                  result.analysis.suggestedPrice !== undefined ? (
                    <p className="text-foreground leading-relaxed mt-2">
                      <strong>💡 Suggested Price:</strong>{' '}
                      {formatPrice(result.analysis.suggestedPrice)}
                    </p>
                  ) : null}
                </div>

                <div className="bg-white dark:bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Key Insights:</h3>
                  <ul className="space-y-2">
                    {result.analysis.insights.map(insight => (
                      <li
                        key={insight.slice(0, 50)}
                        className="flex items-start gap-2 text-foreground"
                      >
                        <span className="text-blue-500 dark:text-blue-400 mt-1 text-sm">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Products */}
            <section className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                🛍️ Product List
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.products.map((product, idx) => {
                  const productUrl = product.product_url ?? ''
                  const imageUrl = product.image_url ?? '/placeholder.png'
                  const location = product.shop_location ?? ''

                  return (
                    <div
                      key={productUrl !== '' ? productUrl : `product-${idx}`}
                      className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
                    >
                      {imageUrl !== '' ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                      ) : null}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-foreground line-clamp-2 leading-tight flex-1">
                            {product.name}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              product.source === 'tokopedia'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {product.source === 'tokopedia' ? 'Tokopedia' : 'Blibli'}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-primary">{product.price}</p>
                        {product.rating !== null &&
                        product.rating !== undefined &&
                        product.rating !== '' ? (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            ⭐ {product.rating}
                          </p>
                        ) : null}
                        {location !== '' ? (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            📍 {location}
                          </p>
                        ) : null}
                        {product.sold !== null &&
                        product.sold !== undefined &&
                        product.sold !== '' ? (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            🛒 {product.sold} sold
                          </p>
                        ) : null}
                        {productUrl !== '' ? (
                          <a
                            href={productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            View on {product.source === 'tokopedia' ? 'Tokopedia' : 'Blibli'} →
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center relative z-10">
        <p className="text-sm text-muted-foreground">
          Powered by Multi-Source Scrapers + AI Analysis
        </p>
      </footer>
    </div>
  )
}
