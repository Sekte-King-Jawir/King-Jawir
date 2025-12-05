import { aiDescriptionService } from './ai_description_service'

export const aiDescriptionController = {
  async generateDescription(data: {
    productName: string
    category?: string
    specs?: string[]
    targetMarket?: 'premium' | 'budget' | 'general'
    currentDescription?: string
  }) {
    return await aiDescriptionService.generateDescription(data)
  },

  async improveDescription(data: {
    currentDescription: string
    productName: string
    improvements: string[]
  }) {
    return await aiDescriptionService.improveDescription(
      data.currentDescription,
      data.productName,
      data.improvements
    )
  },
}
