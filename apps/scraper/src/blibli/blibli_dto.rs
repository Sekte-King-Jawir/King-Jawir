use serde::{Deserialize, Serialize};
use utoipa::{ToSchema, IntoParams};

#[derive(Debug, Serialize, Deserialize, ToSchema)]
#[derive(IntoParams)]
pub struct BlibliQuery {
    /// Search query
    pub query: String,
    /// Limit number of products
    pub limit: usize,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
    pub count: Option<usize>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, count: usize) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
            count: Some(count),
        }
    }
    pub fn error(msg: String) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(msg),
            count: None,
        }
    }
}
