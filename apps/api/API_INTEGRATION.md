# 🔌 API Integration Guide

Dokumentasi untuk integrasi Frontend dengan Backend API Marketplace.

## 📍 Base Configuration

```typescript
// config/api.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
}
```

---

## 🔐 Authentication

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register user baru | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| POST | `/auth/refresh` | Refresh access token | ✅ |
| GET | `/auth/me` | Get current user | ✅ |
| GET | `/auth/verify-email` | Verify email dengan token | ❌ |
| POST | `/auth/resend-verification` | Kirim ulang email verifikasi | ❌ |
| POST | `/auth/forgot-password` | Request reset password | ❌ |
| POST | `/auth/reset-password` | Reset password dengan token | ❌ |
| POST | `/auth/change-password` | Ganti password (logged in) | ✅ |
| GET | `/auth/google` | OAuth Google redirect | ❌ |
| GET | `/auth/google/callback` | OAuth Google callback | ❌ |

### Variables & Types

```typescript
// types/auth.ts

// Request Bodies
interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface LoginRequest {
  email: string
  password: string
}

interface ForgotPasswordRequest {
  email: string
}

interface ResetPasswordRequest {
  token: string
  newPassword: string
}

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Response Types
interface AuthUser {
  id: string
  email: string
  name: string
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  emailVerified: boolean
  avatar?: string
}

interface LoginResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    user: AuthUser
  }
}

interface MeResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
  }
}
```

### Usage Example

```typescript
// hooks/useAuth.ts
import { useState } from 'react'
import { API_CONFIG } from '@/config/api'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for cookies!
      body: JSON.stringify(credentials)
    })
    const data: LoginResponse = await res.json()
    if (data.success) {
      setUser(data.data.user)
      // Store tokens if needed
      localStorage.setItem('accessToken', data.data.accessToken)
    }
    setIsLoading(false)
    return data
  }

  const logout = async () => {
    await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
    localStorage.removeItem('accessToken')
  }

  const getMe = async () => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
      credentials: 'include'
    })
    const data: MeResponse = await res.json()
    if (data.success) {
      setUser(data.data.user)
    }
    return data
  }

  return { user, isLoading, login, logout, getMe }
}
```

---

## 👤 Profile

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get user profile | ✅ |
| PUT | `/profile` | Update profile | ✅ |
| PUT | `/profile/avatar` | Update avatar | ✅ |

### Variables & Types

```typescript
// types/profile.ts

interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  avatar?: string
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  emailVerified: boolean
  createdAt: string
}

interface UpdateProfileRequest {
  name?: string
  phone?: string  // Format: 08xxxxxxxxxx (10-13 digits)
  bio?: string    // Max 500 chars
}

interface UpdateAvatarRequest {
  avatar: string  // Valid URL
}

interface ProfileResponse {
  success: boolean
  message: string
  data: {
    profile: Profile
  }
}
```

### Usage Example

```typescript
// hooks/useProfile.ts
export function useProfile() {
  const getProfile = async (): Promise<ProfileResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/profile`, {
      credentials: 'include'
    })
    return res.json()
  }

  const updateProfile = async (data: UpdateProfileRequest) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return res.json()
  }

  const updateAvatar = async (avatarUrl: string) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/profile/avatar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ avatar: avatarUrl })
    })
    return res.json()
  }

  return { getProfile, updateProfile, updateAvatar }
}
```

---

## 🏪 Store

### Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/store` | Create store (upgrade to SELLER) | ✅ | CUSTOMER |
| GET | `/store` | Get my store | ✅ | SELLER |
| PUT | `/store` | Update my store | ✅ | SELLER |
| DELETE | `/store` | Delete store (downgrade to CUSTOMER) | ✅ | SELLER |
| GET | `/stores/:slug` | Get store by slug (public) | ❌ | - |

### Variables & Types

```typescript
// types/store.ts

interface Store {
  id: string
  name: string
  slug: string
  productCount: number
  owner?: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
}

interface CreateStoreRequest {
  name: string        // 2-100 chars
  slug?: string       // Auto-generated if empty
}

interface UpdateStoreRequest {
  name?: string
  slug?: string
}

interface StoreResponse {
  success: boolean
  message: string
  data: {
    store: Store
  }
}
```

### Usage Example

