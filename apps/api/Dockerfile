# Use Bun base image
FROM oven/bun:1.2.18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package files and lockfile
COPY package.json bun.lock ./

# Copy workspace package files
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Install dependencies
RUN bun install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/ ./packages/

# Copy source files
COPY apps/api ./apps/api
COPY turbo.json ./
COPY package.json ./

# Generate Prisma client
RUN bunx prisma generate --schema=apps/api/prisma/schema.prisma

# Build the application
RUN bun run api:build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4102

CMD ["bun", "run", "dist/index.js"]
