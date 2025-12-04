# King Jawir Marketplace - Frontend

Next.js 16 frontend aplikasi marketplace dengan AI-powered price analysis.

## 🏗️ Struktur Folder

```
apps/web/
├── app/                    # Next.js App Router
│   ├── auth/              # Login, Register
│   ├── products/          # Product listing & detail
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order history
│   ├── profile/           # User profile
│   ├── stores/            # Store pages
│   ├── seller/            # Seller dashboard
│   ├── admin/             # Admin dashboard
│   └── price-analysis/    # AI price analysis
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useCart.ts         # Cart management hook
│   └── index.ts           # Hook exports
├── lib/                   # Utilities & configurations
│   ├── api/               # API client & services
│   │   ├── client.ts      # Base API client
│   │   ├── services.ts    # All API services
│   │   └── index.ts       # API exports
│   └── config/            # Configuration files
│       └── api.ts         # API endpoints & config
├── types/                 # TypeScript types
│   └── index.ts           # All types
├── .env.example           # Environment template
└── package.json           # Dependencies
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
bun install

# Copy environment
cp .env.example .env.local

# Run dev server
bun run dev
```

Frontend: http://localhost:4102

### Environment Setup

```env
NEXT_PUBLIC_API_URL=http://localhost:4101
```

## 📡 API Integration

### Centralized API Client

```typescript
import { productService, cartService, authService } from '@/lib/api'

// Get products
const response = await productService.getAll({ page: 1, limit: 10 })

// Add to cart  
await cartService.addItem({ productId: 'xxx', quantity: 1 })

// Login
await authService.login({ email: '...', password: '...' })
```

### Available Services

- `authService` - Login, register, logout, me
- `productService` - Product CRUD & listing
- `categoryService` - Category operations
- `storeService` - Store operations
- `cartService` - Cart management
- `orderService` - Order operations
- `reviewService` - Review CRUD
- `profileService` - User profile

### Error Handling

```typescript
import { isApiError, handleApiError } from '@/lib/api'

try {
  await productService.getAll()
} catch (error) {
  const message = handleApiError(error)
  alert(message)
}
```

## 🎣 Custom Hooks

### useAuth

```typescript
import { useAuth } from '@/hooks'

const { user, login, logout, isAuthenticated } = useAuth()

await login({ email: '...', password: '...' })
```

### useCart

```typescript
import { useCart } from '@/hooks'

const { items, totalItems, totalPrice, addItem, fetchCart } = useCart()

useEffect(() => {
  fetchCart()
}, [fetchCart])
```

## 📦 TypeScript Types

```typescript
import type { User, Product, Order, CartItem } from '@/types'
```

Main types:
- `User` - User with role
- `Product` - Product with category & store
- `CartItem` - Cart item
- `Order` - Order with items
- `ApiResponse<T>` - API wrapper
- `PaginatedResponse<T>` - Paginated data

## 🎨 Styling

- **TailwindCSS v4** - Utility-first CSS
- **Dark Mode** - Full support
- **Responsive** - Mobile-first
- **Modern Effects** - Gradients & shadows

```tsx
<div className="bg-gradient-to-r from-blue-500 to-blue-600 
                dark:from-blue-600 dark:to-blue-700
                rounded-xl shadow-lg hover:scale-105 transition-all">
  Button
</div>
```

## 📱 Pages

**Public:**
- `/` - Homepage
- `/products` - Product listing
- `/auth/login` - Login

**Protected:**
- `/cart` - Shopping cart
- `/orders` - Order history
- `/profile` - User profile

**Seller:**
- `/seller/store` - Manage store
- `/seller/products` - Manage products

**Admin:**
- `/admin` - Dashboard
- `/admin/users` - User management

## 🔧 Commands

```bash
bun run dev         # Development
bun run build       # Build production
bun run start       # Start production
bun run lint        # Linting
```

## 📝 Best Practices

1. ✅ Use centralized API client
2. ✅ Import types from `@/types`
3. ✅ Handle errors with `handleApiError()`
4. ✅ Use custom hooks (`useAuth`, `useCart`)
5. ✅ Support dark mode (`dark:` classes)
6. ✅ Mobile responsive design

## 🐛 Troubleshooting

**API Not Connecting:**
```bash
# Check API status
curl http://localhost:4101

# Verify environment
echo $NEXT_PUBLIC_API_URL
```

**CORS Errors:**
Pastikan API allows origin `http://localhost:4102`

**Cookie Not Sent:**
- Gunakan `credentials: 'include'`
- Check SameSite cookie settings

## 🔗 Links

- [API Docs](../api/README.md)
- [Root README](../../README.md)
