# Tokopedia Scraper API 🛒

Fast and reliable Tokopedia product scraper built with Rust, Axum, and headless Chrome.

## 🚀 Features

- ⚡ **Fast**: Built with Rust for maximum performance
- 🎯 **Accurate**: Extracts product data from both JSON and DOM
- 🔄 **Automatic Fallback**: JSON parsing → DOM parsing
- 🌐 **REST API**: Simple HTTP GET endpoint
- 🛡️ **CORS Enabled**: Ready for web applications
- 📦 **Clean Architecture**: Modular, maintainable code structure

## 📋 Requirements

- Rust 1.70+
- Chrome/Chromium browser
- 2GB+ RAM recommended

## 🔧 Installation

```bash
# Clone repository
git clone https://github.com/Sekte-King-Jawir/King-Jawir.git
cd King-Jawir/apps/scraper

# Build
cargo build --release

# Run
cargo run --release
```

## 🎯 Usage

### Start Server

```bash
cargo run --release
```

Server will start on `http://0.0.0.0:4103`

### API Endpoint

```
GET /api/scraper?query={search_term}&limit={number}
```

**Parameters:**
- `query` (optional): Search term (default: "iphone")
- `limit` (optional): Number of products to return (default: 10)

### Examples

```bash
# Search for laptops (limit 5)
curl "http://localhost:4103/api/scraper?query=laptop&limit=5"

# Search for phones (default limit 10)
curl "http://localhost:4103/api/scraper?query=samsung"

# Use default search (iphone)
curl "http://localhost:4103/api/scraper"
```

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "name": "iPhone 15 Pro Max 256GB",
      "price": "Rp19.999.000",
      "rating": "4.9",
      "image_url": "https://images.tokopedia.net/...",
      "product_url": "https://www.tokopedia.com/...",
      "shop_location": "Jakarta Pusat"
    }
  ],
  "count": 10
}
```

## 🏗️ Architecture

```
src/
├── main.rs                          # Entry point & server setup
├── browser.rs                       # Browser automation utility
├── config.rs                        # Configuration constants
└── scraper/                         # Feature module
    ├── mod.rs                       # Module exports
    ├── scraper_model.rs             # Product model
    ├── scraper_dto.rs               # Request/Response DTOs
    ├── scraper_repository.rs        # Data access layer
    ├── scraper_service.rs           # Business logic
    └── scraper_controller.rs        # HTTP handlers
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 📦 Production Deployment

### Automated Deployment (GitHub Actions)

The project includes automated deployment via GitHub Actions. Push to `main` branch or trigger manually:

```bash
# Automatic: Push changes to main
git push origin main

# Manual: Go to GitHub Actions → Deploy Rust Store to VPS → Run workflow
```

The workflow will:
1. Build the Rust binary in release mode
2. Sync binary to VPS
3. Restart PM2 service automatically

### Manual Deployment with PM2

```bash
# Build release binary
cargo build --release

# Start with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Check status
pm2 status rust_store

# View logs
pm2 logs rust_store
```

### Server Requirements

#### Install Chrome on Ubuntu/Debian
```bash
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt update
sudo apt install -y google-chrome-stable
```

#### Install required libraries
```bash
sudo apt install -y libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libpango-1.0-0 libcairo2 libasound2
```

## 🧪 Testing

```bash
# Build and test
cargo build --release

# Run server in background
cargo run --release &

# Test endpoint
curl "http://localhost:4103/api/scraper?query=test&limit=3"
```

## 🛠️ Development

### Project Structure

- **Controller Layer**: HTTP request handling
- **Service Layer**: Business logic orchestration
- **Repository Layer**: Data fetching & parsing
- **Model Layer**: Domain entities
- **DTO Layer**: API contracts

### Key Technologies

- **Axum**: Web framework
- **headless_chrome**: Browser automation
- **scraper**: HTML parsing
- **serde**: Serialization
- **tokio**: Async runtime

### Adding New Features

1. Create new feature folder in `src/`
2. Implement layers (model, dto, repository, service, controller)
3. Register routes in `main.rs`

See [ARCHITECTURE.md](./ARCHITECTURE.md) for examples.

## ⚙️ Configuration

Edit `src/config.rs` to customize:

- **Server settings**: Host, port
- **Browser settings**: Window size, timeouts
- **Scraping parameters**: Selectors, patterns
- **Tokopedia URLs**: Base URL, endpoints

## 📊 Performance

- **Scraping time**: ~8-12 seconds per request
- **Memory usage**: ~500MB-1GB per instance
- **Concurrent requests**: Limited by browser instances

## 🐛 Troubleshooting

### Chrome not found
Install Chrome/Chromium and ensure it's in PATH

### Timeout errors
Increase `PAGE_RENDER_WAIT_SECS` in `config.rs`

### No products found
Check if Tokopedia HTML structure changed, update selectors

### Port already in use
Change `SERVER_PORT` in `config.rs` or kill existing process

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read architecture docs first.

## 📬 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Rust**
