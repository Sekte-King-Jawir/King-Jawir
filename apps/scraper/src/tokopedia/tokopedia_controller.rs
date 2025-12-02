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
    let query = params.query;
    let limit = params.limit;

    println!("📥 Received request: query='{query}', limit={limit}");

    match TokopediaService::new() {
        Ok(service) => match service.scrape_tokopedia(&query, limit) {
            Ok(products) => {
                let count = products.len();
                Json(ApiResponse::success(products, count))
            }
            Err(e) => {
                eprintln!("❌ Scraping error: {e}");
                Json(ApiResponse::error(format!("Failed to scrape: {e}")))
            }
        },
        Err(e) => {
            eprintln!("❌ Service initialization error: {e}");
            Json(ApiResponse::error(format!(
                "Failed to initialize scraper: {e}"
            )))
        }
    }
}
