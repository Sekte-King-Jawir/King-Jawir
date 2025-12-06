import { logger } from '../lib/logger'

export const productDescriptionRepository = {
  /**
   * Placeholder repository for product description feature.
   * Currently no external data fetching or storage is required.
   * This can be extended for future validations or external API calls if needed.
   */
  async validateInput(input: string): Promise<boolean> {
    // Basic validation: ensure input is not empty and within reasonable length
    if (!input || input.trim().length === 0 || input.length > 500) {
      logger.warn({ msg: 'Invalid product input', input })
      return false
    }
    return true
  },
}
