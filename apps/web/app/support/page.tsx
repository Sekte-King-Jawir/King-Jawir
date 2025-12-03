'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Moon, Sun, Search, TrendingUp, ShoppingBag, BarChart3 } from 'lucide-react'
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
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0)

  const analysisSteps = [
    '🔍 Scanning Tokopedia marketplace...',
    '📊 Gathering product data...',
    '🤖 Running AI price analysis...',
    '📈 Calculating market statistics...',
    '💡 Generating insights...',
    '🎯 Preparing recommendations...',
    '✨ Finalizing results...'
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(savedTheme === 'dark' || (savedTheme === null && systemTheme))
  }, [])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let stepInterval: NodeJS.Timeout

    if (loading) {
      setLoadingProgress(0)
      setCurrentAnalysisStep(0)
      
      // Progress simulation
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) return prev
          return prev + Math.random() * 3
        })
      }, 800)

      // Step rotation
      stepInterval = setInterval(() => {
        setCurrentAnalysisStep(prev => (prev + 1) % analysisSteps.length)
      }, 3000)
    } else {
      setLoadingProgress(0)
      setCurrentAnalysisStep(0)
    }

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [loading, analysisSteps.length])

  const toggleTheme = (): void => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const formatRupiah = (num: number): string => {
    return `Rp${num.toLocaleString('id-ID')}`
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4101'
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
      })

      if (typeof userPrice === 'number' && userPrice > 0) {
        params.append('userPrice', userPrice.toString())
      }

      const response = await fetch(`${apiUrl}/api/price-analysis?${params.toString()}`)
      const data: ApiResponse = (await response.json()) as ApiResponse

      if (data.success === true && data.data !== null && data.data !== undefined) {
        setLoadingProgress(100)
        const resultData = data.data
        setTimeout(() => {
          setResult(resultData)
        }, 500)
      } else {
        setError(data.error?.code ?? 'Failed to analyze prices')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.logo}>
            <BarChart3 className={styles.logoIcon} />
            <span>PriceScope AI</span>
          </div>
          <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className={styles.headerContent}>
          <h1>Intelligent Price Analysis</h1>
          <p>Discover market insights with AI-powered Tokopedia price analysis</p>
        </div>
      </header>

      <main className={styles.main}>
        <form
          onSubmit={e => {
            void handleSubmit(e)
          }}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label htmlFor="query">
              <Search size={16} />
              Product Query
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="query"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for products, e.g., iPhone 15 Pro"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="limit">
                <TrendingUp size={16} />
                Products Limit
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="limit"
                  type="number"
                  value={limit}
                  onChange={e => setLimit(parseInt(e.target.value))}
                  min="1"
                  max="50"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="userPrice">
                <ShoppingBag size={16} />
                Your Budget (Optional)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="userPrice"
                  type="number"
                  value={userPrice ?? ''}
                  onChange={e =>
                    setUserPrice(e.target.value.length > 0 ? parseInt(e.target.value) : undefined)
                  }
                  placeholder="Enter your budget in Rupiah"
                  min="0"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? (
              <>
                <div className={styles.spinner} />
                Processing...
              </>
            ) : (
              <>
                <Search size={20} />
                Analyze Market Prices
              </>
            )}
          </button>
        </form>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingHeader}>
                <div className={styles.loadingIcon}>
                  <div className={styles.pulseRing} />
                  <div className={styles.pulseRing} />
                  <div className={styles.pulseRing} />
                  <BarChart3 size={32} className={styles.chartIcon} />
                </div>
                <h3>Analyzing Market Data</h3>
                <p>This may take up to 30 seconds...</p>
              </div>
              
              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className={styles.progressText}>
                  {Math.round(loadingProgress)}% Complete
                </div>
              </div>

              <div className={styles.analysisSteps}>
                <div className={styles.currentStep}>
                  {analysisSteps[currentAnalysisStep]}
                </div>
                <div className={styles.stepIndicators}>
                  {analysisSteps.map((step, index) => (
                    <div
                      key={step}
                      className={`${styles.stepDot} ${
                        index <= currentAnalysisStep ? styles.stepDotActive : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.loadingTips}>
                <div className={styles.tipIcon}>💡</div>
                <div className={styles.tipText}>
                  <strong>Did you know?</strong> Our AI analyzes pricing patterns, 
                  market trends, and competitor data to give you the most accurate 
                  price recommendations.
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {error !== null && error.length > 0 ? (
          <div className={styles.error}>
            <strong>❌ Error:</strong> {error}
          </div>
        ) : null}

        {result !== null ? (
          <div className={styles.results}>
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
                  <span className={styles.statValue}>{formatRupiah(result.statistics.median)}</span>
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

                {typeof result.analysis.suggestedPrice === 'number' &&
                result.analysis.suggestedPrice > 0 ? (
                  <div className={styles.suggestedPrice}>
                    <h3>Suggested Price:</h3>
                    <p className={styles.priceHighlight}>
                      {formatRupiah(result.analysis.suggestedPrice)}
                    </p>
                  </div>
                ) : null}

                <div className={styles.insights}>
                  <h3>Key Insights:</h3>
                  <ul>
                    {result.analysis.insights.map(insight => (
                      <li key={insight.slice(0, 50)}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2>🛍️ Product List</h2>
              <div className={styles.products}>
                {result.products.map(product => (
                  <div key={product.product_url} className={styles.productCard}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={280}
                      height={200}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h4 className={styles.productName}>{product.name}</h4>
                      <p className={styles.productPrice}>{product.price}</p>
                      {product.rating !== null &&
                      product.rating !== undefined &&
                      product.rating.length > 0 ? (
                        <p className={styles.productRating}>⭐ {product.rating}</p>
                      ) : null}
                      {product.shop_location !== null &&
                      product.shop_location !== undefined &&
                      product.shop_location.length > 0 ? (
                        <p className={styles.productLocation}>📍 {product.shop_location}</p>
                      ) : null}
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
          </div>
        ) : null}
      </main>

      <footer className={styles.footer}>
        <p>🔧 Support Page | Powered by Tokopedia Scraper + AI Analysis</p>
      </footer>
    </div>
  )
}
