# King Jawir - AI Coding Agent Instructions

## Project Overview

King Jawir is an AI-powered price analysis platform for Indonesian SMEs, built as a Turborepo monorepo with three main applications communicating via REST APIs.

**Architecture Pattern**: Microservices with REST communication
- `apps/api` (port 4101): Elysia.js backend with Bun runtime
- `apps/web` (port 4102): Next.js 15 frontend with React 19
- `apps/scraper` (port 4103): Rust-based Tokopedia scraper with headless Chrome

**Key Dependencies**: Bun (runtime), Prisma + MariaDB (database), OpenAI-compatible LLM APIs, TailwindCSS v4

## Critical Conventions

### 1. Database & Schema Generation

**Prisma with PrismaBox**: The project uses `prismabox` generator alongside standard Prisma client for automatic TypeBox schema generation integrated with Elysia.js validation.

```typescript
// Schema location: apps/api/prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

generator prismabox {
  provider                     = "prismabox"
  typeboxImportDependencyName  = "elysia"
  typeboxImportVariableName    = "t"
  inputModel                   = true
  output                       = "../generated/prismabox"
}
```

**After modifying schema**: Run `bunx prisma generate --schema=apps/api/prisma/schema.prisma` to regenerate both clients. Generated code lives in `apps/api/generated/` and is git-tracked.

### 2. API Response Pattern

All API endpoints follow standardized response wrapper from `apps/api/lib/response.ts`:

```typescript
import { successResponse, errorResponse, ErrorCode } from '../lib/response'

// Success
return successResponse('Operation completed', { data: result })

// Error with standard code
return errorResponse('User not found', ErrorCode.USER_NOT_FOUND)
```

**Never** return raw objects or throw unhandled exceptions. Always use `successResponse()` or `errorResponse()` with predefined `ErrorCode` constants.

### 3. Logging with Pino

Use structured logging via `apps/api/lib/logger.ts`:

```typescript
import { logger } from './lib/logger'

logger.info({ msg: 'User login', userId, email })
logger.error({ msg: 'Database error', error: err.message, query })
```

**Convention**: Pass objects with `msg` property first, followed by context fields. Never use `console.log()` in API code.

### 4. AI/LLM Integration

The project supports OpenAI-compatible APIs (OpenAI, NVIDIA, GLM) via `apps/api/lib/ai.ts`:

```typescript
import { generateChatCompletion, streamChatCompletion } from '../lib/ai'

// Non-streaming
const result = await generateChatCompletion(messages, { temperature: 0.7 })

// Streaming
for await (const chunk of streamChatCompletion(messages)) {
  // Handle stream
}
```

**Configuration**: Set `OPENAI_API_KEY`, `OPENAI_API_BASE`, and `OPENAI_MODEL` in `.env`. The system defaults to GLM 4.6 if not specified.

### 5. Price Analysis Flow (Core Feature)

The price analysis follows this multi-step pipeline:

1. **Query Optimization**: AI optimizes user query for better Tokopedia search
2. **Scraping**: Rust scraper fetches products via `GET /api/scraper/tokopedia`
3. **Statistical Analysis**: Calculate min/max/avg/median/quartiles
4. **AI Analysis**: LLM generates pricing recommendations and insights
5. **Streaming**: Progress updates sent via WebSocket to frontend

**Key files**:
- `apps/api/price-analysis/price_analysis_service.ts` - Business logic
- `apps/api/price-analysis/price_analysis_repository.ts` - Scraper integration
- `apps/api/price-analysis/websocket.ts` - Real-time progress updates
- `apps/web/hooks/usePriceAnalysis.ts` - Frontend React hook

### 6. Monorepo Workflow

**Package Manager**: Bun (not npm/yarn/pnpm)

```bash
# Development (excludes scraper by default)
bun run dev

# Development with all services including Rust scraper
bun run dev:all

# Single service
bun run api:dev    # or web:dev, scraper:dev

# Building
bun run build      # Builds all via Turbo
bun run api:build  # Single app
```

