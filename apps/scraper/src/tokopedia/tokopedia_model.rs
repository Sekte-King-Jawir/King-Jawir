use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub name: String,
    pub price: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rating: Option<String>,
    pub image_url: String,
    pub product_url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub shop_location: Option<String>,
}
