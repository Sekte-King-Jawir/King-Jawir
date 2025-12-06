use axum::{
    extract::Query,
    http::StatusCode,
    response::IntoResponse,
    Json, Router,
    routing::get,
};

use crate::blibli::blibli_dto::{ApiResponse, BlibliQuery};
use crate::blibli::blibli_service::BlibliService;

/// Blibli product search handler
///
/// Scrapes product data from Blibli based on search query
#[utoipa::path(
    get,
    path = "/api/scraper/blibli",
    params(BlibliQuery),
    responses(
        (status = 200, description = "Successfully retrieved products", body = Vec<BlibliProduct>),
        (status = 500, description = "Internal server error")
    ),
    tag = "blibli"
)]
pub async fn blibli_handler(
    Query(params): Query<BlibliQuery>,
) -> Result<impl IntoResponse, (StatusCode, Json<ApiResponse<Vec<crate::blibli::blibli_model::BlibliProduct>>>)> {
    println!("📥 Received Blibli request: query='{}', limit={}", params.query, params.limit);

    let service = BlibliService::new().map_err(|e| {
        eprintln!("❌ Failed to initialize BlibliService: {}", e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ApiResponse::error(format!("Service initialization failed: {}", e))),
        )
    })?;

    match service.search_products(&params.query, params.limit).await {
        Ok(products) => {
            let count = products.len();
            println!("✅ Successfully scraped {} Blibli products", count);
            Ok((StatusCode::OK, Json(ApiResponse::success(products, count))))
        }
        Err(e) => {
            eprintln!("❌ Blibli scraping error: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(format!("Scraping failed: {}", e))),
            ))
        }
    }
}

pub fn router() -> Router {
    Router::new().route("/api/scraper/blibli", get(blibli_handler))
}
