import { sellerRepository } from './seller_repository'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

export const sellerService = {
  // Get seller dashboard data
  async getDashboardData(userId: string) {
    try {
      // Get user's store
      const store = await sellerRepository.getStoreByUserId(userId)
      if (!store) {
        return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
      }

      // Get dashboard statistics
      const [
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders,
        topProducts,
      ] = await Promise.all([
        sellerRepository.getProductCount(store.id),
        sellerRepository.getOrderCount(store.id),
        sellerRepository.getPendingOrderCount(store.id),
        sellerRepository.getCompletedOrderCount(store.id),
        sellerRepository.getCancelledOrderCount(store.id),
        sellerRepository.getTotalRevenue(store.id),
        sellerRepository.getRecentOrders(store.id, 5),
        sellerRepository.getTopProducts(store.id, 5),
      ])

      return successResponse('Dashboard data retrieved', {
        stats: {
          totalRevenue: Number(totalRevenue),
          totalOrders,
          totalProducts,
          pendingOrders,
          completedOrders,
          cancelledOrders,
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          customer: order.user.name,
          total: Number(order.total),
          status: order.status,
          createdAt: order.createdAt,
        })),
        topProducts: topProducts.map(product => ({
          id: product.id,
          name: product.name,
          sales: product._count.orders,
          revenue: Number(product.revenue),
        })),
      })
    } catch (error) {
      console.error('Error getting dashboard data:', error)
      return errorResponse('Gagal mengambil data dashboard', ErrorCode.INTERNAL_ERROR)
    }
  },

  // Get seller analytics data
  async getAnalyticsData(userId: string, period: 'day' | 'week' | 'month' = 'week') {
    try {
      // Get user's store
      const store = await sellerRepository.getStoreByUserId(userId)
      if (!store) {
        return errorResponse('Anda belum memiliki toko', ErrorCode.NOT_FOUND)
      }

      // Calculate date range based on period
      const endDate = new Date()
      let startDate = new Date()

      switch (period) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1)
          break
        case 'week':
          startDate.setDate(startDate.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
      }

      // Get analytics data
      const [revenueData, orderData, productPerformance] = await Promise.all([
        sellerRepository.getRevenueByPeriod(store.id, startDate, endDate),
        sellerRepository.getOrdersByPeriod(store.id, startDate, endDate),
        sellerRepository.getProductPerformance(store.id),
      ])

      return successResponse('Analytics data retrieved', {
        period,
        revenueData,
        orderData,
        productPerformance: productPerformance.map(product => ({
          id: product.id,
          name: product.name,
          sales: product._count.orders,
          revenue: Number(product.revenue),
        })),
      })
    } catch (error) {
      console.error('Error getting analytics data:', error)
      return errorResponse('Gagal mengambil data analytics', ErrorCode.INTERNAL_ERROR)
    }
  },
}
