# King Jawir - AI Coding Guidelines

## Project Overview

**AI-powered price analysis and product description generator platform** for Indonesian SMEs. Monorepo using Turborepo with:
- `apps/api` - Elysia.js REST API on Bun runtime (port 4101)
- `apps/web` - Next.js 16 frontend (port 4102)  
- `apps/scraper` - Rust Tokopedia scraper service (port 4103)
- `packages/ui` - Shared React component library with theming
- `packages/eslint-config`, `packages/typescript-config` - Shared configs

## Architecture Patterns

### API Layer Structure (`apps/api`)
Each domain follows **Controller → Service → Repository** pattern:
```
{domain}/
├── index.ts           # Route definitions with Elysia plugins
├── {domain}_controller.ts  # Thin layer, delegates to service
├── {domain}_service.ts     # Business logic, returns ApiResponse
├── {domain}_repository.ts  # Prisma queries only
```
Core domains: `auth/`, `profile/`, `price-analysis/`

### Response Format
All API responses use standardized helpers from `apps/api/lib/response.ts`:
```typescript
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
return successResponse('Analysis complete', analysisResult)
return errorResponse('Not found', ErrorCode.NOT_FOUND)
```

### Database
- **Prisma with MariaDB** via `@prisma/adapter-mariadb`
- Schema at `apps/api/prisma/schema.prisma`
- Generated client in `apps/api/generated/prisma/`
- Prismabox generates Elysia TypeBox validators in `apps/api/generated/prismabox/`
- Always use `prisma` instance from `apps/api/lib/db.ts`

## Key Commands

```bash
# Development (uses bun as package manager)
bun install                    # Install dependencies
bun run copyenv                # Copy root .env to all apps
bun run dev                    # Start all apps in dev mode
bun run api:dev                # API only
bun run web:dev                # Web only

# Database
bunx prisma generate --schema=apps/api/prisma/schema.prisma
bunx prisma db push --schema=apps/api/prisma/schema.prisma
bun run apps/api/prisma/seed.ts

# Testing (apps/api uses Bun test runner)
cd apps/api && bun test        # Run all tests
bun test test/product/         # Run specific module tests
bun test --watch               # Watch mode

# Quality
bun run lint                   # ESLint across workspace
bun run format                 # Prettier formatting
bun run check-types            # TypeScript type checking
bun run knip                   # Detect unused exports/dependencies
```

## Code Conventions

### ⚠️ File Size & Separation Rule
**NEVER create files >500 lines mixing UI, Logic, and Query.** Follow separation of concerns:
- **UI/Routes** (`index.ts`) - Route definitions only, delegate to controller
- **Logic** (`*_service.ts`) - Business logic, validation, orchestration
- **Query** (`*_repository.ts`) - Database queries only (Prisma)

If a file grows large, split by domain or feature.

### ⛔ No Dummy/Placeholder Data
**NEVER add fake, dummy, or placeholder data** in code. All data must come from:
- Database via Prisma queries
- External APIs (scraper, AI services)
- User input through forms

Do not hardcode sample products, users, or mock responses outside of test files.

### Elysia Route Definitions
Routes use TypeBox (`t`) for validation with Swagger documentation:
```typescript
.post('/endpoint', handler, {
  body: t.Object({ name: t.String(), price: t.Number() }),
  detail: { tags: ['Products'], summary: 'Create product' }
})
```

### AI Integration
OpenAI-compatible client in `apps/api/lib/ai.ts` supports custom endpoints:
```typescript
import { generateCompletion, generateStreamingCompletion } from '../lib/ai'
```
Configured via `OPENAI_API_KEY`, `OPENAI_API_BASE`, `OPENAI_MODEL` env vars.

### Frontend
- Next.js App Router in `apps/web/app/`
- **Always use shared components from `@repo/ui` package first** (`packages/ui/src/`)
  - Existing: `button.tsx`, `card.tsx`, `code.tsx`, `theme/`, `layout/`
  - If component doesn't exist, add it to `packages/ui/src/` for reuse
- TailwindCSS v4 for styling
- `ThemeProvider` for dark/light mode

