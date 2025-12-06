import { logger } from '../lib/logger'

export const marketingRepository = {
  /**
   * Validate product description and platform input
   */
  validateInput(productDescription: any, platform: string): boolean {
    const validPlatforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'email', 'tiktok']
    if (
      typeof productDescription !== 'object' ||
      !productDescription ||
      !productDescription.short ||
      typeof productDescription.short !== 'string' ||
      productDescription.short.trim() === '' ||
      !validPlatforms.includes(platform.toLowerCase())
    ) {
      logger.warn({
        msg: 'Invalid marketing input',
        platform,
        hasShort: !!productDescription?.short,
      })
      return false
    }
    return true
  },
}
