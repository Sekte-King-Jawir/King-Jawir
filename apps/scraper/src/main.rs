mod browser;
mod config;
mod scraper;

use axum::{routing::get, Router};
use tower_http::cors::{Any, CorsLayer};

use crate::config::{SERVER_HOST, SERVER_PORT};
use crate::scraper::scraper_controller::scraper_handler;

#[tokio::main]
async fn main() {
    // Setup CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        .route("/api/scraper", get(scraper_handler))
        .layer(cors);

    // Start server
    let addr = format!("{}:{}", SERVER_HOST, SERVER_PORT);
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|_| panic!("Failed to bind to {}", addr));

    println!("🚀 Tokopedia Scraper API running on http://{}", addr);
    println!("📡 Endpoint: GET http://{}/api/scraper?query=iphone&limit=10", addr);

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
