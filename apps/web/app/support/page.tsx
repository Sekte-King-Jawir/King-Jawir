'use client'

import { useState } from 'react'
import styles from './support.module.css'

interface TokopediaProduct {
  name: string
  price: string
  rating?: string
  image_url: string
  product_url: string
  shop_location?: string
}

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

interface ApiResponse {
  success: boolean
  message: string
  data?: PriceAnalysisResult
  error?: {
    code: string
    details?: Record<string, string> | null
  }
}

export default function SupportPage(): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(10)
  const [userPrice, setUserPrice] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PriceAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formatRupiah = (num: number): string => {
    return `Rp${num.toLocaleString('id-ID')}`
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
      })

      if (userPrice && userPrice > 0) {
        params.append('userPrice', userPrice.toString())
      }

      const response = await fetch(`${apiUrl}/api/price-analysis?${params.toString()}`)
      const data: ApiResponse = await response.json()

      if (data.success && data.data) {
        setResult(data.data)
      } else {
        setError(data.error?.code || 'Failed to analyze prices')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🤖 AI Price Analysis Tool</h1>
        <p>Test Tokopedia price scraping and AI analysis</p>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="query">Product Query:</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., iPhone 15 Pro"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="limit">Limit:</label>
              <input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                min="1"
                max="50"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="userPrice">Your Price (Optional):</label>
              <input
                id="userPrice"
                type="number"
                value={userPrice || ''}
                onChange={(e) =>
                  setUserPrice(e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder="e.g., 15000000"
                min="0"
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Prices'}
          </button>
        </form>

        {error ? <div className={styles.error}>
            <strong>❌ Error:</strong> {error}
          </div> : null}

        {result ? <div className={styles.results}>
            <section className={styles.section}>
              <h2>📊 Market Statistics</h2>
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Minimum</span>
                  <span className={styles.statValue}>{formatRupiah(result.statistics.min)}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Average</span>
                  <span className={styles.statValue}>
                    {formatRupiah(result.statistics.average)}
                  </span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Median</span>
                  <span className={styles.statValue}>
                    {formatRupiah(result.statistics.median)}
                  </span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Maximum</span>
                  <span className={styles.statValue}>{formatRupiah(result.statistics.max)}</span>
                </div>
              </div>
              <p className={styles.productCount}>
                Analyzed {result.statistics.totalProducts} products
              </p>
            </section>

            <section className={styles.section}>
              <h2>🤖 AI Analysis</h2>
              <div className={styles.analysis}>
                <div className={styles.recommendation}>
                  <h3>Recommendation:</h3>
                  <p>{result.analysis.recommendation}</p>
                </div>

                {result.analysis.suggestedPrice ? <div className={styles.suggestedPrice}>
                    <h3>Suggested Price:</h3>
                    <p className={styles.priceHighlight}>
                      {formatRupiah(result.analysis.suggestedPrice)}
                    </p>
                  </div> : null}

                <div className={styles.insights}>
                  <h3>Key Insights:</h3>
                  <ul>
                    {result.analysis.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2>🛍️ Product List</h2>
              <div className={styles.products}>
                {result.products.map((product, idx) => (
                  <div key={idx} className={styles.productCard}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h4 className={styles.productName}>{product.name}</h4>
                      <p className={styles.productPrice}>{product.price}</p>
                      {product.rating ? <p className={styles.productRating}>⭐ {product.rating}</p> : null}
                      {product.shop_location ? <p className={styles.productLocation}>📍 {product.shop_location}</p> : null}
                      <a
                        href={product.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.productLink}
                      >
                        View on Tokopedia →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div> : null}
      </main>

      <footer className={styles.footer}>
        <p>
          🔧 Support Page | Powered by Tokopedia Scraper + AI Analysis
        </p>
      </footer>
    </div>
  )
}
