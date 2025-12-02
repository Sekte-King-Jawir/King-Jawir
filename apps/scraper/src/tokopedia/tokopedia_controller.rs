use axum::{extract::Query, Json};

use crate::tokopedia::tokopedia_dto::{ApiResponse, TokopediaQuery};
use crate::tokopedia::tokopedia_model::Product;
use crate::tokopedia::tokopedia_service::TokopediaService;

/// HTTP handler for the Tokopedia scraper API endpoint
pub async fn tokopedia_handler(
    Query(params): Query<TokopediaQuery>,
) -> Json<ApiResponse<Vec<Product>>> {
    let query = params.query;
    let limit = params.limit;

    println!("📥 Received request: query='{}', limit={}", query, limit);

    match TokopediaService::new() {
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
