# Admin Dashboard - King Jawir (UPDATED)

Panel admin lengkap untuk mengelola users, categories, products, orders, dan stores di platform King Jawir Marketplace.

## 📁 Struktur File

```
apps/web/
├── app/
│   └── admin/
│       ├── layout.tsx              # Layout dengan navigasi admin
│       ├── page.tsx                # Dashboard utama (statistik)
│       ├── users/
│       │   ├── page.tsx            # List semua users
│       │   └── [id]/
│       │       └── page.tsx        # Detail user & actions
│       ├── categories/
│       │   └── page.tsx            # List semua categories
│       ├── products/
│       │   └── page.tsx            # Browse semua products
│       ├── orders/
│       │   └── page.tsx            # List semua orders
│       └── stores/
│           └── page.tsx            # List semua stores
├── lib/
│   └── api/
│       └── admin.ts                # API client untuk admin endpoints
└── components/
    └── ui/
        └── index.tsx               # Komponen UI reusable
```

## 🎯 Fitur yang Tersedia

### 1. Dashboard Admin (`/admin`)
- **Overview Statistics**:
  - Total Users
  - Total Sellers
  - Total Products
  - Total Orders
  - Total Revenue
- **Orders by Status**: Breakdown order berdasarkan status
- **Recent Orders**: 5 pesanan terbaru
- **Top Selling Products**: Produk terlaris dengan jumlah penjualan
- **Quick Actions**: Navigasi cepat ke management pages

### 2. User Management (`/admin/users`)
- **List Users** dengan:
  - Pagination (10 users per page)
  - Search by name or email
  - Filter by role (CUSTOMER, SELLER, ADMIN)
- **User Information**:
  - Avatar, name, email
  - Role badge
  - Store info (untuk seller)
  - Order count
  - Email verification status
  - Join date

### 3. User Detail (`/admin/users/[id]`)
- **Detail User**:
  - Profile lengkap (avatar, name, email, phone, address, bio)
  - Store information (jika seller)
  - Statistics (orders, reviews, cart items)
- **Actions**:
  - **Change Role**: Update role user (CUSTOMER, SELLER, ADMIN)
  - **Delete User**: Hapus user dan semua data terkait

### 4. Categories Management (`/admin/categories`) ✨ NEW
- **View All Categories**
- **Search** by category name
- **Display Info**:
  - Category name
  - Category slug
- **Data Source**: Public endpoint `GET /categories`

### 5. Products Management (`/admin/products`) ✨ NEW
- **Browse Products** dengan:
  - Pagination (20 products per page)
  - Search by product name
  - Filter by category
- **Product Information**:
  - Product image
  - Product name & slug
  - Category badge
  - Store & seller info
  - Price
  - Stock status badge (green/red)
- **Data Source**: Public endpoint `GET /products`

### 6. Orders Management (`/admin/orders`) ✨ NEW
- **Order Statistics** by status (PENDING, PAID, SHIPPED, DONE, CANCELLED)
- **Recent Orders List**
- **Filter by Status**
- **Order Information**:
  - Order ID
  - Customer name & email
  - Status badge (color-coded)
  - Total amount
  - Order date & time
- **Data Source**: Stats endpoint `GET /admin/stats` (recent orders)

### 7. Stores Management (`/admin/stores`) ✨ NEW
- **View All Stores**
- **Search** by store name, owner name, or owner email
- **Store Information**:
  - Store name & slug
  - Owner name & email
  - Product count
  - Creation date
- **Data Source**: Public endpoint `GET /stores`

## 🔗 Backend Endpoints

### Admin Endpoints (Require JWT + ADMIN Role)
1. `GET /admin/users` - List users dengan filter
2. `GET /admin/users/:id` - Detail user
3. `PUT /admin/users/:id/role` - Update role user
4. `DELETE /admin/users/:id` - Delete user
5. `GET /admin/stats` - Dashboard statistics

### Public Endpoints (Used by Admin Dashboard)
6. `GET /categories` - List all categories
7. `GET /products` - List products dengan pagination & filter
8. `GET /stores` - List all stores

## 🚀 Cara Menggunakan

### 1. Setup Environment Variable

Tambahkan di `apps/web/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4101
```

### 2. Start Servers

```bash
# Terminal 1 - Backend API
cd apps/api
bun run dev  # Port 4101

# Terminal 2 - Frontend
cd apps/web
bun run dev  # Port 4102
```

### 3. Akses Admin Panel

1. **⚠️ Login Required**: Currently no login page, need to:
   - Login via backend API first
   - Store JWT token in `localStorage` as `accessToken`
   - Ensure user has `ADMIN` role
