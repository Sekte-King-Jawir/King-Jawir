use axum::{extract::Query, Json};

use crate::scraper::scraper_dto::{ApiResponse, ScraperQuery};
use crate::scraper::scraper_model::Product;
use crate::scraper::scraper_service::ScraperService;

/// HTTP handler for the scraper API endpoint
pub async fn scraper_handler(
    Query(params): Query<ScraperQuery>,
) -> Json<ApiResponse<Vec<Product>>> {
    let query = params.query;
    let limit = params.limit;

    println!("📥 Received request: query='{}', limit={}", query, limit);

    match ScraperService::new() {
        Ok(service) => match service.scrape_tokopedia(&query, limit) {
            Ok(products) => {
                let count = products.len();
                Json(ApiResponse::success(products, count))
            }
            Err(e) => {
                eprintln!("❌ Scraping error: {}", e);
                Json(ApiResponse::error(format!("Failed to scrape: {}", e)))
            }
        },
        Err(e) => {
            eprintln!("❌ Service initialization error: {}", e);
            Json(ApiResponse::error(format!(
                "Failed to initialize scraper: {}",
                e
            )))
        }
    }
}
