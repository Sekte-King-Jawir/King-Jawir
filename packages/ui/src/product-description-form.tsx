'use client'

/**
 * Product Description Form Component
 *
 * @description Form component for inputting product details to generate AI-powered descriptions.
 * Includes validation, loading states, and accessibility features.
 *
 * @module ui/product-description-form
 */

import React, { useState } from 'react'
import { Button } from './button'
import { Card } from './card'

interface ProductDescriptionFormProps {
  onSubmit: (productInput: string) => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Form component for product description generation
 *
 * @param {ProductDescriptionFormProps} props - Component props
 * @returns {JSX.Element} Form component
 *
 * @example
 * <ProductDescriptionForm
 *   onSubmit={(input) => generateDescription(input)}
 *   loading={isGenerating}
 * />
 */
export function ProductDescriptionForm({
  onSubmit,
  loading = false,
  disabled = false,
  className = '',
}: ProductDescriptionFormProps): React.JSX.Element {
  const [productInput, setProductInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!productInput.trim()) {
      setError('Deskripsi produk tidak boleh kosong')
      return
    }

    if (productInput.length < 10) {
      setError('Deskripsi produk minimal 10 karakter')
      return
    }

    if (productInput.length > 500) {
      setError('Deskripsi produk maksimal 500 karakter')
      return
    }

    setError('')
    onSubmit(productInput.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setProductInput(e.target.value)
    if (error !== '') setError('')
  }

  const isDisabled = disabled || loading
  const charCount = productInput.length
  const isOverLimit = charCount > 500

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Generate Deskripsi Produk</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Masukkan detail produk untuk menghasilkan deskripsi yang menarik dengan bantuan AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="product-input"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Deskripsi Produk
            </label>
            <textarea
              id="product-input"
              value={productInput}
              onChange={handleInputChange}
              placeholder="Contoh: Kamera aksi 4K waterproof dengan stabilizer, cocok untuk vlogging dan olahraga air"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground resize-none ${
                error !== '' ? 'border-red-500' : 'border-input'
              }`}
              rows={4}
              disabled={isDisabled}
              aria-describedby={error !== '' ? 'error-message' : undefined}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-muted-foreground">{charCount}/500 karakter</div>
              {isOverLimit ? (
                <div className="text-xs text-destructive">Melebihi batas karakter</div>
              ) : null}
            </div>
          </div>

          {error !== '' ? (
            <div id="error-message" className="text-sm text-destructive" role="alert">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isDisabled || isOverLimit || !productInput.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Menghasilkan Deskripsi...
              </>
            ) : (
              'Generate Deskripsi'
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