```typescript
// hooks/useStore.ts
export function useStore() {
  const createStore = async (data: CreateStoreRequest) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return res.json()
  }

  const getMyStore = async (): Promise<StoreResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/store`, {
      credentials: 'include'
    })
    return res.json()
  }

  const getStoreBySlug = async (slug: string): Promise<StoreResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/stores/${slug}`)
    return res.json()
  }

  const deleteStore = async () => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/store`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return res.json()
  }

  return { createStore, getMyStore, getStoreBySlug, deleteStore }
}
```

---

## 📂 Categories

### Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/categories` | List all categories | ❌ | - |
| GET | `/categories/:slug` | Get category by slug | ❌ | - |
| POST | `/categories` | Create category | ✅ | ADMIN |
| PUT | `/categories/:id` | Update category | ✅ | ADMIN |
| DELETE | `/categories/:id` | Delete category | ✅ | ADMIN |

### Variables & Types

```typescript
// types/category.ts

interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
  createdAt: string
}

interface CreateCategoryRequest {
  name: string
  slug?: string
}

interface UpdateCategoryRequest {
  name?: string
  slug?: string
}

interface CategoriesResponse {
  success: boolean
  message: string
  data: {
    categories: Category[]
  }
}

interface CategoryResponse {
  success: boolean
  message: string
  data: {
    category: Category
  }
}
```

### Usage Example

```typescript
// hooks/useCategories.ts
export function useCategories() {
  const getCategories = async (): Promise<CategoriesResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/categories`)
    return res.json()
  }

  const getCategoryBySlug = async (slug: string): Promise<CategoryResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/categories/${slug}`)
    return res.json()
  }

  return { getCategories, getCategoryBySlug }
}
```

---

## 📦 Products

### Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/products` | List products (with filters) | ❌ | - |
| GET | `/products/:slug` | Get product by slug | ❌ | - |
| POST | `/products` | Create product | ✅ | SELLER |
| PUT | `/products/:id` | Update product | ✅ | SELLER |
| DELETE | `/products/:id` | Delete product | ✅ | SELLER |
| GET | `/my-products` | Get my products | ✅ | SELLER |
| GET | `/stores/:slug/products` | Get store products | ❌ | - |

### Variables & Types

```typescript
// types/product.ts

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image?: string
  category: {
    id: string
    name: string
    slug: string
  }
  store: {
    id: string
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

interface ProductFilter {
  categoryId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

interface CreateProductRequest {
  categoryId: string
  name: string          // 2-200 chars
  slug?: string
  price: number         // >= 0
  stock: number         // >= 0
  image?: string
}

interface UpdateProductRequest {
  categoryId?: string
  name?: string
  slug?: string
  price?: number
  stock?: number
  image?: string
}

interface ProductsResponse {
  success: boolean
  message: string
  data: {
    products: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface ProductResponse {
  success: boolean
  message: string
  data: {
    product: Product
  }
}
```

### Usage Example

```typescript
// hooks/useProducts.ts
export function useProducts() {
  const getProducts = async (filter?: ProductFilter): Promise<ProductsResponse> => {
    const params = new URLSearchParams()
    if (filter?.categoryId) params.set('categoryId', filter.categoryId)
    if (filter?.search) params.set('search', filter.search)
    if (filter?.minPrice) params.set('minPrice', String(filter.minPrice))
    if (filter?.maxPrice) params.set('maxPrice', String(filter.maxPrice))
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))

    const res = await fetch(`${API_CONFIG.BASE_URL}/products?${params}`)
    return res.json()
  }

  const getProductBySlug = async (slug: string): Promise<ProductResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/products/${slug}`)
    return res.json()
  }

  const getStoreProducts = async (storeSlug: string, page = 1, limit = 20) => {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/stores/${storeSlug}/products?page=${page}&limit=${limit}`
    )
    return res.json()
  }

  const getMyProducts = async (page = 1, limit = 20) => {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/my-products?page=${page}&limit=${limit}`,
      { credentials: 'include' }
    )
    return res.json()
  }

  const createProduct = async (data: CreateProductRequest) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return res.json()
  }

  return { getProducts, getProductBySlug, getStoreProducts, getMyProducts, createProduct }
}
```

---

## 🛒 Cart

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Get cart | ✅ |
| POST | `/cart` | Add to cart | ✅ |
| PUT | `/cart/:productId` | Update quantity | ✅ |
| DELETE | `/cart/:productId` | Remove item | ✅ |
| DELETE | `/cart` | Clear cart | ✅ |

### Variables & Types

```typescript
// types/cart.ts

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    image?: string
    store: {
      id: string
      name: string
      slug: string
    }
  }
  subtotal: number
}

interface Cart {
  items: CartItem[]
  itemCount: number
  total: number
}

interface AddToCartRequest {
  productId: string
  quantity: number    // >= 1
}

interface UpdateCartRequest {
  quantity: number    // >= 1, <= stock
}

