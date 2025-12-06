# King Jawir - AI Price Analysis & Product Description Generator

Platform analisis harga berbasis AI yang membantu UMKM Indonesia menentukan strategi pricing yang kompetitif dan menguntungkan.

## 🚀 Features

- 🤖 **AI-Powered Price Analysis** - Analisis harga kompetitor dari Tokopedia menggunakan web scraping + LLM
- ✍️ **Product Description Generator** - Generate deskripsi produk menarik dengan AI
- 📊 **Statistical Analysis** - Mean, median, quartile, dan confidence interval pricing
- ⚡ **Real-time WebSocket** - Streaming progress updates untuk analisis
- 🌐 **100% Public & Free** - No authentication required, completely open access
- 🎨 **Modern UI** - Next.js 15 dengan TailwindCSS v4 dan dark mode

## 📁 Project Structure

This Turborepo monorepo contains:

### Apps

- `apps/api` - Elysia.js REST API with Bun runtime (port 4101)
- `apps/web` - Next.js 15 frontend (port 4102)
- `apps/scraper` - Rust-based Tokopedia scraper service (port 4103)

### Packages

- `@repo/ui` - Shared React component library
- `@repo/eslint-config` - ESLint configurations
- `@repo/typescript-config` - TypeScript configurations

## 🛠️ Tech Stack

- **Runtime:** Bun
- **Backend:** Elysia.js + Prisma + MariaDB
- **Frontend:** Next.js 15 + React + TailwindCSS v4
- **Scraper:** Rust + Axum + headless Chrome
- **AI:** OpenAI-compatible API (supports custom endpoints)
- **Monorepo:** Turborepo

## 📦 Installation

```sh
bun install
bun run copyenv
```

## 🚀 Development

Run all services:

```sh
bun run dev
```

Run specific app:

```sh
bun run api:dev    # API only
bun run web:dev    # Web only
```

## 🏗️ Build

Build all apps:

```sh
bun run build
```

Build specific app:

```sh
bun run api:build
bun run web:build
```

## 🧪 Testing

```sh
cd apps/api
bun test           # Run all tests
bun test --watch   # Watch mode
```

## 📊 Database

Generate Prisma client:

```sh
bunx prisma generate --schema=apps/api/prisma/schema.prisma
```

Push schema to database:

```sh
bunx prisma db push --schema=apps/api/prisma/schema.prisma
```

Seed database:

```sh
bun run apps/api/prisma/seed.ts
```

## 🔧 Quality Tools

```sh
bun run lint          # ESLint
bun run format        # Prettier
bun run check-types   # TypeScript
bun run knip          # Unused exports/deps
```

## 📚 Documentation

- API Swagger docs: `http://localhost:4101/docs`
- See `apps/api/README.md` for backend documentation
- See `apps/web/README.md` for frontend documentation
- See `.github/copilot-instructions.md` for full coding guidelines

## 🌐 Deployment

### Docker

```sh
docker-compose up -d
```

### PM2

```sh
cd apps/api && pm2 start ecosystem.config.cjs --env production
cd apps/web && pm2 start ecosystem.config.cjs --env production
```

## 🔑 Environment Variables

Required `.env` variables:

- `DATABASE_URL` - MariaDB connection string
- `JWT_SECRET` - Minimum 32 characters
- `API_PORT` - Default 4101
- `SCRAPER_URL` - Rust scraper service URL
- `SMTP_*` - Email configuration
- `OPENAI_API_KEY` - AI model API key
- `OPENAI_API_BASE` - Custom AI endpoint (optional)
- `OPENAI_MODEL` - AI model name (optional)

## 📖 Useful Links

- [Turborepo Documentation](https://turborepo.com/docs)
- [Elysia.js Documentation](https://elysiajs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bun Documentation](https://bun.sh/docs)

## 👥 Team

King Jawir - AI-Powered Price Analysis Platform for Indonesian SMEs

## 📄 License

MIT License
