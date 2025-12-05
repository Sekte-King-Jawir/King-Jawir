/* eslint-disable */
'use client'

import { useState } from 'react'
import { useSellerAI } from '@/hooks/useSellerAI'
import type { GenerateDescriptionInput, ImproveDescriptionInput } from '@/services/seller/aiService'
import { Button } from '@repo/ui/button'
import { Card } from '@repo/ui/card'

interface AIDescriptionGeneratorProps {
  // For generate mode
  productName?: string
  category?: string
  specifications?: string

  // For improve mode
  currentDescription?: string

  // Callbacks
  onDescriptionGenerated?: (description: {
    shortDescription: string
    longDescription: string
    keyFeatures: string[]
    seoKeywords: string[]
  }) => void

  // Mode
  mode?: 'generate' | 'improve'
}

export function AIDescriptionGenerator({
  productName = '',
  category = '',
  specifications = '',
  currentDescription = '',
  onDescriptionGenerated,
  mode = 'generate',
}: AIDescriptionGeneratorProps) {
  const {
    generateDescription,
    improveDescription,
    isGenerating,
    isImproving,
    generateError,
    improveError,
    result,
    clearResult,
    loadTips,
    tips,
    isLoadingTips,
  } = useSellerAI()

  // Local form state
  const [formData, setFormData] = useState({
    productName,
    category,
    specifications,
    targetMarket: 'general' as 'premium' | 'budget' | 'general',
    currentDescription,
    focusArea: 'clarity' as 'clarity' | 'seo' | 'persuasive' | 'concise',
  })

  const [showTips, setShowTips] = useState(false)

  const handleGenerate = async (): Promise<void> => {
    if (formData.productName.trim() === '') {
      alert('Nama produk wajib diisi')
      return
    }

    const input: GenerateDescriptionInput = {
      productName: formData.productName,
      targetMarket: formData.targetMarket,
    }

    if (formData.category !== '' && formData.category.trim() !== '') {
      input.category = formData.category
    }

    if (formData.specifications !== '' && formData.specifications.trim() !== '') {
      input.specifications = formData.specifications
    }

    await generateDescription(input)
  }

  const handleImprove = async (): Promise<void> => {
    if (formData.currentDescription.trim() === '') {
      alert('Deskripsi yang ingin diperbaiki wajib diisi')
      return
    }

    const input: ImproveDescriptionInput = {
      currentDescription: formData.currentDescription,
      productName: formData.productName !== '' ? formData.productName : 'Produk',
      focusArea: formData.focusArea,
    }

    if (formData.category !== '' && formData.category.trim() !== '') {
      input.category = formData.category
    }

    await improveDescription(input)
  }

  const handleUseResult = (): void => {
    if (result !== null && onDescriptionGenerated !== undefined) {
      onDescriptionGenerated(result)
      clearResult()
    }
  }

  const handleShowTips = async (): Promise<void> => {
    if (tips === null) {
      await loadTips()
    }
    setShowTips(!showTips)
  }

  const isLoading = isGenerating || isImproving

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">🤖 AI Description Generator</h3>
          <Button variant="ghost" size="sm" onClick={handleShowTips} disabled={isLoadingTips}>
            {isLoadingTips ? 'Loading...' : '💡 Tips Copywriting'}
          </Button>
        </div>

        {/* Tips Section */}
        {showTips && tips && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2">Tips Copywriting Produk</h4>
            <div className="space-y-3">
              {tips.map((tip, idx) => (
                <div key={idx}>
                  <p className="font-medium text-sm text-blue-900">{tip.category}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                    {tip.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'generate' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              clearResult()
            }}
          >
            Generate Baru
          </Button>
          <Button
            variant={mode === 'improve' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              clearResult()
            }}
          >
            Improve Existing
          </Button>
        </div>

        {/* Generate Form */}
        {mode === 'generate' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={e => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Contoh: Sepatu Sneakers Casual Pria"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kategori (Optional)</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="Contoh: Fashion, Elektronik, Makanan"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Spesifikasi (Optional)</label>
              <textarea
                value={formData.specifications}
                onChange={e => setFormData({ ...formData, specifications: e.target.value })}
                placeholder="Contoh: Bahan canvas premium, Sol karet anti slip, Ukuran 39-44"
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Market</label>
              <select
                value={formData.targetMarket}
                onChange={e =>
                  setFormData({
                    ...formData,
                    targetMarket: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General (Umum)</option>
                <option value="premium">Premium (Eksklusif)</option>
                <option value="budget">Budget (Hemat)</option>
              </select>
            </div>

            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isGenerating ? '⏳ Generating...' : '✨ Generate Description'}
            </Button>

            {generateError && <p className="text-sm text-red-600">{generateError}</p>}
          </div>
        )}

        {/* Improve Form */}
        {mode === 'improve' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi yang Ingin Diperbaiki <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.currentDescription}
                onChange={e =>
                  setFormData({
                    ...formData,
                    currentDescription: e.target.value,
                  })
                }
                placeholder="Paste deskripsi produk yang ingin diperbaiki..."
                rows={5}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nama Produk (Optional)</label>
              <input
                type="text"
                value={formData.productName}
                onChange={e => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Untuk konteks yang lebih baik"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fokus Perbaikan</label>
              <select
                value={formData.focusArea}
                onChange={e => setFormData({ ...formData, focusArea: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="clarity">Clarity (Lebih Jelas)</option>
                <option value="seo">SEO (Keyword Optimization)</option>
                <option value="persuasive">Persuasive (Lebih Menjual)</option>
                <option value="concise">Concise (Lebih Ringkas)</option>
              </select>
            </div>

            <Button onClick={handleImprove} disabled={isLoading} className="w-full">
              {isImproving ? '⏳ Improving...' : '🚀 Improve Description'}
            </Button>

            {improveError && <p className="text-sm text-red-600">{improveError}</p>}
          </div>
        )}
      </Card>

      {/* Result Card */}
      {result && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-green-900">✅ Deskripsi Berhasil Di-generate!</h4>
            <Button variant="ghost" size="sm" onClick={clearResult} className="text-gray-600">
              ✕ Tutup
            </Button>
          </div>

          <div className="space-y-4">
            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <div className="p-3 bg-white rounded border">
                <p className="text-sm">{result.shortDescription}</p>
              </div>
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Description
              </label>
              <div className="p-3 bg-white rounded border">
                <p className="text-sm whitespace-pre-wrap">{result.longDescription}</p>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
              <div className="p-3 bg-white rounded border">
                <ul className="list-disc list-inside text-sm space-y-1">
                  {result.keyFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SEO Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
              <div className="p-3 bg-white rounded border">
                <div className="flex flex-wrap gap-2">
                  {result.seoKeywords.map((keyword, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Use Result Button */}
            {onDescriptionGenerated && (
              <Button onClick={handleUseResult} className="w-full">
                📝 Gunakan Deskripsi Ini
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
