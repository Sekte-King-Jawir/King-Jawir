use serde::{Deserialize, Serialize};
use utoipa::{ToSchema, IntoParams};

#[derive(Debug, Deserialize, ToSchema)]
#[derive(IntoParams)]
pub struct TokopediaQuery {
    /// Search query for products (default: "iphone")
    #[serde(default = "crate::config::default_query")]
    pub query: String,
    /// Maximum number of products to return (default: 10)
    #[serde(default = "crate::config::default_limit")]
    pub limit: usize,
}

#[derive(Serialize, ToSchema)]
pub struct ApiResponse<T> {
    /// Indicates if the request was successful
    pub success: bool,
    /// Response data (present only on success)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    /// Error message (present only on failure)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    /// Number of items returned
    pub count: usize,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, count: usize) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
            count,
        }
    }

    pub fn error(error: String) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(error),
            count: 0,
        }
    }
}
