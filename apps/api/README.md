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

const result = await generateCompletion(
  'Tulis deskripsi produk untuk sepatu olahraga'
)
console.log(result.text)
```

### Run AI Examples

```bash
bun run lib/ai-example.ts
```

## API Documentation

Swagger documentation available at: `http://localhost:4101/docs`

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
