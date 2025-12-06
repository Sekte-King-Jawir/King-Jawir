use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
pub struct BlibliProduct {
    /// Product name
    pub name: String,
    /// Product price as string
    pub price: String,
    /// Product rating (optional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rating: Option<String>,
    /// Product image URL
    pub image_url: String,
    /// Product page URL
    pub product_url: String,
    /// Shop location (optional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub shop_location: Option<String>,
    /// Number of items sold (optional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sold: Option<String>,
}
