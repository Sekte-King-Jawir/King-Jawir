export interface SellerOrder {
  id: string
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  items: OrderItem[]
  shippingAddress?: string | null
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    image: string | null
  }
}

export interface OrdersApiResponse {
  success: boolean
  message: string
  data?: {
    orders: SellerOrder[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