**Environment Setup**: Run `bun run copyenv` after creating root `.env` to distribute to all apps.

### 7. Shared UI Components

Located in `packages/ui/` and exported via `@repo/ui`:

```typescript
import { Button, Card, ThemeProvider, LoadingSpinner } from '@repo/ui'
```

**Convention**: All UI components use TailwindCSS v4 with CSS custom properties for theming. Dark mode managed via `ThemeProvider` context.

### 8. Type Safety & Validation

- **Backend**: Elysia.js with TypeBox schemas (auto-generated from PrismaBox)
- **Frontend**: TypeScript strict mode, React 19 with Next.js App Router
- **Rust**: Strongly typed with serde serialization

**When adding API endpoints**: Define validation schema inline with Elysia route definition using `t` (TypeBox) from the framework.

## Development Commands

| Task | Command |
|------|---------|
| Start all services | `bun run dev` |
| Type checking | `bun run check-types` |
| Linting | `bun run lint` |
| Unused code detection | `bun run knip` |
| Prisma generate | `bunx prisma generate --schema=apps/api/prisma/schema.prisma` |
| Prisma push schema | `bunx prisma db push --schema=apps/api/prisma/schema.prisma` |
| Database seed | `cd apps/api && bun run seed` |
| API tests | `cd apps/api && bun test` |

## Deployment Notes

**PM2 Configuration**: Each app has `ecosystem.config.cjs` for production deployment with Bun interpreter.

**Docker**: Use `docker-compose.yml` for containerized deployment. Services communicate via `king-jawir-network` bridge network.

**Environment Variables** (`.env` at root):
- `DATABASE_URL` - MariaDB connection string (required)
- `SCRAPER_URL` - Rust scraper endpoint (default: http://localhost:4103)
- `OPENAI_API_KEY` - AI model API key (required for price analysis)
- `OPENAI_API_BASE` - Custom LLM endpoint URL (optional)
- `OPENAI_MODEL` - Model name (optional, defaults to "GLM 4.6")

## Integration Points

### API → Scraper Communication
```typescript
// apps/api/price-analysis/price_analysis_repository.ts
const scraperUrl = process.env.SCRAPER_URL || 'http://localhost:4103'
const response = await fetch(`${scraperUrl}/api/scraper/tokopedia?query=${query}&limit=${limit}`)
```

### Frontend → API Communication
```typescript
// apps/web/lib/api/price-analysis.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'
```

### WebSocket Streaming
```typescript
// Frontend connects to wss://kjg.asepharyana.tech/api/price-analysis/stream (production)
// or ws://localhost:4101/api/price-analysis/stream (development)
// Server sends JSON messages: { type: 'progress' | 'complete' | 'error', ... }
```

## Common Patterns

### Repository-Service-Controller Pattern
Each feature follows this structure (see `price-analysis/`):
- `*_repository.ts` - External service calls, data fetching
- `*_service.ts` - Business logic, orchestration
- `*_controller.ts` - Request handling, validation
- `index.ts` - Route definitions

### Error Handling in Async Operations
```typescript
try {
  const result = await operation()
  return successResponse('Success', result)
} catch (error) {
  logger.error({ msg: 'Operation failed', error: error instanceof Error ? error.message : 'Unknown' })
  return errorResponse('Operation failed', ErrorCode.INTERNAL_ERROR)
}
```

## Testing

Currently implemented for API only (`apps/api/`):
- Test files: `*.test.ts` (Bun test runner)
- Config: `bunfig.toml`
- Run: `bun test` or `bun test --watch`

## Architecture Decisions

**Why Rust for scraper?** Performance and memory efficiency for concurrent headless Chrome operations.

**Why Elysia.js?** Bun-native framework with excellent TypeScript support and minimal overhead.

**Why PrismaBox?** Eliminates manual schema duplication between Prisma models and Elysia validation schemas.

**Why No Auth?** Platform is intentionally public and free for Indonesian SMEs - no authentication layer required.
