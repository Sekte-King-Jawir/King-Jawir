'use client'

import { useState } from 'react'
import {
  aiService,
  GenerateDescriptionInput,
  ImproveDescriptionInput,
  DescriptionOutput,
  DescriptionTip,
} from '@/services/seller/aiService'

interface UseSellerAIReturn {
  // Generate description
  generateDescription: (input: GenerateDescriptionInput) => Promise<void>
  isGenerating: boolean
  generateError: string | null

  // Improve description
  improveDescription: (input: ImproveDescriptionInput) => Promise<void>
  isImproving: boolean
  improveError: string | null

  // Tips
  loadTips: () => Promise<void>
  tips: DescriptionTip[] | null
  isLoadingTips: boolean
  tipsError: string | null

  // Result
  result: DescriptionOutput | null
  clearResult: () => void
}

export function useSellerAI(): UseSellerAIReturn {
  // Generate state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // Improve state
  const [isImproving, setIsImproving] = useState(false)
  const [improveError, setImproveError] = useState<string | null>(null)

  // Tips state
  const [tips, setTips] = useState<DescriptionTip[] | null>(null)
  const [isLoadingTips, setIsLoadingTips] = useState(false)
  const [tipsError, setTipsError] = useState<string | null>(null)

  // Result state (shared for both generate and improve)
  const [result, setResult] = useState<DescriptionOutput | null>(null)

  const generateDescription = async (input: GenerateDescriptionInput) => {
    try {
      setIsGenerating(true)
      setGenerateError(null)
      setResult(null)

      const response = await aiService.generateDescription(input)

      if (response.success && response.data) {
        setResult(response.data)
      } else {
        throw new Error(response.message || 'Gagal generate deskripsi')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
      setGenerateError(message)
      console.error('Generate description error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const improveDescription = async (input: ImproveDescriptionInput) => {
    try {
      setIsImproving(true)
      setImproveError(null)
      setResult(null)

      const response = await aiService.improveDescription(input)

      if (response.success && response.data) {
        setResult(response.data)
      } else {
        throw new Error(response.message || 'Gagal improve deskripsi')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
      setImproveError(message)
      console.error('Improve description error:', error)
    } finally {
      setIsImproving(false)
    }
  }

  const loadTips = async () => {
    try {
      setIsLoadingTips(true)
      setTipsError(null)

      const response = await aiService.getDescriptionTips()

      if (response.success && response.data) {
        setTips(response.data)
      } else {
        throw new Error(response.message || 'Gagal load tips')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
      setTipsError(message)
      console.error('Load tips error:', error)
    } finally {
      setIsLoadingTips(false)
    }
  }

  const clearResult = () => {
    setResult(null)
    setGenerateError(null)
    setImproveError(null)
  }

  return {
    // Generate
    generateDescription,
    isGenerating,
    generateError,

    // Improve
    improveDescription,
    isImproving,
    improveError,

    // Tips
    loadTips,
    tips,
    isLoadingTips,
    tipsError,

    // Result
    result,
    clearResult,
  }
}
