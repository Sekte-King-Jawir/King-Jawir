export function useSellerUrls() {
  return {
    home: '/',
    products: '/products',
    seller: {
      dashboard: '/seller/dashboard',
      products: '/seller/products',
      orders: '/seller/orders',
      store: '/seller/store',
      analytics: '/seller/analytics',
    },
    priceAnalysis: '/price-analysis',
  }
}
