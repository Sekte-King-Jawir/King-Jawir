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

interface ProductDescriptionFormProps {
  onSubmit: (productInput: string) => void
  loading?: boolean
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
  className = '',
}: ProductDescriptionFormProps): React.JSX.Element {
  const [productInput, setProductInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    if (productInput.trim() === '') {
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

  const isDisabled = false // disabled || loading
  const charCount = productInput.length
  const isOverLimit = charCount > 500

  return (
    <div
      className={`bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-8 shadow-lg ${className}`}
    >
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
              className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none pointer-events-auto ${
                error !== '' ? 'border-red-500' : ''
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

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 px-6 gap-2 shadow-lg shadow-blue-600/30"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Menghasilkan Deskripsi...
              </>
            ) : (
              'Generate Deskripsi'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
