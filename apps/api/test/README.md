# Unit Tests for King Jawir API

Unit test suite yang lengkap untuk semua API endpoints menggunakan Bun test runner.

## Struktur Test

```
test/
├── auth/           # Tests untuk authentication (login, register)
├── admin/          # Tests untuk admin management
├── cart/           # Tests untuk shopping cart
├── category/       # Tests untuk category management
├── order/          # Tests untuk order processing
├── product/        # Tests untuk product management
├── profile/        # Tests untuk user profile
├── review/         # Tests untuk product reviews
└── store/          # Tests untuk store management
```

## Menjalankan Tests

### Run semua tests
```bash
bun test
```

### Run tests dengan watch mode (auto-reload)
```bash
bun test:watch
```

### Run tests dengan coverage
```bash
bun test:coverage
```

### Run test file spesifik
```bash
bun test test/auth/login.test.ts
```

### Run tests untuk modul tertentu
```bash
bun test test/product/
```

## Coverage

Test suite ini mencakup:

### Auth Module
- ✅ Login (valid credentials, invalid credentials, OAuth users)
- ✅ Register (email validation, password strength, duplicate users)
- ✅ Token generation and refresh
- ✅ Email verification flow

### Product Module
- ✅ Get all products with filters & pagination
- ✅ Get product by slug
- ✅ Create product (with validation)
- ✅ Update product (with ownership check)
- ✅ Delete product
- ✅ Get products by store

### Category Module
- ✅ Get all categories
- ✅ Get category by slug
- ✅ Create category (with slug validation)
- ✅ Update category
- ✅ Delete category

### Store Module
- ✅ Get my store
- ✅ Get store by slug
- ✅ Create store (with role upgrade to SELLER)
- ✅ Update store
- ✅ Slug uniqueness validation

### Cart Module
- ✅ Get cart with calculated totals
- ✅ Add to cart (with stock validation)
- ✅ Update quantity
- ✅ Remove from cart
- ✅ Clear cart
- ✅ Increment existing items

### Order Module
- ✅ Checkout from cart
- ✅ Get user orders
- ✅ Get order detail (with access control)
- ✅ Cancel order (only PENDING)
- ✅ Get seller orders
- ✅ Stock validation during checkout

### Review Module
- ✅ Get product reviews
- ✅ Create review (with purchase verification)
- ✅ Update review (with ownership check)
- ✅ Delete review
- ✅ Rating validation (1-5)
- ✅ Duplicate review prevention

### Profile Module
- ✅ Get user profile
- ✅ Update profile (name, phone, address, bio)
- ✅ Update avatar
- ✅ Phone number format validation
- ✅ Input sanitization

### Admin Module
- ✅ Get all users with filters
- ✅ Get user by ID
- ✅ Update user role
- ✅ Delete user (with restrictions)
- ✅ Get dashboard statistics
- ✅ Self-modification prevention

## Best Practices

### Mocking
Tests menggunakan Bun's built-in mock system untuk dependencies:
```typescript
mock.module('../../repository', () => ({
  repository: {
    findById: mock(),
  },
}))
```

### Test Structure
Setiap test mengikuti pattern:
1. **Arrange**: Setup mock data dan dependencies
2. **Act**: Jalankan function yang di-test
3. **Assert**: Verify hasil dan side effects

### Reset Mocks
Setiap test suite menggunakan `beforeEach` untuk reset mocks:
```typescript
beforeEach(() => {
  ;(repository.findById as any).mockReset()
})
```

## Menambah Tests Baru

1. Buat file test baru di folder yang sesuai
2. Import dependencies dan setup mocks
3. Tulis test cases untuk happy path dan edge cases
4. Validate input, output, dan error handling
5. Test access control dan authorization

Contoh:
```typescript
import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { myService } from '../../path/to/service'

describe('My Service', () => {
  beforeEach(() => {
    // Reset mocks
  })

  describe('myFunction', () => {
    it('should work correctly', async () => {
      // Test implementation
    })
  })
})
```

## Notes

- Tests menggunakan in-memory mocks, tidak memerlukan database
- Semua external dependencies di-mock
- Tests berjalan cepat dan isolated
- Coverage mencakup success cases, error cases, dan edge cases
