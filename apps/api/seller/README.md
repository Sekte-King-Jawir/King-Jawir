# Seller CMS Module

Modul terpisah untuk seller dengan authentication dan product management yang independen dari customer.

> **⚠️ SECURITY:** Semua endpoint seller (kecuali `/api/seller/auth/*`) **WAJIB** dilindungi authentication. Lihat [AUTHENTICATION.md](./AUTHENTICATION.md) untuk detail implementasi.

## Overview

Seller CMS menyediakan sistem lengkap untuk seller mengelola toko dan produk mereka:

- **Authentication terpisah** dari customer (register, login, logout, refresh)
- **Product Management** (CRUD) untuk produk toko seller
- **Store Management** untuk update profile toko
- **🆕 Price Analysis** - AI-powered price analysis sebelum menambah produk

## Documentation

- 📖 [AUTHENTICATION.md](./AUTHENTICATION.md) - Authentication & Authorization pattern
- 📖 [price-analysis/INTEGRATION_GUIDE.md](./price-analysis/INTEGRATION_GUIDE.md) - Price Analysis integration guide

## Endpoints

### Seller Authentication (`/api/seller/auth/*`)

#### 1. Register Seller

**POST** `/api/seller/auth/register`

Register akun seller baru beserta toko.

**Request Body:**

```json
{
  "email": "seller@example.com",
  "password": "password123",
  "name": "John Seller",
  "storeName": "Toko John",
  "storeDescription": "Toko online terbaik" // optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Register seller berhasil. Cek email untuk verifikasi.",
  "data": {
    "user": {
      "id": "...",
      "email": "seller@example.com",
      "name": "John Seller",
      "role": "SELLER",
      "emailVerified": false
    },
    "store": {
      "id": "...",
      "name": "Toko John",
      "slug": "toko-john",
      "description": "Toko online terbaik"
    }
  }
}
```

**Features:**

- Otomatis set role sebagai `SELLER`
- Buat toko sekaligus dengan slug auto-generated
- Kirim email verifikasi
- Validasi email dan store name uniqueness

---

#### 2. Login Seller

**POST** `/api/seller/auth/login`

Login khusus untuk seller dan admin.

**Request Body:**

```json
{
  "email": "seller@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "email": "seller@example.com",
      "name": "John Seller",
      "role": "SELLER"
    }
  }
}
```

**Notes:**

- Hanya user dengan role `SELLER` atau `ADMIN` yang bisa login
- Customer tidak bisa login di endpoint ini
- Tokens disimpan di httpOnly cookies

---

#### 3. Logout Seller

**POST** `/api/seller/auth/logout`

Logout dan hapus refresh token.

**Response:**

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

#### 4. Refresh Token

**POST** `/api/seller/auth/refresh`

Refresh access token menggunakan refresh token.

**Response:**

