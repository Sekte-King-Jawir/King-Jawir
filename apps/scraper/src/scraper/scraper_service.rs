use anyhow::Result;

use crate::config::*;
use crate::scraper::scraper_model::Product;
use crate::scraper::scraper_repository::ScraperRepository;

pub struct ScraperService {
    repository: ScraperRepository,
}

impl ScraperService {
    pub fn new() -> Result<Self> {
        let repository = ScraperRepository::new()?;
        Ok(Self { repository })
    }

    /// Main business logic for scraping Tokopedia products
    pub fn scrape_tokopedia(&self, query: &str, limit: usize) -> Result<Vec<Product>> {
        println!("🔍 Searching for '{}' on Tokopedia...", query);

        let url = self.build_search_url(query);
        println!("🌐 Navigating to {}", url);

        let html_content = self.repository.fetch_search_page(&url)?;
        println!("✅ Got page content ({} bytes)", html_content.len());

        // Debug: Check if __NEXT_DATA__ exists
        if html_content.contains("__NEXT_DATA__") {
            println!("✓ Found __NEXT_DATA__ in HTML");
        } else {
            println!("✗ No __NEXT_DATA__ found in HTML");
        }

        // Try to parse from __NEXT_DATA__ JSON first (faster and more reliable)
        let products = self.repository
            .parse_products_from_json(&html_content, limit)
            .unwrap_or_else(|| {
                println!("⚠️  JSON parsing failed, falling back to DOM parsing...");
                self.repository.parse_products_from_dom(&html_content, limit)
            });

        if products.is_empty() {
            println!("⚠️  No products extracted");
        } else {
            println!("✅ Successfully extracted {} products", products.len());
            for (i, p) in products.iter().enumerate().take(3) {
                println!("  {}. {} - {}", i + 1, p.name, p.price);
            }
        }

        Ok(products)
    }

    /// Build Tokopedia search URL with query parameters
    fn build_search_url(&self, query: &str) -> String {
        format!(
            "{}{}?st=product&q={}&ob=3&rt=4,5",
            TOKOPEDIA_BASE_URL,
            SEARCH_ENDPOINT,
            urlencoding::encode(query)
        )
    }
}