## Testing Patterns
Tests use mocking pattern with `bun:test`:
```typescript
import { describe, it, expect, mock, beforeEach } from 'bun:test'
mock.module('../../product/product_repository', () => ({
  productRepository: { findAll: mock(), /* ... */ }
}))
```

## Scraper Integration (Rust Service)
The `apps/scraper` is a Rust/Axum service with headless Chrome for Tokopedia scraping:
```
API (4101) → Scraper (4103) → Tokopedia
         ↓
   priceAnalysisRepository.fetchTokopediaPrices(query, limit)
```

**Scraper endpoint:** `GET /api/scraper/tokopedia?query={term}&limit={n}`

Response format:
```json
{ "success": true, "data": [{ "name": "...", "price": "Rp1.234.567", "rating": "4.9", ... }], "count": 10 }
```

Configure via `SCRAPER_URL` env var (default: `http://localhost:4103`).

## WebSocket Streaming Pattern
Real-time price analysis uses WebSocket at `/api/price-analysis/stream`:
```typescript
// Client sends:
{ "type": "start-analysis", "query": "laptop", "limit": 10, "userPrice": 5000000 }

// Server streams progress updates:
{ "type": "progress", "step": "fetching", "message": "...", "progress": 15 }
{ "type": "progress", "step": "calculating", ... }
{ "type": "complete", "data": { products, statistics, analysis } }
```
See `apps/api/price-analysis/websocket.ts` for implementation.

## Deployment

### Docker
```bash
docker-compose up -d           # Start web + api containers
```
Ports: api→4101, web→4102

### PM2 (Production)
Each app has `ecosystem.config.cjs`:
```bash
cd apps/api && pm2 start ecosystem.config.cjs --env production
cd apps/web && pm2 start ecosystem.config.cjs --env production
```
Requires Bun installed at `/home/asephs/.bun/bin/bun` (update path in config).

### Build Commands
```bash
bun run build                  # Build all apps
bun run api:build              # Build API only (outputs to dist/)
bun run web:build              # Build Next.js (outputs to .next/)
```

## Environment Setup
Required `.env` variables (see `apps/api/README.md`):
- `DATABASE_URL` - MySQL/MariaDB connection string
- `JWT_SECRET` - Minimum 32 characters
- `API_PORT` - Default 4101
- `SCRAPER_URL` - Rust scraper service (default: `http://localhost:4103`)
- `SMTP_*` - Email configuration for verification
- `OPENAI_*` - AI features (optional)

## Validators & Schema Generation

### Custom Validators (`apps/api/lib/validators.ts`)
Use `v.*` helpers for consistent validation with Indonesian error messages:
```typescript
import { v } from '../lib/validators'

body: t.Object({
  email: v.email(),           // Email format validation
  password: v.password(),     // Min 6 chars
  name: v.name(),             // Min 2, max 100 chars
  slug: v.slug(),             // Lowercase, numbers, dash only
  phone: v.phoneID(),         // Indonesian phone format (08xxx)
})
```

### Prismabox Generated Schemas
TypeBox validators auto-generated from Prisma schema in `apps/api/generated/prismabox/`:
```typescript
import { User, Product, Order } from '../generated/prismabox/barrel'
```

## Auth Module Structure
Auth uses sub-folder pattern for each flow:
```
auth/
├── index.ts              # Combines all routes
├── shared/               # Shared auth utilities
├── register/             # POST /auth/register
├── login/                # POST /auth/login
├── logout/               # POST /auth/logout
├── refresh/              # POST /auth/refresh
├── me/                   # GET /auth/me
├── verify-email/         # GET /auth/verify-email
├── resend-verification/  # POST /auth/resend-verification
├── forgot-password/      # POST /auth/forgot-password
├── change-password/      # POST /auth/change-password
└── google/               # Google OAuth flow
```

## Utility Libraries

### Password Hashing (`apps/api/lib/hash.ts`)
```typescript
import { hashPassword, verifyPassword } from '../lib/hash'
const hashed = await hashPassword(password)
const isValid = await verifyPassword(input, hashed)
```