```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

#### 5. Get Seller Profile

**GET** `/api/seller/auth/me`

**Headers:** `Authorization: Bearer <accessToken>` atau cookie

**Response:**

```json
{
  "success": true,
  "message": "Berhasil mengambil data seller",
  "data": {
    "user": {
      "id": "...",
      "email": "seller@example.com",
      "name": "John Seller",
      "role": "SELLER"
    },
    "store": {
      "id": "...",
      "name": "Toko John",
      "slug": "toko-john",
      "description": "...",
      "logo": "..."
    }
  }
}
```

---

### Seller Product Management (`/api/seller/products/*`)

Semua endpoint memerlukan authentication dan role `SELLER` atau `ADMIN`.

#### 1. List Products

**GET** `/api/seller/products?page=1&limit=20`

Mendapatkan semua produk dari toko seller yang login.

**Response:**

```json
{
  "success": true,
  "message": "Berhasil mengambil produk",
  "data": {
    "products": [
      {
        "id": "...",
        "name": "Product 1",
        "slug": "product-1",
        "price": 100000,
        "stock": 50,
        "image": "...",
        "category": {
          "id": "...",
          "name": "Electronics",
          "slug": "electronics"
        }
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

#### 2. Get Product by ID

**GET** `/api/seller/products/:id`

Mendapatkan detail produk milik seller.

**Response:**

```json
{
  "success": true,
  "message": "Berhasil mengambil produk",
  "data": {
    "id": "...",
    "name": "Product 1",
    "slug": "product-1",
    "description": "...",
    "price": 100000,
    "stock": 50,
    "image": "...",
    "category": { "id": "...", "name": "Electronics" },
    "store": { "id": "...", "name": "Toko John" }
  }
}
```

---

#### 3. Create Product

**POST** `/api/seller/products`

Membuat produk baru untuk toko seller.

**Request Body:**

```json
{
  "categoryId": "cat_123",
  "name": "Laptop Gaming ROG",
  "description": "Laptop gaming dengan spec tinggi",
  "price": 15000000,
  "stock": 10,
  "image": "https://example.com/image.jpg" // optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id": "...",
    "name": "Laptop Gaming ROG",
    "slug": "laptop-gaming-rog",
    "price": 15000000,
    "stock": 10
  }
}
```

**Features:**

- Auto-generate slug dari name
- Jika slug sudah ada, tambahkan random suffix
- Validasi seller harus punya toko

---

#### 4. Update Product

**PUT** `/api/seller/products/:id`

Update produk milik seller.

**Request Body (semua optional):**

```json
{
  "categoryId": "cat_123",
  "name": "Laptop Gaming ROG Updated",
  "description": "New description",
  "price": 14500000,
  "stock": 15,
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Produk berhasil diupdate",
  "data": {
    "id": "...",
    "name": "Laptop Gaming ROG Updated",
    "slug": "laptop-gaming-rog-updated",
    "price": 14500000
  }
}
```

**Features:**

- Validasi ownership: hanya bisa update produk milik sendiri
- Jika name berubah, slug di-regenerate
- Partial update (kirim field yang ingin diubah saja)

---

#### 5. Delete Product

**DELETE** `/api/seller/products/:id`

Hapus produk milik seller.

**Response:**

```json
{
  "success": true,
  "message": "Produk berhasil dihapus",
  "data": null
}
```

**Features:**

- Validasi ownership: hanya bisa hapus produk milik sendiri

---

### Seller Store Management (`/api/seller/store`)

#### 1. Get Store Profile

**GET** `/api/seller/store`

**Response:**

```json
{
  "success": true,
  "message": "Berhasil mengambil data toko",
  "data": {
    "id": "...",
    "name": "Toko John",
    "slug": "toko-john",
    "description": "...",
    "logo": "...",
    "_count": { "products": 25 }
  }
}
```

---

#### 2. Update Store Profile

**PUT** `/api/seller/store`

**Request Body (semua optional):**

```json
{
  "name": "Toko John Updated",
  "description": "Deskripsi baru",
  "logo": "https://example.com/logo.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Toko berhasil diupdate",
  "data": {
    "id": "...",
    "name": "Toko John Updated",
    "slug": "toko-john-updated",
    "description": "Deskripsi baru"
  }
}
```

**Features:**

- Jika name berubah, slug di-regenerate
- Cek uniqueness untuk slug baru

---

### Seller Price Analysis (`/api/seller/price-analysis`) 🆕

Fitur AI-powered price analysis khusus untuk seller sebelum menambahkan produk ke toko.

#### 1. Full Price Analysis

**GET** `/api/seller/price-analysis?productName={name}&userPrice={price}&limit={n}`

Analisis lengkap harga produk dari market (Tokopedia) dengan insights khusus seller.

**Query Parameters:**

- `productName` (required): Nama produk yang ingin dianalisis
- `userPrice` (optional): Harga yang ingin dijual seller
- `limit` (optional): Jumlah produk market untuk analisis (default: 10, max: 50)

**Response:**

```json
{
  "success": true,
  "message": "Analisis harga berhasil",
  "data": {
    "query": "Laptop Gaming ROG",
    "optimizedQuery": "laptop gaming rog",
    "products": [
      {
        "name": "ROG Strix G15",
        "price": "Rp15.999.000",
        "rating": "4.9",
        "sold": "250+",
        "shop_location": "Jakarta Pusat"
      }
      // ... more products
    ],
    "statistics": {
      "min": 12500000,
      "max": 22000000,
      "average": 16500000,
      "median": 16000000,
      "totalProducts": 10
    },
    "analysis": {
      "recommendation": "Harga Rp15.000.000 sangat kompetitif...",
      "insights": [
        "Mayoritas produk dijual di range Rp15-17 juta",
        "Produk dengan rating tinggi cenderung lebih mahal"
        // ... more insights
      ],
      "suggestedPrice": 15800000
    },
    "sellerGuidance": {
      "shouldProceed": true,
      "pricePosition": "below_average",
      "warnings": [
        "💡 Harga di bawah rata-rata market. Bisa menarik banyak pembeli.",
        "Pastikan margin profit masih cukup."
      ],
      "suggestions": [
        "💰 Harga yang disarankan: Rp15.800.000",
        "📈 Range harga market: Rp12.500.000 - Rp22.000.000",
        "📊 Harga rata-rata: Rp16.500.000",
        "💡 Strategi: Volume tinggi dengan margin rendah",
        "🎯 Fokus pada kecepatan pengiriman dan service"
      ]
    }
  }
}
```

**Price Position Values:**

- `very_low`: < 70% dari harga minimum market
- `low`: < harga minimum market
- `below_average`: < 90% dari rata-rata
- `average`: ±10% dari rata-rata
- `above_average`: di atas rata-rata tapi < max
- `high`: > max tapi < 120% max
- `very_high`: > 120% dari max

**Use Case:**
Seller ingin menambahkan laptop gaming ROG ke toko dengan harga Rp15.000.000. Sebelum menambahkan, seller cek dulu analisis market untuk memastikan harga kompetitif.

---

#### 2. Quick Price Check

**POST** `/api/seller/price-analysis/quick-check`

Validasi cepat harga produk. Response lebih cepat dengan sample kecil (5 produk).

**Request Body:**

```json
{
  "productName": "iPhone 15 Pro",
  "userPrice": 18500000
}
```

**Response:**

```json
{
  "success": true,
  "message": "Quick check berhasil",
  "data": {
    "userPrice": 18500000,
    "marketAverage": 19200000,
    "marketRange": {
      "min": 17500000,
      "max": 21000000
    },
    "position": "below_average",
    "shouldProceed": true,
    "quickAdvice": "Harga kompetitif"
  }
}
```

**Use Case:**
Real-time validation saat seller mengetik harga di form. Memberikan feedback instant apakah harga wajar atau tidak.

---

#### Price Analysis Features

**🤖 AI-Powered:**

- Query optimization (misal: "iphone" → "iphone smartphone")
- Market insights dan rekomendasi strategis
- Suggested price berdasarkan analisis AI

**📊 Market Statistics:**

- Min, max, average, median price
- Price distribution analysis
- Competitor location data

**💡 Seller Guidance:**

- `shouldProceed`: Boolean apakah sebaiknya proceed dengan harga tersebut
- `pricePosition`: Posisi harga relatif terhadap market
- `warnings`: Array warning jika harga ekstrem atau ada concern
- `suggestions`: Array saran strategis untuk seller

**🎯 Strategic Advice:**
Sistem memberikan saran berbeda berdasarkan price position:

- **Low price**: Strategi volume tinggi, fokus pada service
- **High price**: Strategi premium, tonjolkan kualitas/bonus
- **Average**: Kompetitif via review dan foto produk

---

### Integration Example: Create Product dengan Price Analysis

**Workflow yang direkomendasikan:**

1. **Step 1: Seller input nama produk**

   ```bash
   GET /api/seller/price-analysis?productName=Laptop Gaming ROG
   ```

2. **Step 2: Seller lihat analisis market dan suggested price**
   - System menampilkan: range harga, rata-rata, suggested price
   - Seller mendapat insights tentang kompetitor

3. **Step 3: Seller input harga (bisa adopt suggested atau custom)**

   ```bash
   POST /api/seller/price-analysis/quick-check
   {
     "productName": "Laptop Gaming ROG",
     "userPrice": 15500000
   }
   ```

4. **Step 4: Sistem validasi dan beri feedback**
   - Position: "below_average"
   - Quick advice: "Harga kompetitif"
   - shouldProceed: true

5. **Step 5: Seller proceed create product**
   ```bash
   POST /api/seller/products
   {
     "name": "Laptop Gaming ROG",
     "price": 15500000,
     ...
   }
   ```

---

**Features:**

- Jika name berubah, slug di-regenerate
- Cek uniqueness untuk slug baru

---

## Struktur File

```
seller/
├── auth/                      # Authentication module
│   ├── index.ts              # Routes definition
│   ├── register/
│   │   ├── register_controller.ts
│   │   └── register_service.ts
│   ├── login/
│   │   ├── login_controller.ts
│   │   └── login_service.ts
│   ├── logout/
│   │   ├── logout_controller.ts
│   │   └── logout_service.ts
│   ├── refresh/
│   │   ├── refresh_controller.ts
│   │   └── refresh_service.ts
│   └── me/
│       ├── me_controller.ts
│       └── me_service.ts
├── products/                  # Product CMS
│   ├── index.ts              # Routes definition
│   ├── product_controller.ts
│   └── product_service.ts
├── store/                     # Store management
│   ├── index.ts              # Routes definition
│   ├── store_controller.ts
│   └── store_service.ts
├── price-analysis/            # 🆕 AI Price Analysis
│   ├── index.ts              # Routes definition
│   ├── price_analysis_controller.ts
│   └── price_analysis_service.ts
├── index.ts                   # Main seller routes
├── seller_controller.ts       # Dashboard & analytics
├── seller_service.ts
└── seller_repository.ts
```

│ ├── me_controller.ts
│ └── me_service.ts
├── products/ # Product CMS
│ ├── index.ts # Routes definition
│ ├── product_controller.ts
│ └── product_service.ts
├── store/ # Store management
│ ├── index.ts # Routes definition
│ ├── store_controller.ts
│ └── store_service.ts
├── index.ts # Main seller routes
├── seller_controller.ts # Dashboard & analytics
├── seller_service.ts
└── seller_repository.ts

````

## Authorization

Semua seller endpoints (kecuali register & login) memerlukan:

1. Valid JWT access token (via header atau cookie)
2. Role `SELLER` atau `ADMIN`

Contoh request dengan Bearer token:

```bash
curl -X GET http://localhost:4101/api/seller/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
````

Atau dengan cookie (otomatis jika login via browser).

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized - Please login",
  "error": { "code": "UNAUTHORIZED" }
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden - Seller only",
  "error": { "code": "FORBIDDEN" }
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Produk tidak ditemukan",
  "error": { "code": "NOT_FOUND" }
}
```

### 400 Validation Error

```json
{
  "success": false,
  "message": "Email sudah terdaftar",
  "error": { "code": "USER_ALREADY_EXISTS" }
}
```

## Perbedaan dengan Customer

| Aspek                | Customer         | Seller                          |
| -------------------- | ---------------- | ------------------------------- |
| **Auth Endpoint**    | `/api/auth/*`    | `/api/seller/auth/*`            |
| **Register**         | Hanya buat user  | User + Store sekaligus          |
| **Login**            | Role: CUSTOMER   | Role: SELLER/ADMIN only         |
| **Product Access**   | View/search only | Full CRUD untuk produk miliknya |
| **Store Management** | -                | Update store profile            |
| **Dashboard**        | -                | Analytics & statistics          |

## Testing

### 1. Register Seller

```bash
curl -X POST http://localhost:4101/api/seller/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@example.com",
    "password": "password123",
    "name": "Seller One",
    "storeName": "Toko Seller One"
  }'
```

### 2. Login Seller

```bash
curl -X POST http://localhost:4101/api/seller/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller1@example.com",
    "password": "password123"
  }'
```

### 3. Price Analysis

```bash
# Full analysis
curl -X GET "http://localhost:4101/api/seller/price-analysis?productName=Laptop%20Gaming&userPrice=15000000&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Quick check
curl -X POST http://localhost:4101/api/seller/price-analysis/quick-check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productName": "iPhone 15",
    "userPrice": 18500000
  }'
```

### 4. Create Product

```bash
curl -X POST http://localhost:4101/api/seller/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "categoryId": "YOUR_CATEGORY_ID",
    "name": "Test Product",
    "description": "Test description",
    "price": 100000,
    "stock": 50
  }'
```

## Next Steps

1. **Email Verification**: Implementasikan endpoint verify-email untuk seller
2. **Image Upload**: Tambahkan upload endpoint untuk product images dan store logo
3. **Order Management**: Seller order management (view, update status)
4. **Analytics**: Dashboard analytics untuk seller (revenue, top products, dll)
5. **Bulk Operations**: Import/export products CSV
6. **Notifications**: Real-time notifications untuk order baru

## Notes

- Slug generation otomatis menggunakan lowercase + dash
- Jika slug conflict, random suffix ditambahkan (6 karakter)
- Semua timestamps dalam format ISO 8601
- Pagination default: page=1, limit=20
- Role hierarchy: ADMIN > SELLER > CUSTOMER