interface CartResponse {
  success: boolean
  message: string
  data: {
    cart: Cart
  }
}
```

### Usage Example

```typescript
// hooks/useCart.ts
export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)

  const getCart = async () => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/cart`, {
      credentials: 'include'
    })
    const data: CartResponse = await res.json()
    if (data.success) setCart(data.data.cart)
    return data
  }

  const addToCart = async (productId: string, quantity = 1) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, quantity })
    })
    const data = await res.json()
    if (data.success) await getCart()
    return data
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    })
    const data = await res.json()
    if (data.success) await getCart()
    return data
  }

  const removeItem = async (productId: string) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    const data = await res.json()
    if (data.success) await getCart()
    return data
  }

  const clearCart = async () => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/cart`, {
      method: 'DELETE',
      credentials: 'include'
    })
    const data = await res.json()
    if (data.success) setCart({ items: [], itemCount: 0, total: 0 })
    return data
  }

  return { cart, getCart, addToCart, updateQuantity, removeItem, clearCart }
}
```

---

## 🛍️ Orders

### Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/orders` | Get my orders | ✅ | CUSTOMER |
| GET | `/orders/:id` | Get order detail | ✅ | CUSTOMER |
| POST | `/orders` | Checkout (create order) | ✅ | CUSTOMER |
| PUT | `/orders/:id/cancel` | Cancel order | ✅ | CUSTOMER |
| GET | `/seller/orders` | Get seller orders | ✅ | SELLER |
| PUT | `/seller/orders/:id/status` | Update order status | ✅ | SELLER |

### Variables & Types

```typescript
// types/order.ts

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DONE' | 'CANCELLED'

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  price: number
  quantity: number
  subtotal: number
}

interface Order {
  id: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  store?: {
    id: string
    name: string
    slug: string
  }
  user?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface CheckoutRequest {
  // Cart items will be used automatically
  // No body needed
}

interface UpdateStatusRequest {
  status: 'PAID' | 'SHIPPED' | 'DONE'
}

interface OrdersResponse {
  success: boolean
  message: string
  data: {
    orders: Order[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface OrderResponse {
  success: boolean
  message: string
  data: {
    order: Order
  }
}
```

### Order Status Flow

```
PENDING → PAID → SHIPPED → DONE
    ↓
CANCELLED (only from PENDING)
```

### Usage Example

```typescript
// hooks/useOrders.ts
export function useOrders() {
  const getOrders = async (page = 1, limit = 10): Promise<OrdersResponse> => {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/orders?page=${page}&limit=${limit}`,
      { credentials: 'include' }
    )
    return res.json()
  }

  const getOrderDetail = async (orderId: string): Promise<OrderResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}`, {
      credentials: 'include'
    })
    return res.json()
  }

  const checkout = async (): Promise<OrderResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
      method: 'POST',
      credentials: 'include'
    })
    return res.json()
  }

  const cancelOrder = async (orderId: string) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      credentials: 'include'
    })
    return res.json()
  }

  return { getOrders, getOrderDetail, checkout, cancelOrder }
}

// hooks/useSellerOrders.ts
export function useSellerOrders() {
  const getSellerOrders = async (page = 1, limit = 10, status?: OrderStatus) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) params.set('status', status)

    const res = await fetch(`${API_CONFIG.BASE_URL}/seller/orders?${params}`, {
      credentials: 'include'
    })
    return res.json()
  }

  const updateOrderStatus = async (orderId: string, status: 'PAID' | 'SHIPPED' | 'DONE') => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/seller/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    })
    return res.json()
  }

  return { getSellerOrders, updateOrderStatus }
}
```

---

## ⭐ Reviews

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products/:slug/reviews` | Get product reviews | ❌ |
| POST | `/reviews` | Create review | ✅ |
| PUT | `/reviews/:id` | Update review | ✅ |
| DELETE | `/reviews/:id` | Delete review | ✅ |

### Variables & Types

```typescript
// types/review.ts

