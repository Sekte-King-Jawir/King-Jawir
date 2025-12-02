pub mod tokopedia_controller;
pub mod tokopedia_dto;
pub mod tokopedia_model;
pub mod tokopedia_repository;
pub mod tokopedia_service;

use axum::{Router, routing::get};

/// Create router for Tokopedia scraper endpoints
pub fn router() -> Router {
    Router::new()
        .route("/api/scraper/tokopedia", get(tokopedia_controller::tokopedia_handler))
}
