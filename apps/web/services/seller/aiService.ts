import { API_CONFIG, API_ENDPOINTS } from '@/lib/config/api'

export interface GenerateDescriptionInput {
  productName: string
  category?: string
  specifications?: string
  targetMarket?: 'premium' | 'budget' | 'general'
}

export interface ImproveDescriptionInput {
  currentDescription: string
  productName: string
  category?: string
  focusArea?: 'clarity' | 'seo' | 'persuasive' | 'concise'
}

export interface DescriptionOutput {
  shortDescription: string
  longDescription: string
  keyFeatures: string[]
  seoKeywords: string[]
}

export interface DescriptionTip {
  category: string
  tips: string[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

class AIService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        credentials: 'include', // Important for httpOnly cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  /**
   * Generate product description using AI
   */
  async generateDescription(
    input: GenerateDescriptionInput
  ): Promise<ApiResponse<DescriptionOutput>> {
    return this.fetchWithAuth<DescriptionOutput>(
      API_ENDPOINTS.SELLER.AI.GENERATE_DESCRIPTION,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )
  }

  /**
   * Improve existing product description using AI
   */
  async improveDescription(
    input: ImproveDescriptionInput
  ): Promise<ApiResponse<DescriptionOutput>> {
    return this.fetchWithAuth<DescriptionOutput>(
      API_ENDPOINTS.SELLER.AI.IMPROVE_DESCRIPTION,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )
  }

  /**
   * Get copywriting tips (no AI cost)
   */
  async getDescriptionTips(): Promise<ApiResponse<DescriptionTip[]>> {
    return this.fetchWithAuth<DescriptionTip[]>(
      API_ENDPOINTS.SELLER.AI.DESCRIPTION_TIPS
    )
  }
}

export const aiService = new AIService()