interface Review {
  id: string
  rating: number        // 1-5
  comment?: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateReviewRequest {
  productId: string
  rating: number        // 1-5
  comment?: string
}

interface UpdateReviewRequest {
  rating?: number       // 1-5
  comment?: string
}

interface ReviewsResponse {
  success: boolean
  message: string
  data: {
    reviews: Review[]
    total: number
    page: number
    limit: number
    totalPages: number
    averageRating: number
    reviewCount: number
  }
}

interface ReviewResponse {
  success: boolean
  message: string
  data: {
    review: Review
  }
}
```

### Usage Example

```typescript
// hooks/useReviews.ts
export function useReviews() {
  const getProductReviews = async (productSlug: string, page = 1, limit = 10) => {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/products/${productSlug}/reviews?page=${page}&limit=${limit}`
    )
    return res.json()
  }

  const createReview = async (data: CreateReviewRequest) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return res.json()
  }

  const updateReview = async (reviewId: string, data: UpdateReviewRequest) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    return res.json()
  }

  const deleteReview = async (reviewId: string) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return res.json()
  }

  return { getProductReviews, createReview, updateReview, deleteReview }
}
```

---

## 👑 Admin

### Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/admin/stats` | Get dashboard stats | ✅ | ADMIN |
| GET | `/admin/users` | List users | ✅ | ADMIN |
| GET | `/admin/users/:id` | Get user detail | ✅ | ADMIN |
| PUT | `/admin/users/:id/role` | Update user role | ✅ | ADMIN |
| DELETE | `/admin/users/:id` | Delete user | ✅ | ADMIN |

### Variables & Types

```typescript
// types/admin.ts

interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  usersByRole: {
    CUSTOMER: number
    SELLER: number
    ADMIN: number
  }
  ordersByStatus: {
    PENDING: number
    PAID: number
    SHIPPED: number
    DONE: number
    CANCELLED: number
  }
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  emailVerified: boolean
  avatar?: string
  phone?: string
  bio?: string
  store?: {
    id: string
    name: string
    slug: string
  }
  _count: {
    orders: number
    reviews: number
  }
  createdAt: string
}

interface UsersFilter {
  role?: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  search?: string
  page?: number
  limit?: number
}

interface UpdateRoleRequest {
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
}

interface AdminStatsResponse {
  success: boolean
  message: string
  data: {
    stats: AdminStats
  }
}

interface AdminUsersResponse {
  success: boolean
  message: string
  data: {
    users: AdminUser[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface AdminUserResponse {
  success: boolean
  message: string
  data: {
    user: AdminUser
  }
}
```

### Usage Example

```typescript
// hooks/useAdmin.ts
export function useAdmin() {
  const getStats = async (): Promise<AdminStatsResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/admin/stats`, {
      credentials: 'include'
    })
    return res.json()
  }

  const getUsers = async (filter?: UsersFilter): Promise<AdminUsersResponse> => {
    const params = new URLSearchParams()
    if (filter?.role) params.set('role', filter.role)
    if (filter?.search) params.set('search', filter.search)
    if (filter?.page) params.set('page', String(filter.page))
    if (filter?.limit) params.set('limit', String(filter.limit))

    const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users?${params}`, {
      credentials: 'include'
    })
    return res.json()
  }

  const getUserDetail = async (userId: string): Promise<AdminUserResponse> => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/${userId}`, {
      credentials: 'include'
    })
    return res.json()
  }

  const updateUserRole = async (userId: string, role: 'CUSTOMER' | 'SELLER' | 'ADMIN') => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role })
    })
    return res.json()
  }

  const deleteUser = async (userId: string) => {
    const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return res.json()
  }

  return { getStats, getUsers, getUserDetail, updateUserRole, deleteUser }
}
```

---

## 🛠️ API Client Setup

### Axios Instance (Recommended)

```typescript
// lib/api-client.ts
import axios from 'axios'
import { API_CONFIG } from '@/config/api'

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Important for cookies!
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      try {
        const refreshRes = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        if (refreshRes.data.success) {
          localStorage.setItem('accessToken', refreshRes.data.data.accessToken)
          // Retry original request
          error.config.headers.Authorization = `Bearer ${refreshRes.data.data.accessToken}`
          return axios(error.config)
        }
      } catch {
        // Redirect to login
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

---

## 📋 Response Format

### Success Response

```typescript
{
  success: true,
  message: "Pesan sukses",
  data: { ... }
}
```

### Error Response

```typescript
{
  success: false,
  message: "Pesan error",
  error: {
    code: "ERROR_CODE",
    details: null | { ... }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Not logged in |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `ALREADY_EXISTS` | 400 | Duplicate entry |
| `BAD_REQUEST` | 400 | Invalid input |
| `VALIDATION_ERROR` | 400 | Validation failed |

---

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@marketplace.com | admin123 |
| Seller | seller@marketplace.com | seller123 |
| Customer | customer@marketplace.com | customer123 |

---

## 📊 Summary

| Module | Endpoints | Public | Auth | Admin Only |
|--------|-----------|--------|------|------------|
| Auth | 12 | 8 | 4 | 0 |
| Profile | 3 | 0 | 3 | 0 |
| Store | 5 | 1 | 4 | 0 |
| Products | 7 | 4 | 3 | 0 |
| Categories | 4 | 2 | 0 | 2 |
| Cart | 5 | 0 | 5 | 0 |
| Orders | 6 | 0 | 6 | 0 |
| Reviews | 4 | 1 | 3 | 0 |
| Admin | 5 | 0 | 0 | 5 |
| **Total** | **51** | **16** | **28** | **7** |
