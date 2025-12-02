use anyhow::{Context, Result};
use scraper::{Html, Selector};
use serde_json::Value;
use std::thread;

use crate::browser::BrowserClient;
use crate::config::*;
use crate::tokopedia::tokopedia_model::Product;

pub struct TokopediaRepository {
    browser: BrowserClient,
}

impl TokopediaRepository {
    pub fn new() -> Result<Self> {
        let browser = BrowserClient::new()?;
        Ok(Self { browser })
    }

    /// Fetch HTML content from Tokopedia search page
    pub fn fetch_search_page(&self, url: &str) -> Result<String> {
        let tab = self.browser.new_tab()?;
        tab.set_default_timeout(get_page_load_timeout());

        tab.navigate_to(url).context("Failed to navigate to URL")?;
        let _ = tab.wait_until_navigated();

        // Wait for page to fully load and render
        thread::sleep(get_page_render_wait());

        // Trigger any pending renders
        let _ = tab.get_content();
        thread::sleep(get_additional_wait());

        let html_content = tab.get_content().context("Failed to get page content")?;
        Ok(html_content)
    }

    /// Parse products from HTML using DOM selectors
    pub fn parse_products_from_dom(&self, html: &str, limit: usize) -> Vec<Product> {
        let document = Html::parse_document(html);
        
        // Try multiple selector strategies
        let link_selector = Selector::parse("a[href*='/p/']").unwrap();
        let img_selector = Selector::parse("img").unwrap();

        let mut products = Vec::new();
        let mut seen_urls = std::collections::HashSet::new();

        println!("🔍 Searching for product links in DOM...");

        for link_elem in document.select(&link_selector) {
            if products.len() >= limit {
                break;
            }

            let product_url = link_elem.value().attr("href").unwrap_or("").to_string();
            
            // Skip invalid or duplicate URLs
            if product_url.is_empty() 
                || product_url.contains("/discovery/") 
                || product_url.contains("/top-ads/")
                || seen_urls.contains(&product_url) {
                continue;
            }

            seen_urls.insert(product_url.clone());

            let link_html = link_elem.html();
            let name = self.extract_product_name(&link_html);
            let price = self.extract_product_price(&link_html);
            
            // Only add if we have both name and price
            if !name.is_empty() && !price.is_empty() {
                let rating = self.extract_rating(&link_html);
                let image_url = self.extract_image_url(&link_elem, &img_selector);
                let shop_location = self.extract_shop_location(&link_html);

                products.push(Product {
                    name,
                    price,
                    rating,
                    image_url,
                    product_url,
                    shop_location,
                });
                
                println!("  ✓ Found: {}", products.last().unwrap().name);
            }
        }

        println!("📦 DOM parsing extracted {} products", products.len());
        products
    }

    /// Extract product name from HTML
    fn extract_product_name(&self, html: &str) -> String {
        let fragment = Html::parse_fragment(html);
        
        // Try to find product name in span elements
        fragment
            .select(&Selector::parse("span").unwrap())
            .filter_map(|span| {
                let text = span.text().collect::<String>().trim().to_string();
                // Product name is usually longer, doesn't start with Rp, and not a number
                if text.len() > 15 
                    && !text.starts_with("Rp") 
                    && !text.contains('%') 
                    && !text.chars().all(|c| c.is_numeric() || c == '.' || c == ',')
                    && !text.contains("Kab.") 
                    && !text.contains("Kota") {
                    Some(text)
                } else {
                    None
                }
            })
            .next()
            .unwrap_or_default()
    }

    /// Extract product price from HTML
    fn extract_product_price(&self, html: &str) -> String {
        Html::parse_fragment(html)
            .select(&Selector::parse("span").unwrap())
            .filter_map(|span| {
                let text = span.text().collect::<String>().trim().to_string();
                if text.starts_with("Rp") {
                    Some(text)
                } else {
                    None
                }
            })
            .next()
            .unwrap_or_default()
    }

    /// Extract rating using regex
    fn extract_rating(&self, html: &str) -> Option<String> {
        use regex::Regex;
        let re = Regex::new(RATING_PATTERN).unwrap();
        re.captures(html)
            .and_then(|cap| cap.get(1))
            .map(|m| m.as_str().to_string())
    }

