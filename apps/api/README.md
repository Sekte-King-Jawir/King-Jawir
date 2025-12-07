# King Jawir API

Backend API untuk King Jawir - AI Price Analysis & Product Description Generator menggunakan Elysia.js dan Bun runtime.

## ✨ Features

- 🤖 **AI Price Analysis** - Analisis harga kompetitor dari Tokopedia
- ✍️ **Product Description Generator** - AI-powered content generation
- 📊 **Statistical Analysis** - Mean, median, quartile pricing calculations
- ⚡ **WebSocket Streaming** - Real-time progress updates
- 🌐 **100% Public API** - No authentication required
- 🖼️ **MinIO Integration** - Object storage untuk file uploads (optional)

## 📦 Installation

```bash
bun install
```

## 🔧 Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` - MariaDB connection string
- `API_PORT` - Default 4101
- `SCRAPER_URL` - Rust scraper service URL (default: http://localhost:4103)
- `OPENAI_API_KEY` - AI model API key
- `OPENAI_API_BASE` - Custom AI endpoint (optional)
- `OPENAI_MODEL` - AI model name (optional, default: gpt-4o-mini)
- `MINIO_*` - MinIO object storage configuration (optional)

## 🚀 Running the API

Development mode:

```bash
bun run dev
```

Production mode:

```bash
bun run start
```

Build:

```bash
bun run build
```

## 🧪 Testing

Run all tests:

```bash
bun test
```

Watch mode:

```bash
bun test --watch
```

Run specific module tests:

```bash
bun test test/auth/
```

## 🤖 AI Features

### Price Analysis

Menggunakan web scraping dari Tokopedia + statistical analysis + LLM untuk memberikan rekomendasi pricing strategy.

**Endpoint:** `POST /api/price-analysis/analyze`

**WebSocket:** `wss://kjg.asepharyana.tech/api/price-analysis/stream` (production) or `ws://localhost:4101/api/price-analysis/stream` (development)

### Product Description Generator

Generate deskripsi produk menarik menggunakan AI.

**Endpoint:** `POST /api/ai/generate-description`

### AI SDK Integration

Library AI SDK telah ditambahkan untuk fitur AI-powered. Lihat dokumentasi lengkap di:

- `lib/ai.ts` - Core AI functions
- `lib/AI_USAGE.md` - Usage guide & examples

Quick Start:

```typescript
import { generateCompletion } from './lib/ai'

const result = await generateCompletion('Tulis deskripsi produk untuk sepatu olahraga')
console.log(result.text)
```

## 📚 API Documentation

Swagger documentation available at: `http://localhost:4101/docs`

## 🗂️ Project Structure

```
apps/api/
├── lib/              # Core libraries
│   ├── ai.ts         # AI SDK integration
│   ├── db.ts         # Prisma database connection
│   ├── auth-helper.ts # JWT authentication helpers
│   ├── validators.ts  # Custom validators (email, phone, etc.)
│   ├── hash.ts       # Password hashing utilities
│   ├── mail.ts       # Email service
│   ├── response.ts   # Standardized API responses
│   └── minio.ts      # Object storage client
├── auth/             # Authentication routes (login, register, OAuth)
├── profile/          # User profile management
├── price-analysis/   # Price analysis endpoints & WebSocket
│   ├── index.ts
│   ├── price_analysis_controller.ts
│   ├── price_analysis_service.ts
│   ├── price_analysis_repository.ts
│   └── websocket.ts  # Real-time streaming
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed.ts       # Seed data
├── generated/        # Generated Prisma & TypeBox schemas
└── test/             # Test files
```

## 🏗️ Architecture Pattern

Setiap domain mengikuti pattern **Controller → Service → Repository**:

- **Controller** - Thin layer, handle request/response
- **Service** - Business logic, orchestration
- **Repository** - Database queries only (Prisma)

## 🛠️ Tech Stack

- **Runtime:** Bun
- **Framework:** Elysia.js dengan TypeBox validation
- **Database:** MariaDB dengan Prisma ORM
- **Authentication:** JWT (cookie-based), Google OAuth
- **AI:** OpenAI-compatible API client
- **Email:** Nodemailer dengan SMTP
- **Storage:** MinIO S3-compatible object storage
- **Testing:** Bun Test dengan mocking
- **Validation:** Custom validators dengan Indonesian error messages

## 🔐 Authentication

JWT-based authentication dengan cookie storage. Supports:

- Email/password registration & login
- Google OAuth
- Email verification
- Password reset
- Refresh token rotation

**Roles:** `USER`, `ADMIN`

## 📨 Email Templates

- Welcome email dengan verification link
- Password reset email
- Resend verification email

## 🌐 CORS & Rate Limiting

- CORS enabled untuk cross-origin requests
- Rate limiting: 200 requests per minute (configurable)

## 📝 Response Format

All API responses follow standardized format dari `lib/response.ts`:

```typescript
{
  success: boolean
  message: string
  data?: any
  error?: string
}
```

## 🔄 WebSocket Streaming

Real-time price analysis menggunakan WebSocket di `/api/price-analysis/stream`:

```javascript
const ws = new WebSocket('ws://localhost:4101/api/price-analysis/stream')
ws.send(
  JSON.stringify({
    type: 'start-analysis',
    query: 'laptop',
    limit: 10,
    userPrice: 5000000,
  })
)
```

## 🚀 Deployment

### Docker

```bash
docker build -t king-jawir-api .
docker run -p 4101:4101 king-jawir-api
```

### PM2

```bash
pm2 start ecosystem.config.cjs --env production
```

## 📊 Database

Generate Prisma client setelah perubahan schema:

```bash
bunx prisma generate --schema=./prisma/schema.prisma
```

Push schema ke database:

```bash
bunx prisma db push --schema=./prisma/schema.prisma
```

Seed database:

```bash
bun run prisma/seed.ts
```

## 🧹 Code Quality

```bash
bun run lint          # ESLint
bun run format        # Prettier
bun run check-types   # TypeScript type checking
```

## 📖 Additional Documentation

- See root `README.md` for monorepo setup
- See `.github/copilot-instructions.md` for coding guidelines
- See `lib/AI_USAGE.md` for AI integration guide

This project uses [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
