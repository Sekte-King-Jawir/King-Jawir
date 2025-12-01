# Use Bun base image
FROM oven/bun:1.2.18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN bun install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Copy source files
COPY apps/api ./apps/api
COPY turbo.json ./
COPY package.json ./

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4102

CMD ["bun", "run", "apps/api/index.ts"]
