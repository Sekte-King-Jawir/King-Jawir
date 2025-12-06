export interface ProductDescriptionRequest {
  productInput: string
}

export interface ProductDescriptionResult {
  short: string
  long: string
  bullets: string[]
  seoKeywords: string[]
}

export interface ProductDescriptionResponse {
  success: boolean
  message: string
  data?: ProductDescriptionResult
}