    /// Extract image URL from element
    fn extract_image_url(&self, link_elem: &scraper::ElementRef, img_selector: &Selector) -> String {
        link_elem
            .select(img_selector)
            .next()
            .and_then(|img| img.value().attr("src"))
            .unwrap_or("")
            .to_string()
    }

    /// Extract shop location from HTML
    fn extract_shop_location(&self, html: &str) -> Option<String> {
        Html::parse_fragment(html)
            .select(&Selector::parse("span").unwrap())
            .filter_map(|span| {
                let text = span.text().collect::<String>().trim().to_string();
                if INDONESIAN_CITIES.iter().any(|city| text.contains(city)) {
                    Some(text)
                } else {
                    None
                }
            })
            .next()
    }

    /// Parse products from __NEXT_DATA__ JSON
    pub fn parse_products_from_json(&self, html: &str, limit: usize) -> Option<Vec<Product>> {
        let json_str = html
            .split("__NEXT_DATA__")
            .nth(1)?
            .split("</script>")
            .next()?
            .trim_start_matches(r#" type="application/json">"#)
            .trim();

        let next_data: Value = serde_json::from_str(json_str).ok()?;
        self.extract_products_from_json_value(&next_data, limit)
    }

    /// Recursively extract products from JSON structure
    fn extract_products_from_json_value(&self, value: &Value, limit: usize) -> Option<Vec<Product>> {
        // Look for product data in various possible locations
        let mut products = Vec::new();

        // Strategy 1: Find arrays with product objects
        fn find_products<'a>(val: &'a Value, products: &mut Vec<Product>, limit: usize) {
            if products.len() >= limit {
                return;
            }

            match val {
                Value::Array(arr) => {
                    // Check if this array contains product objects
                    for item in arr {
                        if products.len() >= limit {
                            break;
                        }
                        
                        if let Some(obj) = item.as_object() {
                            // Try to parse as product
                            if let Some(product) = parse_product_from_json(obj) {
                                products.push(product);
                                continue;
                            }
                        }
                        
                        // Recurse into nested structures
                        find_products(item, products, limit);
                    }
                }
                Value::Object(obj) => {
                    // Try direct product parse
                    if let Some(product) = parse_product_from_json(obj) {
                        products.push(product);
                        return;
                    }
                    
                    // Recurse into object values
                    for value in obj.values() {
                        if products.len() >= limit {
                            break;
                        }
                        find_products(value, products, limit);
                    }
                }
                _ => {}
            }
        }

        fn parse_product_from_json(obj: &serde_json::Map<String, Value>) -> Option<Product> {
            // Must have at least name and price-like field
            let name = obj.get("name")
                .or_else(|| obj.get("title"))
                .or_else(|| obj.get("product_name"))?;
            
            let name_str = name.as_str()?.to_string();
            if name_str.len() < 3 {
                return None;
            }

            // Try various price field names
            let price = obj.get("price")
                .or_else(|| obj.get("priceInt"))
                .or_else(|| obj.get("product_price"))?;
            
            let price_str = if let Some(p) = price.as_str() {
                p.to_string()
            } else if let Some(p) = price.as_i64() {
                format!("Rp{}", p)
            } else {
                return None;
            };

            // Extract other fields
            let rating = obj.get("rating")
                .or_else(|| obj.get("ratingScore"))
                .and_then(|v| {
                    if let Some(s) = v.as_str() {
                        Some(s.to_string())
                    } else if let Some(n) = v.as_f64() {
                        Some(format!("{:.1}", n))
                    } else {
                        None
                    }
                });

            let image_url = obj.get("imageUrl")
                .or_else(|| obj.get("image"))
                .or_else(|| obj.get("imageURL"))
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();

            let product_url = obj.get("url")
                .or_else(|| obj.get("link"))
                .or_else(|| obj.get("productUrl"))
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();

            let shop_location = obj.get("shop")
                .and_then(|s| s.get("location"))
                .or_else(|| obj.get("shopLocation"))
                .or_else(|| obj.get("location"))
                .and_then(|l| l.as_str())
                .map(String::from);

            Some(Product {
                name: name_str,
                price: price_str,
                rating,
                image_url,
                product_url,
                shop_location,
            })
        }

        find_products(value, &mut products, limit);

        if products.is_empty() {
            None
        } else {
            println!("📦 JSON parsing extracted {} products", products.len());
            Some(products)
        }
    }
}
