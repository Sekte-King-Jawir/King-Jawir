'use client'

import { useState } from 'react'
import { Megaphone, Sparkles, Copy } from 'lucide-react'
import {
  ThemeToggle,
  ProductDescriptionForm,
  ProductDescriptionResult,
  MarketingForm,
  MarketingResult,
} from '@repo/ui'
import { useProductDescription, useMarketing } from '@/hooks'
import type { ProductDescriptionRequest } from '@/types/product-description'
import type { MarketingContentRequest } from '@/types/marketing'

export default function ProductDescriptionPage(): React.JSX.Element {
  const { result, loading, error, generate, reset } = useProductDescription()
  const {
    result: marketingResult,
    loading: marketingLoading,
    error: marketingError,
    generate: generateMarketing,
    reset: resetMarketing,
  } = useMarketing()
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleGenerate = async (productInput: string): Promise<void> => {
    const request: ProductDescriptionRequest = { productInput }
    await generate(request)
  }

  const handleCopy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleRegenerate = (): void => {
    reset()
  }

  const handleGenerateMarketing = async (platform: string): Promise<void> => {
    if (result === null || result === undefined) return

    const request: MarketingContentRequest = {
      productDescription: result,
      platform: platform as MarketingContentRequest['platform'],
    }
    await generateMarketing(request)
  }

  const handleCopyMarketing = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleRegenerateMarketing = (): void => {
    resetMarketing()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Add floating elements for consistency with homepage */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={`floating-${i}`}
            className="absolute rounded-full bg-blue-500/5"
            style={{
              width: `${((i * 8 + 20) % 80) + 20}px`,
              height: `${((i * 6 + 20) % 80) + 20}px`,
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
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            AI Product & Marketing Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hasilkan deskripsi produk yang menarik dan konten pemasaran yang optimal untuk
            marketplace Indonesia dengan bantuan kecerdasan buatan. Cocok untuk Tokopedia, Shopee,
            Instagram, Facebook, dan platform lainnya.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Form Section */}
          <ProductDescriptionForm
            onSubmit={input => {
              void handleGenerate(input)
            }}
            loading={loading}
          />

          {/* Error Display */}
          {error !== null && error !== '' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-8 mb-8 shadow-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                    Menghasilkan Deskripsi Produk
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    AI sedang menganalisis dan membuat deskripsi yang optimal...
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Results Section */}
          {result !== null && result !== undefined && !loading && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/20 mb-4">
                  <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Deskripsi Produk Berhasil Dibuat!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Deskripsi ini dioptimalkan untuk marketplace Indonesia dengan fokus pada manfaat
                  dan SEO.
                </p>
              </div>

              <ProductDescriptionResult
                data={result}
                onCopy={text => {
                  void handleCopy(text)
                }}
                onRegenerate={handleRegenerate}
              />

              {/* Marketing Section */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/20 mb-4">
                    <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Generate Konten Pemasaran
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Gunakan deskripsi produk ini untuk membuat konten pemasaran yang menarik di
                    berbagai platform.
                  </p>
                </div>

                <MarketingForm
                  productDescription={result}
                  onSubmit={platform => {
                    void handleGenerateMarketing(platform)
                  }}
                  loading={marketingLoading}
                />

                {/* Marketing Error */}
                {marketingError !== null && marketingError !== '' && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          {marketingError}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Marketing Loading */}
                {marketingLoading ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4" />
                      <div>
                        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                          Menghasilkan Konten Pemasaran
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          AI sedang menganalisis dan membuat konten yang optimal...
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Marketing Results */}
                {marketingResult !== null && marketingResult !== undefined && !marketingLoading && (
                  <div className="mt-6">
                    <MarketingResult
                      data={marketingResult}
                      onCopy={text => {
                        void handleCopyMarketing(text)
                      }}
                      onRegenerate={handleRegenerateMarketing}
                    />
                  </div>
                )}
              </div>

              {/* Copy Success Message */}
              {copiedText !== null && copiedText !== '' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <Copy className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      Teks berhasil disalin ke clipboard!
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          {(result === null || result === undefined) &&
            !loading &&
            (error === null || error === '') && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                  <Sparkles className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Belum Ada Deskripsi
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Masukkan detail produk di atas untuk mulai menghasilkan deskripsi dengan AI.
                </p>
              </div>
            )}

        </div>

        {/* Footer */}
        <footer className="mt-4s text-center relative z-10">
          <p className="text-sm text-muted-foreground">
            Powered by AI • Optimized for Indonesian Marketplaces
          </p>
        </footer>
      </main>
    </div>
  )
}
