# King Jawir Marketplace API

Backend API untuk King Jawir Marketplace menggunakan Elysia.js dan Bun runtime.

## Features

- 🔐 Authentication (JWT, Google OAuth)
- 👤 User Profile Management
- 🏪 Store Management
- 📦 Product Catalog
- 🛒 Shopping Cart
- 📦 Order Management
- ⭐ Product Reviews
- 👑 Admin Dashboard
- 🤖 **AI-Powered Features** (NEW!)
- 🔍 **Product Scraping** (Shopee & Tokopedia)

## Installation

```bash
bun install
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - JWT secret key
- `SMTP_*` - Email configuration
- `OPENAI_API_KEY` - AI features (optional)
- `OPENAI_API_BASE` - Custom AI endpoint (optional)
- `OPENAI_MODEL` - AI model name (optional)

## Running the API

Development mode:

```bash
bun run dev
```

Production mode:

```bash
bun run start
```

## Testing

Run all tests:

```bash
bun run test
```

Watch mode:

```bash
bun run test:watch
```

## AI SDK Integration

Library AI SDK telah ditambahkan untuk fitur AI-powered. Lihat dokumentasi lengkap di:

- `lib/ai.ts` - Core AI functions
- `lib/AI_USAGE.md` - Usage guide & examples
- `lib/ai-example.ts` - Example code

### Quick Start AI

```typescript
import { generateCompletion } from './lib/ai'

const result = await generateCompletion('Tulis deskripsi produk untuk sepatu olahraga')
console.log(result.text)
```

### Run AI Examples

```bash
bun run lib/ai-example.ts
```

## API Documentation

Swagger documentation available at: `http://localhost:4101/docs`

## Product Scraping

API menyediakan fitur scraping produk dari marketplace:

### Endpoints

- `GET /scrape/shopee` - Scrape produk dari Shopee
- `GET /scrape/tokopedia` - Scrape produk dari Tokopedia
- `GET /scrape/all` - Scrape produk dari semua platform
- `GET /scrape/top-cheapest` - Top 10 produk termurah
- `GET /scrape/top-rated` - Top 10 produk rating tertinggi

### Parameters

- `q` (required) - Search query (min 2 karakter)
- `sortBy` (optional) - `cheapest` | `highest_rating` | `best_selling`
- `limit` (optional) - Jumlah hasil (1-50, default: 10)
- `minRating` (optional) - Rating minimum (0-5)
- `maxPrice` (optional) - Harga maksimum

### Example

```bash
# Cari sepatu termurah
curl "http://localhost:4101/scrape/all?q=sepatu&sortBy=cheapest&limit=10"

# Top 10 termurah dengan rating min 4.5
curl "http://localhost:4101/scrape/top-cheapest?q=laptop&minRating=4.5"

# Top 10 rating tertinggi dengan harga max 500000
curl "http://localhost:4101/scrape/top-rated?q=handphone&maxPrice=500000"
```

## Project Structure

```
apps/api/
├── lib/              # Core libraries
│   ├── ai.ts         # AI SDK integration
│   ├── db.ts         # Database connection
│   ├── hash.ts       # Password hashing
│   └── ...
├── auth/             # Authentication routes
├── product/          # Product management
├── store/            # Store management
├── cart/             # Shopping cart
├── order/            # Order management
├── review/           # Product reviews
├── admin/            # Admin features
├── scrape/           # Product scraping (Shopee, Tokopedia)
│   ├── shopee/       # Shopee scraper
│   └── tokopedia/    # Tokopedia scraper
└── test/             # Test files
```

## Tech Stack

- **Runtime:** Bun
- **Framework:** Elysia.js
- **Database:** MySQL with Prisma ORM
- **Authentication:** JWT, Google OAuth
- **AI:** Vercel AI SDK with OpenAI-compatible APIs
- **Testing:** Bun Test

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
