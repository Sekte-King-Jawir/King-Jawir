mod browser;
mod config;
mod tokopedia;

use axum::Router;
use tower_http::cors::{Any, CorsLayer};

use crate::config::{SERVER_HOST, SERVER_PORT};

#[tokio::main]
async fn main() {
    // Setup CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build router with all routes from modules
    let app = Router::new()
        .merge(tokopedia::router())
        .layer(cors);

    // Start server
    let addr = format!("{}:{}", SERVER_HOST, SERVER_PORT);
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|_| panic!("Failed to bind to {}", addr));

    println!("🚀 Tokopedia Scraper API running on http://{}", addr);
    println!("📡 Endpoint: GET http://{}/api/scraper/tokopedia?query=iphone&limit=10", addr);

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
