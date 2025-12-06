export interface MarketingContentRequest {
  productDescription: {
    short: string
    long: string
    bullets: string[]
    seoKeywords: string[]
  }
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'email' | 'tiktok'
}

export interface MarketingContentResult {
  platform: string
  content: string
  hashtags: string[]
  callToAction: string
}

export interface MarketingContentResponse {
  success: boolean
  message: string
  data?: MarketingContentResult
}
