import { sellerService } from './seller_service'

export const sellerController = {
  async getDashboardData(userId: string) {
    return sellerService.getDashboardData(userId)
  },

  async getAnalyticsData(userId: string, period?: 'day' | 'week' | 'month') {
    return sellerService.getAnalyticsData(userId, period)
  },
}
