mod browser;
mod config;
mod tokopedia;

use axum::{Router, extract::Request, middleware::{self, Next}, response::Response};
use tower_http::cors::{Any, CorsLayer};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;
use std::time::Instant;

use crate::config::{SERVER_HOST, SERVER_PORT};
use crate::tokopedia::tokopedia_model::Product;

async fn logging_middleware(req: Request, next: Next) -> Response {
    let start = Instant::now();
    let method = req.method().clone();
    let uri = req.uri().clone();
    
    let response = next.run(req).await;
    
    let elapsed = start.elapsed();
    println!("⏱️  API Response: {} {} - {:?}", method, uri, elapsed);
    
    response
}

#[derive(OpenApi)]
#[openapi(
    paths(
        tokopedia::tokopedia_controller::tokopedia_handler
    ),
    components(
        schemas(Product, crate::tokopedia::tokopedia_dto::TokopediaQuery)
    ),
    tags(
        (name = "tokopedia", description = "Tokopedia product scraper API")
    ),
    info(
        title = "Tokopedia Scraper API",
        version = "0.1.0",
        description = "API for scraping product data from Tokopedia"
    )
)]
struct ApiDoc;

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
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(middleware::from_fn(logging_middleware))
        .layer(cors);

    // Start server
    let addr = format!("{SERVER_HOST}:{SERVER_PORT}");
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|_| panic!("Failed to bind to {addr}"));

    println!("🚀 Tokopedia Scraper API running on http://{addr}");
    println!("📡 Endpoint: GET http://{addr}/api/scraper/tokopedia?query=iphone&limit=10");
    println!("📚 Swagger UI: http://{addr}/docs");

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
