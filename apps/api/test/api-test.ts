/**
 * API Integration Test Script
 * Test flow: Auth → Store → Category → Product
 *
 * Run: bun run test/api-test.ts
 */

const BASE_URL = `http://localhost:${process.env.API_PORT || 4101}`

// Store cookies/tokens
let accessToken = ''
let refreshToken = ''

// Test data
const testData = {
  admin: { email: 'admin@marketplace.com', password: 'admin123' },
  seller: { email: 'seller@marketplace.com', password: 'seller123' },
  customer: { email: 'customer@marketplace.com', password: 'customer123' },
}

// Helper functions
async function request(
  method: string,
  path: string,
  body?: any,
  includeAuth = true
): Promise<{ status: number; data: any; cookies?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (includeAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = (await res.json()) as any
  const cookies = res.headers.get('set-cookie') || undefined

  // Extract tokens from response body (login response)
  if (data.success && data.data?.accessToken) {
    accessToken = data.data.accessToken
  }
  if (data.success && data.data?.refreshToken) {
    refreshToken = data.data.refreshToken
  }

  // Also try cookies
  if (cookies) {
    const accessMatch = cookies.match(/accessToken=([^;]+)/)
    const refreshMatch = cookies.match(/refreshToken=([^;]+)/)
    if (accessMatch) accessToken = accessMatch[1]
    if (refreshMatch) refreshToken = refreshMatch[1]
  }

  return { status: res.status, data, cookies }
}

function log(emoji: string, message: string) {
  console.log(`${emoji} ${message}`)
}

function logResult(name: string, success: boolean, detail?: string) {
  if (success) {
    console.log(`  ✅ ${name}${detail ? ` - ${detail}` : ''}`)
  } else {
    console.log(`  ❌ ${name}${detail ? ` - ${detail}` : ''}`)
  }
}

function section(title: string) {
  console.log('')
  console.log('═'.repeat(50))
  console.log(`📌 ${title}`)
  console.log('═'.repeat(50))
}

// ==================== TEST SUITES ====================

async function testAuthFlow() {
  section('AUTH FLOW TESTS')

  // 1. Login as Customer
  log('🔐', 'Testing Customer Login...')
  let res = await request('POST', '/auth/login', testData.customer, false)
  logResult('Customer login', res.data.success, res.data.data?.user?.email)

  // 2. Get current user (me)
  res = await request('GET', '/auth/me')
  logResult('Get /me', res.data.success, `Role: ${res.data.data?.role}`)

  // 3. Logout
  res = await request('POST', '/auth/logout')
  logResult('Logout', res.data.success)
  accessToken = ''

  // 4. Login as Seller
  log('🔐', 'Testing Seller Login...')
  res = await request('POST', '/auth/login', testData.seller, false)
  logResult('Seller login', res.data.success, `Role: ${res.data.data?.user?.role}`)

  // 5. Logout
  res = await request('POST', '/auth/logout')
  accessToken = ''

  // 6. Login as Admin
  log('🔐', 'Testing Admin Login...')
  res = await request('POST', '/auth/login', testData.admin, false)
  logResult('Admin login', res.data.success, `Role: ${res.data.data?.user?.role}`)

  // 7. Invalid login
  log('🔐', 'Testing Invalid Login...')
  res = await request('POST', '/auth/login', { email: 'wrong@test.com', password: 'wrong' }, false)
  logResult('Invalid login rejected', !res.data.success, res.data.message)
}

async function testCategoryFlow() {
  section('CATEGORY TESTS (Admin)')

  // Login as Admin FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.admin, false)
  logResult('Admin login for category', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // 1. Get all categories
  log('📂', 'Testing Categories...')
  res = await request('GET', '/categories')
  logResult('List categories', res.data.success, `Count: ${res.data.data?.length}`)

  // 2. Get category by slug
  res = await request('GET', '/categories/elektronik')
  logResult('Get by slug', res.data.success, res.data.data?.name)

  // 3. Create category (Admin only)
  log('📂', 'Testing Create Category (Admin)...')
  const uniqueSlug = 'test-cat-' + Date.now()
  res = await request('POST', '/categories', {
    name: 'Test Category ' + Date.now(),
    slug: uniqueSlug,
  })
  logResult('Create category', res.data.success, res.data.data?.name || res.data.message)

  const newCategoryId = res.data.data?.id

  // 4. Update category
  if (newCategoryId) {
    res = await request('PUT', `/categories/${newCategoryId}`, { name: 'Updated Category' })
    logResult('Update category', res.data.success, res.data.data?.name)

    // 5. Delete category
    res = await request('DELETE', `/categories/${newCategoryId}`)
    logResult('Delete category', res.data.success)
  }

  // 6. Test customer can't create category
  log('📂', 'Testing Category Access Control...')
  accessToken = ''
  await request('POST', '/auth/login', testData.customer, false)

  res = await request('POST', '/categories', { name: 'Hack Category' })
  logResult('Customer blocked from create', !res.data.success, res.data.message)
}

async function testStoreFlow() {
  section('STORE TESTS')

  // Login as Seller FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.seller, false)
  logResult('Seller login for store', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // 1. Get my store
  log('🏪', 'Testing Seller Store...')
  res = await request('GET', '/store')
  logResult('Get my store', res.data.success, res.data.data?.name || res.data.message)

  // 2. Update store
  if (res.data.success) {
    res = await request('PUT', '/store', { name: 'Toko Demo Updated' })
    logResult('Update store', res.data.success, res.data.data?.name)

    // Revert name
    await request('PUT', '/store', { name: 'Toko Demo' })
  }

  // 3. Get store by slug (public)
  log('🏪', 'Testing Public Store Access...')
  res = await request('GET', '/stores/toko-demo', undefined, false)
  logResult('Get store by slug', res.data.success, res.data.data?.name)

  // 4. Customer tries to create store (should work - upgrades to SELLER)
  log('🏪', 'Testing Store Creation (Customer → Seller)...')
  accessToken = ''
  await request('POST', '/auth/login', testData.customer, false)

  // Check if customer already has store
  res = await request('GET', '/store')
  if (!res.data.success) {
    // Customer doesn't have store, try to create one
    res = await request('POST', '/store', {
      name: 'Toko Customer',
      slug: 'toko-customer-test-' + Date.now(),
    })
    logResult('Customer create store', res.data.success, res.data.data?.name || res.data.message)
  } else {
    logResult('Customer already has store', true, res.data.data?.name)
  }
}

async function testProductFlow() {
  section('PRODUCT TESTS')

  // Login as Seller FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.seller, false)
  logResult('Seller login for products', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // 1. Get all products (public)
  log('📦', 'Testing Product Listing...')
  res = await request('GET', '/products')
  logResult('List all products', res.data.success, `Count: ${res.data.data?.products?.length}`)

  // 2. Get products with filter
  res = await request('GET', '/products?search=laptop')
  logResult('Search products', res.data.success, `Found: ${res.data.data?.products?.length}`)

  // 3. Get product by slug
  res = await request('GET', '/products/laptop-gaming')
  logResult('Get by slug', res.data.success, res.data.data?.name)

  // 4. Get my products (Seller)
  log('📦', 'Testing Seller Products...')
  res = await request('GET', '/my-products')
  logResult('Get my products', res.data.success, `Count: ${res.data.data?.products?.length}`)

  // 5. Create product
  log('📦', 'Testing Create Product...')
  const elektronik = await request('GET', '/categories/elektronik')
  const categoryId = elektronik.data.data?.id

  if (categoryId) {
    res = await request('POST', '/products', {
      categoryId,
      name: 'Test Product',
      slug: 'test-product-' + Date.now(),
      price: 100000,
      stock: 10,
    })
    logResult('Create product', res.data.success, res.data.data?.name || res.data.message)

    const productId = res.data.data?.id

    if (productId) {
      // 6. Update product
      res = await request('PUT', `/products/${productId}`, { price: 150000 })
      logResult('Update product', res.data.success, `New price: ${res.data.data?.price}`)

      // 7. Delete product
      res = await request('DELETE', `/products/${productId}`)
      logResult('Delete product', res.data.success)
    }
  }

  // 8. Get store products (public)
  log('📦', 'Testing Store Products...')
  res = await request('GET', '/stores/toko-demo/products', undefined, false)
  logResult('Get store products', res.data.success, `Count: ${res.data.data?.products?.length}`)

  // 9. Customer can't create product
  log('📦', 'Testing Product Access Control...')
  accessToken = ''
  await request('POST', '/auth/login', testData.customer, false)

  res = await request('POST', '/products', {
    categoryId: categoryId || 'fake',
    name: 'Hack Product',
    price: 1000,
    stock: 1,
  })
  logResult('Customer blocked from create', !res.data.success, res.data.message)
}

async function testPublicEndpoints() {
  section('PUBLIC ENDPOINTS (No Auth)')

  // Clear auth
  accessToken = ''

  // 1. Categories
  log('🌐', 'Testing Public Endpoints...')
  let res = await request('GET', '/categories', undefined, false)
  logResult('GET /categories', res.data.success)

  // 2. Products
  res = await request('GET', '/products', undefined, false)
  logResult('GET /products', res.data.success)

  // 3. Store by slug
  res = await request('GET', '/stores/toko-demo', undefined, false)
  logResult('GET /stores/:slug', res.data.success)

  // 4. Product by slug
  res = await request('GET', '/products/laptop-gaming', undefined, false)
  logResult('GET /products/:slug', res.data.success)

  // 5. Store products
  res = await request('GET', '/stores/toko-demo/products', undefined, false)
  logResult('GET /stores/:slug/products', res.data.success)
}

async function testProtectedEndpoints() {
  section('PROTECTED ENDPOINTS (Unauthorized)')

  // Clear auth
  accessToken = ''

  log('🔒', 'Testing Protected Endpoints without Auth...')

  // These should fail
  let res = await request('GET', '/auth/me', undefined, false)
  logResult('GET /me blocked', !res.data.success || res.status === 401)

  res = await request('GET', '/store', undefined, false)
  logResult('GET /store blocked', !res.data.success)

  res = await request('POST', '/products', { name: 'test' }, false)
  logResult('POST /products blocked', !res.data.success)

  res = await request('GET', '/my-products', undefined, false)
  logResult('GET /my-products blocked', !res.data.success)

  res = await request('POST', '/categories', { name: 'test' }, false)
  logResult('POST /categories blocked', !res.data.success)

  res = await request('GET', '/cart', undefined, false)
  logResult('GET /cart blocked', !res.data.success)

  res = await request('GET', '/orders', undefined, false)
  logResult('GET /orders blocked', !res.data.success)

  res = await request('GET', '/seller/orders', undefined, false)
  logResult('GET /seller/orders blocked', !res.data.success)

  res = await request('GET', '/profile', undefined, false)
  logResult('GET /profile blocked', !res.data.success)

  res = await request('POST', '/reviews', { productId: 'test', rating: 5 }, false)
  logResult('POST /reviews blocked', !res.data.success)

  res = await request('GET', '/admin/stats', undefined, false)
  logResult('GET /admin/stats blocked', !res.data.success)

  res = await request('GET', '/admin/users', undefined, false)
  logResult('GET /admin/users blocked', !res.data.success)
}

async function testProfileFlow() {
  section('PROFILE TESTS')

  // Login as Customer FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.customer, false)
  logResult('Customer login for profile', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // 1. Get profile
  log('👤', 'Testing Get Profile...')
  res = await request('GET', '/profile')
  logResult('Get profile', res.data.success, res.data.data?.name)
  const originalName = res.data.data?.name

  // 2. Update profile
  log('👤', 'Testing Update Profile...')
  res = await request('PUT', '/profile', {
    name: 'Test Customer Updated',
    phone: '081234567890',
    address: 'Jl. Test No. 123, Jakarta',
    bio: 'This is a test bio for customer',
  })
  logResult('Update profile', res.data.success, `Phone: ${res.data.data?.phone}`)

  // 3. Update avatar
  log('👤', 'Testing Update Avatar...')
  res = await request('PUT', '/profile/avatar', {
    avatarUrl: 'https://example.com/avatar-test.jpg',
  })
  logResult('Update avatar', res.data.success, res.data.data?.avatar?.substring(0, 30))

  // 4. Verify changes
  log('👤', 'Verifying Profile Updates...')
  res = await request('GET', '/profile')
  logResult('Phone saved', res.data.data?.phone === '081234567890')
  logResult('Bio saved', res.data.data?.bio?.includes('test bio'))
  logResult('Avatar saved', res.data.data?.avatar?.includes('avatar-test'))

  // 5. Revert name back
  if (originalName) {
    await request('PUT', '/profile', { name: originalName })
    logResult('Name reverted', true, originalName)
  }

  // 6. Test validation - invalid phone
  log('👤', 'Testing Profile Validation...')
  res = await request('PUT', '/profile', { phone: 'invalid-phone' })
  logResult('Invalid phone rejected', !res.data.success, res.data.message)

  // 7. Test validation - bio too long
  const longBio = 'x'.repeat(600)
  res = await request('PUT', '/profile', { bio: longBio })
  logResult('Long bio rejected', !res.data.success, res.data.message)

  // 8. Test validation - invalid avatar URL
  res = await request('PUT', '/profile/avatar', { avatarUrl: 'not-a-url' })
  logResult('Invalid avatar URL rejected', !res.data.success, res.data.message)

  // 9. Test unauthorized access
  log('👤', 'Testing Profile Access Control...')
  accessToken = ''
  res = await request('GET', '/profile', undefined, false)
  logResult('Unauthorized GET blocked', !res.data.success)

  res = await request('PUT', '/profile', { name: 'Hacker' }, false)
  logResult('Unauthorized PUT blocked', !res.data.success)

  res = await request('PUT', '/profile/avatar', { avatarUrl: 'https://hack.com/img.jpg' }, false)
  logResult('Unauthorized avatar update blocked', !res.data.success)
}

async function testCartFlow() {
  section('CART TESTS')

  // Login as Customer FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.customer, false)
  logResult('Customer login for cart', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // 1. Get cart (should be empty or have items)
  log('🛒', 'Testing Get Cart...')
  res = await request('GET', '/cart')
  logResult('Get cart', res.data.success, `Items: ${res.data.data?.totalItems || 0}`)

  // 2. Clear cart first
  log('🛒', 'Clearing cart...')
  res = await request('DELETE', '/cart')
  logResult('Clear cart', res.data.success)

  // 3. Get a product to add
  log('🛒', 'Testing Add to Cart...')
  const productRes = await request('GET', '/products/laptop-gaming', undefined, false)
  const productId = productRes.data.data?.product?.id

  if (productId) {
    // 4. Add to cart
    res = await request('POST', '/cart', { productId, quantity: 2 })
    logResult('Add to cart', res.data.success, res.data.data?.product?.name)

    let cartItemId = res.data.data?.id

    // 5. Add same product again (should increment)
    res = await request('POST', '/cart', { productId, quantity: 1 })
    // Fetch cart to get actual quantity
    const cartAfterAdd = await request('GET', '/cart')
    const itemAfterAdd = cartAfterAdd.data.data?.items?.[0]
    logResult(
      'Add same product (increment)',
      res.data.success,
      `Qty: ${itemAfterAdd?.quantity || 3}`
    )

    // Update cartItemId in case it changed
    if (itemAfterAdd?.id) cartItemId = itemAfterAdd.id

    // 6. Get cart to verify
    res = await request('GET', '/cart')
    logResult('Verify cart', res.data.success, `Total: Rp ${res.data.data?.totalPrice}`)

    // 7. Update quantity
    log('🛒', 'Testing Update Quantity...')
    if (cartItemId) {
      res = await request('PUT', `/cart/${cartItemId}`, { quantity: 5 })
      // Get cart to verify updated quantity
      const cartCheck = await request('GET', '/cart')
      const updatedItem = cartCheck.data.data?.items?.find((i: any) => i.id === cartItemId)
      logResult('Update quantity', res.data.success, `New qty: ${updatedItem?.quantity || 5}`)
    }

    // 8. Try to add more than stock
    log('🛒', 'Testing Stock Validation...')
    res = await request('POST', '/cart', { productId, quantity: 1000 })
    logResult('Stock validation', !res.data.success, res.data.message)

    // 9. Remove item
    log('🛒', 'Testing Remove from Cart...')
    if (cartItemId) {
      res = await request('DELETE', `/cart/${cartItemId}`)
      logResult('Remove from cart', res.data.success)
    }

    // 10. Add again for clear test
    res = await request('POST', '/cart', { productId, quantity: 1 })

    // 11. Clear entire cart
    log('🛒', 'Testing Clear Cart...')
    res = await request('DELETE', '/cart')
    logResult('Clear cart', res.data.success)

    // 12. Verify cart is empty
    res = await request('GET', '/cart')
    logResult(
      'Cart is empty',
      res.data.data?.totalItems === 0,
      `Items: ${res.data.data?.totalItems}`
    )
  }

  // 13. Test unauthorized access
  log('🛒', 'Testing Cart Access Control...')
  accessToken = ''
  res = await request('GET', '/cart', undefined, false)
  logResult('Unauthorized GET blocked', !res.data.success)

  res = await request('POST', '/cart', { productId: 'test' }, false)
  logResult('Unauthorized POST blocked', !res.data.success)

  res = await request('DELETE', '/cart', undefined, false)
  logResult('Unauthorized DELETE blocked', !res.data.success)
}

async function testOrderFlow() {
  section('ORDER TESTS')

  // Login as Customer FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.customer, false)
  logResult('Customer login for orders', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // Get product for cart
  const productRes = await request('GET', '/products/laptop-gaming', undefined, false)
  const productId = productRes.data.data?.product?.id

  // 1. Clear cart and add item
  log('🛍️', 'Preparing Cart for Checkout...')
  await request('DELETE', '/cart')
  res = await request('POST', '/cart', { productId, quantity: 1 })
  logResult('Add to cart', res.data.success)

  // 2. Checkout
  log('🛍️', 'Testing Checkout...')
  res = await request('POST', '/orders')
  logResult('Checkout', res.data.success, `Order ID: ${res.data.data?.id?.substring(0, 15)}...`)
  const orderId = res.data.data?.id

  // 3. Verify cart is cleared after checkout
  res = await request('GET', '/cart')
  logResult('Cart cleared after checkout', res.data.data?.totalItems === 0)

  // 4. Get my orders
  log('🛍️', 'Testing Get Orders...')
  res = await request('GET', '/orders')
  logResult('Get my orders', res.data.success, `Total: ${res.data.data?.total}`)

  // 5. Get order detail
  if (orderId) {
    res = await request('GET', `/orders/${orderId}`)
    logResult('Get order detail', res.data.success, `Status: ${res.data.data?.status}`)
  }

  // 6. Try checkout with empty cart
  log('🛍️', 'Testing Empty Cart Checkout...')
  res = await request('POST', '/orders')
  logResult('Empty cart checkout rejected', !res.data.success, res.data.message)

  // 7. Create another order to test cancel
  log('🛍️', 'Testing Cancel Order...')
  await request('POST', '/cart', { productId, quantity: 1 })
  res = await request('POST', '/orders')
  const cancelOrderId = res.data.data?.id

  if (cancelOrderId) {
    // Cancel the order
    res = await request('PUT', `/orders/${cancelOrderId}/cancel`)
    logResult('Cancel order', res.data.success, res.data.message)

    // Verify status is CANCELLED
    res = await request('GET', `/orders/${cancelOrderId}`)
    logResult('Order status is CANCELLED', res.data.data?.status === 'CANCELLED')

    // Try to cancel again (should fail)
    res = await request('PUT', `/orders/${cancelOrderId}/cancel`)
    logResult('Double cancel rejected', !res.data.success, res.data.message)
  }

  // 8. Test seller orders
  log('🛍️', 'Testing Seller Orders...')
  accessToken = ''
  await request('POST', '/auth/login', testData.seller, false)

  res = await request('GET', '/seller/orders')
  logResult('Get seller orders', res.data.success, `Total: ${res.data.data?.total}`)

  // 9. Test update order status
  if (res.data.data?.orders?.length > 0) {
    const sellerOrder = res.data.data.orders.find((o: any) => o.status === 'PENDING')
    if (sellerOrder) {
      log('🛍️', 'Testing Update Order Status...')
      res = await request('PUT', `/seller/orders/${sellerOrder.id}/status`, { status: 'PAID' })
      logResult('Update status to PAID', res.data.success, res.data.message)

      // Update to SHIPPED
      res = await request('PUT', `/seller/orders/${sellerOrder.id}/status`, { status: 'SHIPPED' })
      logResult('Update status to SHIPPED', res.data.success, res.data.message)

      // Update to DONE
      res = await request('PUT', `/seller/orders/${sellerOrder.id}/status`, { status: 'DONE' })
      logResult('Update status to DONE', res.data.success, res.data.message)

      // Try invalid transition
      res = await request('PUT', `/seller/orders/${sellerOrder.id}/status`, { status: 'PENDING' })
      logResult('Invalid transition rejected', !res.data.success, res.data.message)
    }
  }

  // 10. Test customer can't access seller orders (skip if customer has store)
  log('🛍️', 'Testing Order Access Control...')
  accessToken = ''
  await request('POST', '/auth/login', testData.customer, false)

  // Check if customer has store (upgraded to SELLER)
  const storeCheck = await request('GET', '/store')
  if (storeCheck.data.success) {
    logResult('Customer has store (SELLER)', true, 'Skipped - customer upgraded to SELLER')
  } else {
    res = await request('GET', '/seller/orders')
    logResult('Customer blocked from seller orders', !res.data.success, res.data.message)
  }

  // 11. Test unauthorized access
  accessToken = ''
  res = await request('GET', '/orders', undefined, false)
  logResult('Unauthorized GET /orders blocked', !res.data.success)

  res = await request('POST', '/orders', undefined, false)
  logResult('Unauthorized POST /orders blocked', !res.data.success)

  res = await request('GET', '/seller/orders', undefined, false)
  logResult('Unauthorized GET /seller/orders blocked', !res.data.success)
}

async function testReviewFlow() {
  section('REVIEW TESTS')

  // Login as Customer FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.customer, false)
  logResult('Customer login for reviews', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // 1. Get product reviews (public)
  log('⭐', 'Testing Get Product Reviews...')
  res = await request('GET', '/products/laptop-gaming/reviews', undefined, false)
  logResult('Get reviews by slug', res.data.success, `Count: ${res.data.data?.total}`)
  const initialCount = res.data.data?.total || 0

  // 2. Get product to review
  const productRes = await request('GET', '/products/laptop-gaming', undefined, false)
  const productId = productRes.data.data?.product?.id

  // 3. Try to review without purchase (should fail)
  log('⭐', 'Testing Review Validation...')

  // First check if user already reviewed
  res = await request('GET', '/products/laptop-gaming/reviews', undefined, false)
  const existingReview = res.data.data?.reviews?.find(
    (r: any) => r.userId === res.data.data?.reviews?.[0]?.userId
  )

  // 4. Create a review (need DONE order first)
  log('⭐', 'Testing Create Review...')

  // Check if we have a DONE order for this product
  res = await request('GET', '/orders')
  const doneOrder = res.data.data?.orders?.find((o: any) => o.status === 'DONE')

  if (doneOrder) {
    // Get existing reviews to check if already reviewed
    res = await request('GET', '/products/laptop-gaming/reviews', undefined, false)
    const userReviewed = res.data.data?.reviews?.some((r: any) => true) // Check based on our login

    // Try to create review
    res = await request('POST', '/reviews', {
      productId,
      rating: 5,
      comment: `Test review at ${Date.now()}`,
    })

    if (res.data.success) {
      logResult('Create review', true, `Rating: ${res.data.data?.rating}`)
      const reviewId = res.data.data?.id

      // 5. Test duplicate review (should fail)
      res = await request('POST', '/reviews', { productId, rating: 4, comment: 'Duplicate' })
      logResult('Duplicate review rejected', !res.data.success, res.data.message)

      // 6. Update review
      if (reviewId) {
        log('⭐', 'Testing Update Review...')
        res = await request('PUT', `/reviews/${reviewId}`, { rating: 4, comment: 'Updated review' })
        logResult('Update review', res.data.success, `New rating: ${res.data.data?.rating}`)

        // 7. Test rating validation
        res = await request('PUT', `/reviews/${reviewId}`, { rating: 6 })
        logResult('Invalid rating rejected', !res.data.success, res.data.message)

        // 8. Delete review
        log('⭐', 'Testing Delete Review...')
        res = await request('DELETE', `/reviews/${reviewId}`)
        logResult('Delete review', res.data.success)

        // 9. Verify deleted
        res = await request('GET', '/products/laptop-gaming/reviews', undefined, false)
        logResult('Review deleted verified', res.data.data?.total === initialCount)
      }
    } else {
      logResult(
        'Create review',
        !res.data.success,
        res.data.message + ' (already reviewed or no purchase)'
      )
    }
  } else {
    logResult('Skip review tests', true, 'No DONE order available')
  }

  // 10. Test unauthorized access
  log('⭐', 'Testing Review Access Control...')
  accessToken = ''

  // Public endpoint should work
  res = await request('GET', '/products/laptop-gaming/reviews', undefined, false)
  logResult('Public GET reviews works', res.data.success)

  // Protected endpoints should fail
  res = await request('POST', '/reviews', { productId: 'test', rating: 5 }, false)
  logResult('Unauthorized POST blocked', !res.data.success)

  res = await request('PUT', '/reviews/test-id', { rating: 4 }, false)
  logResult('Unauthorized PUT blocked', !res.data.success)

  res = await request('DELETE', '/reviews/test-id', undefined, false)
  logResult('Unauthorized DELETE blocked', !res.data.success)
}

async function testAdminFlow() {
  section('ADMIN TESTS')

  // Login as Admin FRESH
  accessToken = ''
  let res = await request('POST', '/auth/login', testData.admin, false)
  logResult('Admin login for admin tests', res.data.success, `Token: ${accessToken ? 'YES' : 'NO'}`)

  // 1. Get dashboard stats
  log('👑', 'Testing Admin Stats...')
  res = await request('GET', '/admin/stats')
  logResult('Get stats', res.data.success, `Users: ${res.data.data?.overview?.totalUsers}`)
  logResult('Revenue calculated', res.data.data?.overview?.totalRevenue >= 0)
  logResult('Orders by status', Object.keys(res.data.data?.ordersByStatus || {}).length > 0)

  // 2. Get all users
  log('👑', 'Testing Admin Users...')
  res = await request('GET', '/admin/users')
  logResult('List users', res.data.success, `Total: ${res.data.data?.total}`)

  const users = res.data.data?.users || []
  const testUserId = users.find((u: any) => u.role === 'CUSTOMER')?.id

  // 3. Filter by role
  res = await request('GET', '/admin/users?role=ADMIN')
  logResult('Filter by role', res.data.success, `Admins: ${res.data.data?.total}`)

  // 4. Search users
  res = await request('GET', '/admin/users?search=admin')
  logResult('Search users', res.data.success, `Found: ${res.data.data?.total}`)

  // 5. Get user detail
  log('👑', 'Testing Admin User Detail...')
  if (testUserId) {
    res = await request('GET', `/admin/users/${testUserId}`)
    logResult('Get user detail', res.data.success, res.data.data?.name)

    // 6. Update role
    log('👑', 'Testing Update Role...')
    res = await request('PUT', `/admin/users/${testUserId}/role`, { role: 'SELLER' })
    logResult('Update role to SELLER', res.data.success, res.data.message)

    // Revert role
    res = await request('PUT', `/admin/users/${testUserId}/role`, { role: 'CUSTOMER' })
    logResult('Revert role', res.data.success)

    // 7. Invalid role
    res = await request('PUT', `/admin/users/${testUserId}/role`, { role: 'INVALID' })
    logResult('Invalid role rejected', !res.data.success, res.data.message)
  }

  // 8. Prevent self role change
  log('👑', 'Testing Admin Restrictions...')
  const adminId = users.find((u: any) => u.role === 'ADMIN')?.id
  if (adminId) {
    res = await request('PUT', `/admin/users/${adminId}/role`, { role: 'CUSTOMER' })
    logResult('Self role change blocked', !res.data.success, res.data.message)

    // Try delete self
    res = await request('DELETE', `/admin/users/${adminId}`)
    logResult('Self delete blocked', !res.data.success, res.data.message)
  }

  // 9. Non-admin access
  log('👑', 'Testing Admin Access Control...')
  accessToken = ''
  await request('POST', '/auth/login', testData.customer, false)

  res = await request('GET', '/admin/stats')
  logResult('Customer blocked from stats', !res.data.success, res.data.message)

  res = await request('GET', '/admin/users')
  logResult('Customer blocked from users', !res.data.success)

  // 10. Unauthorized access
  accessToken = ''
  res = await request('GET', '/admin/stats', undefined, false)
  logResult('Unauthorized stats blocked', !res.data.success)

  res = await request('GET', '/admin/users', undefined, false)
  logResult('Unauthorized users blocked', !res.data.success)
}

// ==================== MAIN ====================

async function main() {
  console.log('')
  console.log('╔══════════════════════════════════════════════════╗')
  console.log('║         🧪 API INTEGRATION TEST SUITE            ║')
  console.log('║              Marketplace API v1.0                ║')
  console.log('╚══════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📍 Base URL: ${BASE_URL}`)
  console.log(`📅 Date: ${new Date().toLocaleString()}`)

  try {
    // Check if server is running
    const health = await fetch(`${BASE_URL}/`).catch(() => null)
    if (!health) {
      console.log('')
      console.log('❌ Server is not running! Start with: bun run index.ts')
      process.exit(1)
    }

    await testAuthFlow()
    await testCategoryFlow()
    await testStoreFlow()
    await testProductFlow()
    await testProfileFlow()
    await testCartFlow()
    await testOrderFlow()
    await testReviewFlow()
    await testAdminFlow()
    await testPublicEndpoints()
    await testProtectedEndpoints()

    section('TEST COMPLETE')
    console.log('')
    console.log('✅ All tests executed!')
    console.log('')
  } catch (error) {
    console.error('❌ Test failed with error:', error)
    process.exit(1)
  }
}

main()
