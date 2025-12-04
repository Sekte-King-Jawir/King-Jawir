# Admin Dashboard - King Jawir

Panel admin untuk mengelola users, products, dan orders di platform King Jawir Marketplace.

## 📁 Struktur File

```
apps/web/
├── app/
│   └── admin/
│       ├── layout.tsx          # Layout dengan navigasi admin
│       ├── page.tsx             # Dashboard utama (statistik)
│       └── users/
│           ├── page.tsx         # List semua users
│           └── [id]/
│               └── page.tsx     # Detail user & actions
├── lib/
│   └── api/
│       └── admin.ts             # API client untuk admin endpoints
└── components/
    └── ui/
        └── index.tsx            # Komponen UI reusable
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

## 🔗 Backend Endpoints

Backend API sudah menyediakan endpoint berikut:

1. `GET /admin/users` - List users dengan filter
2. `GET /admin/users/:id` - Detail user
3. `PUT /admin/users/:id/role` - Update role user
4. `DELETE /admin/users/:id` - Delete user
5. `GET /admin/stats` - Dashboard statistics

## 🚀 Cara Menggunakan

### 1. Setup Environment Variable

Tambahkan di `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4101
```

### 2. Akses Admin Panel

1. Login sebagai admin
2. Buka `http://localhost:4102/admin`
3. Gunakan fitur management yang tersedia

## 🎨 Komponen UI Reusable

File `components/ui/index.tsx` menyediakan:

- `Modal` - Modal wrapper generik
- `ConfirmModal` - Modal konfirmasi dengan action
- `LoadingSpinner` - Loading indicator
- `EmptyState` - Empty state placeholder
- `Badge` - Badge dengan berbagai warna
- `Alert` - Alert box (success, error, warning, info)
- `Card` - Card container
- `Button` - Button dengan variants

## 🔐 Authorization

Semua endpoint admin memerlukan:

- **Authentication**: Bearer token di header
- **Authorization**: User role harus `ADMIN`

Frontend menggunakan token dari `localStorage.getItem('accessToken')`.

## 📝 Next Steps

Untuk pengembangan lebih lanjut, bisa ditambahkan:

1. Product Management
2. Order Management
3. Store Management
4. Analytics & Reports
5. Settings & Configuration

## 💡 Tips

- Gunakan komponen dari `components/ui/index.tsx` untuk konsistensi UI
- Semua API calls sudah di-handle di `lib/api/admin.ts`
- Error handling sudah diimplementasikan dengan try-catch
- Loading states tersedia di setiap operasi async
