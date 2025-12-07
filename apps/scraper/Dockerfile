# Use Rust base image
FROM rust:1.85-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src ./src

# Build the application in release mode
RUN cargo build --release

# Production stage
FROM debian:bookworm-slim

# Install runtime dependencies for headless chrome
RUN apt-get update && apt-get install -y \
    ca-certificates \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable for chromium
ENV CHROME_BIN=/usr/bin/chromium

# Copy the binary from builder
COPY --from=builder /app/target/release/scraper /usr/local/bin/scraper

# Expose port
EXPOSE 4103

# Run the application
CMD ["scraper"]