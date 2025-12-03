use axum::{extract::Query, Json};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::tokopedia::tokopedia_dto::{ApiResponse, TokopediaQuery};
use crate::tokopedia::tokopedia_model::Product;
use crate::tokopedia::tokopedia_service::TokopediaService;

/// Response schema for successful API responses
#[derive(Serialize, Deserialize, ToSchema)]
pub struct ApiResponseSuccess {
    /// Indicates if the request was successful
    pub success: bool,
    /// Response data containing the scraped products
    pub data: Vec<Product>,
    /// Number of items returned
    pub count: usize,
}

/// Response schema for error API responses
#[derive(Serialize, Deserialize, ToSchema)]
pub struct ApiResponseError {
    /// Indicates if the request was successful
    pub success: bool,
    /// Error message
    pub error: String,
    /// Number of items returned (always 0 for errors)
    pub count: usize,
}

/// HTTP handler for the Tokopedia scraper API endpoint
#[utoipa::path(
    get,
    path = "/api/scraper/tokopedia",
    params(TokopediaQuery),
    responses(
        (status = 200, description = "Successfully scraped Tokopedia products", body = inline(ApiResponseSuccess)),
        (status = 500, description = "Internal server error", body = inline(ApiResponseError))
    ),
    tag = "tokopedia"
)]
pub async fn tokopedia_handler(
    Query(params): Query<TokopediaQuery>,
) -> Json<ApiResponse<Vec<Product>>> {
    use std::time::Instant;
    let handler_start = Instant::now();
    
    let query = params.query;
    let limit = params.limit;

    println!("📥 Received request: query='{query}', limit={limit}");

    let result = match TokopediaService::new() {
        Ok(service) => {
            let scrape_start = Instant::now();
            match service.scrape_tokopedia(&query, limit).await {
                Ok(products) => {
                    println!("⏱️  Scrape time: {:?}", scrape_start.elapsed());
                    let count = products.len();
                    
                    let serialize_start = Instant::now();
                    let response = ApiResponse::success(products, count);
                    println!("⏱️  Response build time: {:?}", serialize_start.elapsed());
                    
                    let json_start = Instant::now();
                    let json_response = Json(response);
                    println!("⏱️  Json wrap time: {:?}", json_start.elapsed());
                    println!("⏱️  Total handler time: {:?}", handler_start.elapsed());
                    
                    json_response
                }
                Err(e) => {
                    eprintln!("❌ Scraping error: {e}");
                    Json(ApiResponse::error(format!("Failed to scrape: {e}")))
                }
            }
        },
        Err(e) => {
            eprintln!("❌ Service initialization error: {e}");
            Json(ApiResponse::error(format!(
                "Failed to initialize scraper: {e}"
            )))
        }
    };
    
    result
}
