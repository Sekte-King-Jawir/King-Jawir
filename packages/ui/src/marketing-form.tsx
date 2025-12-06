"use client"

/**
 * Marketing Content Form Component
 *
 * @description Form component for generating AI-powered marketing content for different platforms.
 * Requires product description input and platform selection.
 *
 * @module ui/marketing-form
 */

import React, { useState } from 'react'
import { Button } from './button'
import { Card } from './card'
import type { ProductDescriptionResult } from '../../../apps/web/types/product-description'

interface MarketingFormProps {
  productDescription: ProductDescriptionResult | null
  onSubmit: (platform: string) => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'email', label: 'Email', icon: '📧' },
] as const

/**
 * Form component for marketing content generation
 *
 * @param {MarketingFormProps} props - Component props
 * @returns {React.JSX.Element} Form component
 *
 * @example
 * <MarketingForm
 *   productDescription={productDesc}
 *   onSubmit={(platform) => generateContent(platform)}
 *   loading={isGenerating}
 * />
 */
export function MarketingForm({
  productDescription,
  onSubmit,
  loading = false,
  disabled = false,
  className = '',
}: MarketingFormProps): React.JSX.Element {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!productDescription) {
      setError('Deskripsi produk diperlukan. Generate deskripsi produk terlebih dahulu.')
      return
    }

    if (!selectedPlatform) {
      setError('Pilih platform tujuan untuk konten pemasaran')
      return
    }

    setError('')
    onSubmit(selectedPlatform)
  }

  const handlePlatformChange = (platform: string): void => {
    setSelectedPlatform(platform)
    if (error !== '') setError('')
  }

  const isDisabled = disabled || loading || !productDescription

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Generate Konten Pemasaran
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Hasilkan konten pemasaran yang menarik untuk berbagai platform media sosial dan email
          </p>
        </div>

        {productDescription === null ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Deskripsi Produk Diperlukan
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>Generate deskripsi produk terlebih dahulu sebelum membuat konten pemasaran.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <span className="text-green-400">✅</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Deskripsi Produk Siap
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p className="line-clamp-2">{productDescription.short}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Pilih Platform Tujuan
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => handlePlatformChange(platform.value)}
                  className={`p-3 border rounded-lg text-left transition-all ${
                    selectedPlatform === platform.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isDisabled}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{platform.icon}</span>
                    <span className="text-sm font-medium">{platform.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error !== '' ? (
            <div
              id="error-message"
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isDisabled || !selectedPlatform}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Menghasilkan Konten...
              </>
            ) : (
              'Generate Konten Pemasaran'
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}