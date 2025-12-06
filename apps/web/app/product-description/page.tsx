'use client'

import { useState } from 'react'
import { FileText, Sparkles, Copy } from 'lucide-react'
import { ThemeToggle, ProductDescriptionForm, ProductDescriptionResult } from '@repo/ui'
import { useProductDescription } from '@/hooks'
import type { ProductDescriptionRequest } from '@/types/product-description'

export default function ProductDescriptionPage(): React.JSX.Element {
  const { result, loading, error, generate, reset } = useProductDescription()
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleGenerate = async (productInput: string) => {
    const request: ProductDescriptionRequest = { productInput }
    await generate(request)
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleRegenerate = () => {
    reset()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <ThemeToggle />

      <main className="w-full max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Product Description Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hasilkan deskripsi produk yang menarik dan optimal untuk marketplace Indonesia
            dengan bantuan kecerdasan buatan. Cocok untuk Tokopedia, Shopee, dan platform e-commerce lainnya.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Form Section */}
          <ProductDescriptionForm
            onSubmit={handleGenerate}
            loading={loading}
          />

          {/* Error Display */}
          {error ? <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div> : null}

          {/* Loading State */}
          {loading ? <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
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
            </div> : null}

          {/* Results Section */}
          {result && !loading ? <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/20 mb-4">
                  <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Deskripsi Produk Berhasil Dibuat!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Deskripsi ini dioptimalkan untuk marketplace Indonesia dengan fokus pada manfaat dan SEO.
                </p>
              </div>

              <ProductDescriptionResult
                data={result}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
              />

              {/* Copy Success Message */}
              {copiedText ? <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <Copy className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      Teks berhasil disalin ke clipboard!
                    </span>
                  </div>
                </div> : null}
            </div> : null}

          {/* Empty State */}
          {!result && !loading && !error && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
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
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by AI • Optimized for Indonesian Marketplaces
          </p>
        </footer>
      </main>
    </div>
  )
}