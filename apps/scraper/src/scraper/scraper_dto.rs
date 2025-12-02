use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct ScraperQuery {
    #[serde(default = "crate::config::default_query")]
    pub query: String,
    #[serde(default = "crate::config::default_limit")]
    pub limit: usize,
}

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
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