### Email Service (`apps/api/lib/mail.ts`)
```typescript
import { sendVerificationEmail, sendResetPasswordEmail } from '../lib/mail'
await sendVerificationEmail(email, verificationUrl)
await sendResetPasswordEmail(email, resetUrl)
```
Requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` env vars.

## HTTP Status Code Conventions
```typescript
// In route handlers, set status before returning error response:
if (!result.success) {
  set.status = 400  // Bad request / validation error
}
if (!user) {
  set.status = 401  // Unauthorized
  return errorResponse('Please login', ErrorCode.UNAUTHORIZED)
}
if (!isSeller(user)) {
  set.status = 403  // Forbidden
  return errorResponse('Seller only', ErrorCode.FORBIDDEN)
}
if (!found) {
  set.status = 404  // Not found
  return errorResponse('Not found', ErrorCode.NOT_FOUND)
}
```

---

## Hackathon Scoring Rubric (Product & Pitch Focus)

**Total Base Score: 200 Points** (may increase with Bonus or decrease with Penalties)

### Score Composition
| Category | Weight | Points |
|----------|--------|--------|
| Code Quality | 5% | 10 |
| Architecture | 10% | 20 |
| Innovation | 20% | 40 |
| Functionality | 25% | 50 |
| Documentation & Video Demo | 40% | 80 |
| **Subtotal** | **100%** | **200** |
| Technical Bonus | - | +20 max |

### 1. Code Quality (5%) - 10 Points
**Focus:** Basic code hygiene

| Criteria | Checklist | Points |
|----------|-----------|--------|
| Basic Cleanliness | Clear variable names (not `x`, `a`), no dead code/console.log spam, proper indentation | 0-5 |
| Best Practices | No hardcoded credentials (API keys), organized file structure (not all in root) | 0-5 |

### 2. Architecture (10%) - 20 Points
**Focus:** System structure and technology choices

| Criteria | Checklist | Points |
|----------|-----------|--------|
| System Design | Logical separation (UI vs business logic), clear data flow | 0-10 |
| Tech Stack | Appropriate technology choices (not overkill or obsolete), effective library usage | 0-10 |

### 3. Innovation (20%) - 40 Points
**Focus:** Novelty and technical difficulty

| Criteria | Checklist | Points |
|----------|-----------|--------|
| Idea Novelty | Unique solution (not just a clone), creative approach to hackathon theme | 0-20 |
| Technical Complexity | Implements difficult features (AI, Real-time, Blockchain, complex algorithms), not just simple CRUD | 0-20 |

### 4. Functionality (25%) - 50 Points
**Focus:** Does the app work and provide value?

| Criteria | Checklist | Points |
|----------|-----------|--------|
| Core Features | Promised features work well, happy path completes end-to-end | 0-30 |
| Stability & UX | Minimal bugs during demo, responsive and comfortable user experience | 0-20 |

### 5. Documentation & Video Demo (40%) - 80 Points
**Focus:** Ability to "sell" the idea and clarity of instructions

| Criteria | Checklist | Points |
|----------|-----------|--------|
| Video: Storytelling | Problem & Solution explained clearly, engaging narrative, clear audio, supportive visuals | 0-30 |
| Video: Product Demo | Shows real running app (not just mockup/Figma), key features demonstrated within time limit | 0-25 |
| Technical Docs (README) | **Required:** Step-by-step installation instructions for judges, feature explanations, screenshots in README | 0-25 |

### 6. Technical Bonus - Up to +20 Points

| Bonus Item | Criteria | Points |
|------------|----------|--------|
| Advanced Tech | Successful AI/ML, IoT, or bleeding-edge technology integration | +10 |
| Deployment | App is live and publicly accessible via URL | +10 |

### 7. Penalties & Red Flags

| Violation | Description | Penalty |
|-----------|-------------|---------|
| Broken Demo/Link | Video won't play or repo is private/dead | **Disqualification** |
| Security Leak (Fatal) | Committed secrets (API Key, .env) to public repo | -20 |
| Repository Bloat | Uploaded node_modules, vendor, etc. | -10 |
| No README | No instructions on how to run the app | -20 |
| Spaghetti Code | Single file >500 lines mixing UI, Logic, and Query | -10 |

**Penalty Exceptions:** Judges must NOT penalize for:
- Popular Beta/RC libraries (e.g., @pinia/colada, TanStack Start)
- Stable/Legacy libraries (e.g., moment.js, jquery)
