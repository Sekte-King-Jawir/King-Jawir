use anyhow::Result;
use redis::AsyncCommands;

use crate::blibli::blibli_model::BlibliProduct;
use crate::blibli::blibli_repository::BlibliRepository;

pub struct BlibliService {
    repository: BlibliRepository,
    redis_client: redis::Client,
}

impl BlibliService {
    pub fn new() -> Result<Self> {
        let repository = BlibliRepository::new()?;
        let host = std::env::var("REDIS_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
        let port = std::env::var("REDIS_PORT").unwrap_or_else(|_| "6379".to_string());
        let password = std::env::var("REDIS_PASSWORD").unwrap_or_default();
        let redis_url = if password.is_empty() {
            format!("redis://{}:{}/", host, port)
        } else {
            format!("redis://:{}@{}:{}/", password, host, port)
        };
        let redis_client = redis::Client::open(redis_url)?;
        Ok(Self { repository, redis_client })
    }

    pub async fn search_products(&self, query: &str, limit: usize) -> Result<Vec<BlibliProduct>> {
        use std::time::Instant;
        let start = Instant::now();

        println!("🔍 Searching for '{query}' on Blibli (scraping all rendered products)...");

        let cache_key = format!("blibli:{}", query);

        let conn_start = Instant::now();
        // Try to connect to Redis, but don't fail if it's not available
        let mut redis_conn = match self.redis_client.get_async_connection().await {
            Ok(conn) => {
                println!("⏱️  Redis connection: {:?}", conn_start.elapsed());
                Some(conn)
            },
            Err(e) => {
                println!("⚠️  Redis connection failed: {}. Continuing without cache.", e);
                None
            }
        };

        // Try to get cached result if Redis is available
        if let Some(conn) = &mut redis_conn {
            let cache_start = Instant::now();
            if let Ok(cached) = conn.get::<_, String>(&cache_key).await {
                println!("⏱️  Redis GET: {:?}", cache_start.elapsed());
                if !cached.is_empty() {
                    let parse_start = Instant::now();
                    if let Ok(mut products) = serde_json::from_str::<Vec<BlibliProduct>>(&cached) {
                        println!("⏱️  JSON parse: {:?}", parse_start.elapsed());

                        // Apply limit to cached results
                        products.truncate(limit);
                        println!("🗄️  Cache hit for query: {query}, returning {} products (total: {:?})", products.len(), start.elapsed());
                        return Ok(products);
                    }
                }
            }
        }

        println!("🔍 Searching Blibli for: '{}' (limit: {})", query, limit);
        let products = self.repository.scrape(query, limit)?;

        if products.is_empty() {
            println!("⚠️  No products extracted");
        } else {
            println!("✅ Successfully extracted {} products", products.len());
            for (i, p) in products.iter().enumerate().take(5) {
                println!("  {}. {} - {}", i + 1, p.name, p.price);
            }
        }

        // Only cache if we have sufficient results (at least the requested limit)
        // This prevents caching empty or incomplete results
        let should_cache = !products.is_empty() && products.len() >= limit;

        if should_cache {
            // Cache the result for 1 day (86400 seconds) if Redis is available
            if let Some(conn) = &mut redis_conn {
                if let Ok(products_json) = serde_json::to_string(&products) {
                    match conn.set_ex::<_, _, ()>(&cache_key, products_json, 86400).await {
                        Ok(_) => println!("🗄️  Cached {} products for query: {query} (TTL: 1 day)", products.len()),
                        Err(e) => println!("⚠️  Failed to cache result: {}", e),
                    }
                }
            }
        } else {
            println!("⚠️  Not caching: found {} products but requested {}", products.len(), limit);
        }

        Ok(products)
    }
}
