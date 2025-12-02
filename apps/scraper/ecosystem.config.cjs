module.exports = {
  apps: [
    {
      name: 'rust_store',
      script: './target/release/scraper',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env_production: {
        RUST_LOG: 'info',
      },
    },
  ],
}
