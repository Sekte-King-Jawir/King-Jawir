pub mod blibli_controller;
pub mod blibli_dto;
pub mod blibli_model;
pub mod blibli_repository;
pub mod blibli_service;

use axum::Router;

pub fn router() -> Router {
    blibli_controller::router()
}
