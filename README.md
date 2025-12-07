# King Jawir

A modern full-stack web application built with a microservices architecture using cutting-edge technologies.

## 🏗️ Architecture Overview

This project follows a monorepo structure with multiple services orchestrated through Docker:

- **Web Application** (`apps/web`): Next.js 16 frontend with React 19
- **API Service** (`apps/api`): Elysia.js backend with Bun runtime
- **Scraper Service** (`apps/scraper`): Rust-based scraping service
- **Reverse Proxy** (`apps/nginx`): Nginx for routing and load balancing
- **Shared Packages** (`packages`): Reusable UI components and configurations

## 📁 Project Structure

```
king-jawir/
├── apps/
│   ├── api/          # Backend API service (Bun + Elysia.js)
│   ├── nginx/        # Reverse proxy configuration
│   ├── scraper/      # Rust-based scraping service
│   └── web/          # Frontend application (Next.js 16)
├── packages/
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/           # Shared UI components
├── .github/workflows/# CI/CD workflows
└── docker-compose.yml # Local development orchestration
```

## 🚀 Services

| Service | Port | Description                   |
| ------- | ---- | ----------------------------- |
| Web     | 4102 | Next.js frontend application  |
| API     | 4101 | Main backend API              |
| Scraper | 4103 | Rust scraping service         |
| Nginx   | 4104 | Reverse proxy (public access) |

## 🛠️ Technologies

### Frontend (`web`)

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [GSAP](https://greensock.com/gsap/) - Professional animation library

### Backend (`api`)

- [Bun](https://bun.sh/) - JavaScript runtime
- [Elysia.js](https://elysiajs.com/) - Fast TypeScript web framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [MariaDB](https://mariadb.org/) - Database adapter

### Scraper (`scraper`)

- [Rust](https://www.rust-lang.org/) - Systems programming language
- [Cargo](https://doc.rust-lang.org/cargo/) - Rust package manager

### Infrastructure

- [Docker](https://www.docker.com/) - Containerization
- [Nginx](https://nginx.org/) - Reverse proxy and load balancer
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## ▶️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.3)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your configuration

3. Distribute the environment file to all apps:
   ```bash
   bun run copyenv
   ```

### Development

Start all services in development mode:

```bash
bun run dev
```

Or start individual services:

```bash
# Web application
bun run web:dev

# API service
bun run api:dev

# Scraper service
bun run scraper:dev
```

### Production Deployment

Using Docker Compose:

```bash
docker-compose up -d
```

Access the application at http://localhost:4104

## 🧪 Testing

Run tests for all services:

```bash
bun run test
```

Run tests for specific services:

```bash
# API tests
bun run api:test

# Scraper tests
bun run scraper:test
```

## 📦 Building

Build all services:

```bash
bun run build
```

Build specific services:

```bash
# Web application
bun run web:build

# API service
bun run api:build

# Scraper service
bun run scraper:build
```

## 🔍 Code Quality

### Linting

```bash
bun run lint
```

### Type Checking

```bash
bun run check-types
```

### Formatting

```bash
# Check formatting
bun run format:check

# Apply formatting
bun run format
```

## 🐳 Docker Images

The project uses GitHub Actions to automatically build and push Docker images to GitHub Container Registry:

- `ghcr.io/sekte-king-jawir/king-jawir/api`
- `ghcr.io/sekte-king-jawir/king-jawir/web`
- `ghcr.io/sekte-king-jawir/king-jawir/scraper`
- `ghcr.io/sekte-king-jawir/king-jawir/nginx`

## 📊 Monitoring

Services are accessible through the Nginx reverse proxy at http://localhost:4104 with the following routes:

- `/` → Web application (port 4102)
- `/api/` → Main API service (port 4101)
- `/api/scraper/` → Scraper API service (port 4103)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