2. Buka `http://localhost:4102/admin`
3. Navigate menggunakan top navigation bar:
   - Dashboard | Users | Categories | Products | Orders | Stores

## 🎨 Komponen UI Reusable

File `components/ui/index.tsx` menyediakan:

### Layout Components
- `Card` - Card container untuk content
- `Modal` - Modal wrapper generik
- `ConfirmModal` - Modal konfirmasi dengan action

### Display Components
- `Badge` - Badge dengan berbagai warna:
  - `blue` - Info/Shipped
  - `green` - Success/Done
  - `red` - Error/Cancelled
  - `yellow` - Warning/Pending
  - `purple` - Secondary/Paid
  - `gray` - Default
- `Alert` - Alert box (success, error, warning, info)
- `LoadingSpinner` - Loading indicator (sm, md, lg)
- `EmptyState` - Empty state placeholder

### Interactive Components
- `Button` - Button dengan variants

## 🔐 Authorization

### Admin Endpoints
Semua endpoint `/admin/*` memerlukan:
- **Authentication**: Bearer token di header `Authorization: Bearer <token>`
- **Authorization**: User role harus `ADMIN`

### Public Endpoints
Endpoints `/categories`, `/products`, `/stores` tidak perlu auth (accessible oleh semua)

Frontend menggunakan:
```typescript
const token = localStorage.getItem('accessToken')
```

## 📊 Data Flow

```
Frontend (Next.js)
    ↓
lib/api/admin.ts (API Client)
    ↓
Backend API (Elysia.js) - Port 4101
    ↓
Database (MySQL via Prisma)
```

## 🎯 Implementation Approach

**Opsi 1: Minimal (Currently Implemented)** ✅
- Menggunakan public endpoints yang sudah ada
- Tidak perlu ubah backend sama sekali
- Categories, Products, Orders (recent), Stores tampil dari API public
- Cocok untuk view-only admin dashboard

**Opsi 2: Full Control (Future)**
- Tambah endpoint admin khusus: `/admin/categories`, `/admin/products`, `/admin/orders`
- Dengan pagination, search, filter lengkap
- Admin bisa delete products, orders, stores
- Perlu update backend

## 📝 Next Steps

### High Priority
1. **Authentication UI**:
   - Create `/admin/login` page
   - Implement login with backend `/auth/login`
   - Store JWT token in localStorage
   - Protected routes (redirect to login if not authenticated)

2. **Authorization Check**:
   - Middleware to check ADMIN role
   - Redirect non-admin users
   - Show error message for forbidden access

### Medium Priority
3. **Enhanced Features**:
   - Logout button in admin layout
   - Current admin user display in header
   - Refresh button for statistics
   - Export data to CSV

4. **Better Data Management**:
   - Full pagination for Orders (currently limited to recent)
   - Full CRUD for Categories (add/edit/delete)
   - Product management (edit/delete)
   - Store management (suspend/delete)

### Low Priority
5. **Advanced Features**:
   - Bulk actions
   - Advanced filtering
   - Real-time statistics
   - Analytics charts
   - Email notifications
   - Activity logs

## 💡 Tips Development

1. **Konsistensi UI**: Selalu gunakan komponen dari `components/ui/index.tsx`
2. **API Calls**: Semua di-handle di `lib/api/admin.ts`, jangan direct fetch
3. **Error Handling**: Sudah ada try-catch di semua async operations
4. **Loading States**: Implement loading spinner di setiap fetch
5. **Type Safety**: Gunakan TypeScript types dari `lib/api/admin.ts`
6. **Return Types**: Semua function harus punya explicit return type
7. **Badge Colors**: Gunakan value yang valid (blue, green, red, yellow, purple, gray)
8. **Images**: Gunakan `next/image` bukan `<img>` tag

## 🐛 Known Issues

1. **No Authentication**: Frontend belum punya login page
2. **Orders Limited**: Hanya tampil recent orders (5 terakhir) dari stats
3. **No CRUD**: Categories, Products, Stores cuma bisa view (read-only)
4. **No Pagination**: Categories & Stores return semua data tanpa pagination

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS
- **Images**: Next.js Image optimization
- **API**: Fetch API with Bearer token
- **State**: React useState & useEffect
- **Backend**: Elysia.js + Prisma + MySQL

## 📚 Documentation

Untuk detail API endpoints, lihat:
- Backend: `apps/api/admin/index.ts`
- Frontend Types: `apps/web/lib/api/admin.ts`
- UI Components: `apps/web/components/ui/index.tsx`

---

**Status**: ✅ Complete - Opsi 1 (Minimal) Implemented
**Last Updated**: December 3, 2025
