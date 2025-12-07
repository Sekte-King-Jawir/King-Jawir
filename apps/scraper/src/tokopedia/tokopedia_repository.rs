use anyhow::{Context, Result};
use scraper::{Html, Selector};
use serde_json::Value;
use std::thread;

use crate::browser::BrowserClient;
use crate::config::*;
use crate::tokopedia::tokopedia_model::Product;

/// Safely truncate a string to a maximum number of characters (not bytes)
/// This respects Unicode character boundaries to avoid panics
fn truncate_str(s: &str, max_chars: usize) -> &str {
    match s.char_indices().nth(max_chars) {
        None => s,
        Some((idx, _)) => &s[..idx],
    }
}

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
        println!("🌐 Creating new browser tab...");
        let tab = self.browser.new_tab()?;
        println!("✅ Browser tab created successfully");
        
        tab.set_default_timeout(get_page_load_timeout());
        println!("⏱️  Set page load timeout to {} seconds", PAGE_LOAD_TIMEOUT_SECS);

        println!("🚀 Navigating to: {}", url);
        tab.navigate_to(url).context("Failed to navigate to URL")?;
        println!("✅ Navigation initiated");

        // Check if page loaded by getting title
        println!("🔍 Checking if page loaded...");
        match tab.evaluate("document.title", false) {
            Ok(obj) => {
                let title = match obj.value {
                    Some(v) => v.as_str().map(|s| s.to_string()),
                    None => None,
                };
                if let Some(title) = title {
                    println!("📄 Page title: {}", title);
                } else {
                    println!("⚠️  Could not get page title");
                }
            }
            Err(e) => {
                println!("❌ Failed to evaluate page title: {}", e);
                return Err(anyhow::anyhow!("Page failed to load: {}", e));
            }
        }

        // Wait for initial page structure to load
        println!("⏳ Waiting for page structure...");
        thread::sleep(std::time::Duration::from_secs(3));

        // Wait for product cards using EXACT SAME script as scrolling detection
        println!("🔍 Waiting for product cards to load...");
        let mut products_found = false;
        let max_attempts = 20; // 10 seconds max (20 * 500ms)
        
        // Use IDENTICAL script as get_product_count_script
        let product_check_script = r#"
            (function() {
                const container = document.querySelector('div[data-testid="divSRPContentProducts"]');
                if (!container) return 0;
                
                const productLinks = container.querySelectorAll('a[href*="tokopedia.com"]');
                let validProducts = 0;
                const seenUrls = new Set();
                
                for (const link of productLinks) {
                    const href = link.getAttribute('href') || '';
                    
                    // Make full URL if relative
                    let fullUrl = href;
                    if (!href.startsWith('http')) {
                        if (href.startsWith('/')) {
                            fullUrl = 'https://www.tokopedia.com' + href;
                        }
                    }
                    
                    // Basic validation - exclude search/discovery/promo pages
                    if (!fullUrl || 
                        fullUrl.includes('/search') || 
                        fullUrl.includes('/discovery/') || 
                        fullUrl.includes('/top-ads/') || 
                        fullUrl.includes('/promo/') ||
                        seenUrls.has(fullUrl)) {
                        continue;
                    }
                    
                    seenUrls.add(fullUrl);
                    
                    // Simplified check: just verify link has some text content
                    const textContent = link.textContent.trim();
                    if (textContent.length > 10) {
                        validProducts++;
                    }
                }
                
                return validProducts;
            })();
        "#;
        
        for attempt in 1..=max_attempts {
            let result = tab.evaluate(product_check_script, false);
            if let Ok(obj) = result {
                if let Some(value) = obj.value {
                    let count = value.as_i64().unwrap_or(0);
                    
                    if count >= 1 {
                        println!("✅ {} product cards ready after {:.1}s", count, attempt as f32 * 0.5);
                        products_found = true;
                        break;
                    } else if attempt % 4 == 0 {
                        println!("   ⏳ Still loading... {count} products found so far");
                    }
                }
            }
            
            thread::sleep(std::time::Duration::from_millis(500));
        }
        
        if !products_found {
            println!("⚠️  Timeout waiting for products, proceeding with what we have...");
        }

        // Dynamic scrolling: continue until no new products appear
        // Using SAME validation logic as initial wait
        println!("🔄 Starting dynamic scroll to load all products...");
        
        let get_product_count_script = r#"
            (function() {
                const container = document.querySelector('div[data-testid="divSRPContentProducts"]');
                if (!container) return 0;
                
                const productLinks = container.querySelectorAll('a[href*="tokopedia.com"]');
                let validProducts = 0;
                const seenUrls = new Set();
                
                for (const link of productLinks) {
                    const href = link.getAttribute('href') || '';
                    
                    // Make full URL if relative
                    let fullUrl = href;
                    if (!href.startsWith('http')) {
                        if (href.startsWith('/')) {
                            fullUrl = 'https://www.tokopedia.com' + href;
                        }
                    }
                    
                    // Basic validation - exclude search/discovery/promo pages
                    if (!fullUrl || 
                        fullUrl.includes('/search') || 
                        fullUrl.includes('/discovery/') || 
                        fullUrl.includes('/top-ads/') || 
                        fullUrl.includes('/promo/') ||
                        seenUrls.has(fullUrl)) {
                        continue;
                    }
                    
                    seenUrls.add(fullUrl);
                    
                    // Simplified check: just verify link has some text content
                    const textContent = link.textContent.trim();
                    if (textContent.length > 10) {
                        validProducts++;
                    }
                }
                
                return validProducts;
            })();
        "#;
        
        let mut previous_count = 0;
        let mut stable_count = 0;
        let max_scroll_attempts = 8;
        
        for scroll_attempt in 1..=max_scroll_attempts {
            // Scroll to bottom
            let _ = tab.evaluate("window.scrollTo(0, document.body.scrollHeight);", false);
            
            // Wait for content to load after scroll
            thread::sleep(std::time::Duration::from_millis(800));
            
            // Get current product count
            let current_count = match tab.evaluate(get_product_count_script, false) {
                Ok(obj) => obj.value.and_then(|v| v.as_i64()).unwrap_or(0) as usize,
                Err(_) => 0,
            };
            
            println!("  Scroll {scroll_attempt}/{max_scroll_attempts}: {current_count} products detected");
            
            // If product count hasn't changed, increment stable counter
            if current_count == previous_count && current_count > 0 {
                stable_count += 1;
                // If stable for 2 consecutive checks, we're done
                if stable_count >= 2 {
                    println!("✅ Product count stable at {current_count}, stopping scroll");
                    break;
                }
            } else {
                stable_count = 0;
                previous_count = current_count;
            }
            
            // Additional wait if this is not the last attempt
            if scroll_attempt < max_scroll_attempts {
                thread::sleep(std::time::Duration::from_millis(400));
            }
        }
        
        // Scroll back to top to ensure all elements are in DOM
        let _ = tab.evaluate("window.scrollTo(0, 0);", false);
        thread::sleep(std::time::Duration::from_millis(500));
        
        println!("✅ Scrolling complete, extracting products...");

        let html_content = tab.get_content().context("Failed to get page content")?;
        Ok(html_content)
    }

    /// Parse products from HTML using DOM selectors
    pub fn parse_products_from_dom(&self, html: &str, limit: usize) -> Vec<Product> {
        let document = Html::parse_document(html);
        
        // Strategy 1: Use data-testid attribute for container (more stable)
        let container_selector = Selector::parse(r#"div[data-testid="divSRPContentProducts"]"#).unwrap();
        let link_selector = Selector::parse("a[href*='tokopedia.com']").unwrap();
        let img_selector = Selector::parse("img[alt='product-image']").unwrap();
        let span_selector = Selector::parse("span").unwrap();

        let mut products = Vec::new();
        let mut seen_urls = std::collections::HashSet::new();

        println!("🔍 Searching for products with stable selectors...");

        // Try to find the product container first
        let product_links: Vec<_> = if let Some(container) = document.select(&container_selector).next() {
            println!("  ✓ Found product container with data-testid");
            container.select(&link_selector).collect()
        } else {
            println!("  ⚠ Container not found, searching entire document");
            document.select(&link_selector).collect()
        };

        println!("  Found {} potential product links", product_links.len());

        for link_elem in product_links {
            // Extract and validate product URL
            let product_url = link_elem.value().attr("href").unwrap_or("").to_string();
            
            // Make full URL if relative
            let full_url = if product_url.starts_with("http") {
                product_url.clone()
            } else if product_url.starts_with('/') {
                format!("https://www.tokopedia.com{product_url}")
            } else {
                product_url.clone()
            };
            
            // Validate URL - must be a product page, not search or discovery
            if full_url.is_empty() 
                || full_url.contains("/search")
                || full_url.contains("/discovery/") 
                || full_url.contains("/top-ads/")
                || full_url.contains("/promo/")
                || seen_urls.contains(&full_url) {
                continue;
            }

            seen_urls.insert(full_url.clone());

            // Extract product name - find longest span text (product names are usually long)
            let name = link_elem
                .select(&span_selector)
                .map(|span| span.text().collect::<String>().trim().to_string())
                .filter(|text| {
                    text.len() > 15 // Product names are usually longer than 15 chars
                    && !text.starts_with("Rp") // Not a price
                    && !text.contains("terjual") // Not sold count
                    && !text.chars().all(|c| c.is_numeric() || c == '.' || c == ',') // Not just numbers
                })
                .max_by_key(|text| text.len()) // Take the longest text (likely product name)
                .unwrap_or_default();

            // Extract price - collect ALL text with "Rp" and debug
            let all_price_candidates: Vec<String> = link_elem
                .descendants()
                .filter_map(|node| {
                    node.value().as_text().map(|t| t.trim().to_string())
                })
                .filter(|text| {
                    text.starts_with("Rp") 
                    && !text.contains("Cashback")
                    && !text.contains('%')
                })
                .collect();
            
            // Debug: show all candidates
            if !all_price_candidates.is_empty() && all_price_candidates.len() <= 5 {
                println!("    💰 Price candidates: {all_price_candidates:?}");
            }
            
            // Pick the longest one as it's likely the actual price
            let price = all_price_candidates
                .iter()
                .max_by_key(|text| text.len())
                .cloned()
                .unwrap_or_default();

            // Debug output
            if !name.is_empty() || !price.is_empty() {
                println!("  🔍 Debug: name='{}', price='{}', url='{}'", 
                    if name.is_empty() { "EMPTY" } else { truncate_str(&name, 30) },
                    if price.is_empty() { "EMPTY" } else { &price },
                    truncate_str(&full_url, 50)
                );
            }

            // Only proceed if we have valid name and price
            if name.is_empty() || price.is_empty() {
                continue;
            }

            // Extract rating - look for numeric pattern like "4.8" or "5.0"
            let rating = link_elem
                .select(&span_selector)
                .filter_map(|span| {
                    let text = span.text().collect::<String>().trim().to_string();
                    // Rating pattern: single digit, dot, single digit (e.g., "4.8")
                    if text.len() >= 3 && text.len() <= 4 
                        && text.contains('.') 
                        && text.chars().filter(|c| c.is_numeric()).count() == 2 {
                        Some(text)
                    } else {
                        None
                    }
                })
                .next();

            // Extract image URL using stable alt attribute
            let image_url = link_elem
                .select(&img_selector)
                .next()
                .and_then(|img| {
                    img.value()
                        .attr("src")
                        .or_else(|| img.value().attr("data-src"))
                })
                .unwrap_or("")
                .to_string();

            // Extract shop location - find span with city names
            let shop_location = link_elem
                .select(&span_selector)
                .map(|span| span.text().collect::<String>().trim().to_string())
                .filter(|text| {
                    // Match common Indonesian city/region names
                    INDONESIAN_CITIES.iter().any(|city| text.contains(city))
                })
                .last(); // Usually the last matching span is the location

            // Extract sold count - look for text containing "terjual"
            let sold = link_elem
                .select(&span_selector)
                .map(|span| span.text().collect::<String>().trim().to_string())
                .find(|text| {
                    text.to_lowercase().contains("terjual") ||
                    text.to_lowercase().contains("rb terjual")
                });

            products.push(Product {
                name,
                price,
                rating,
                image_url,
                product_url: full_url.clone(),
                shop_location,
                sold,
            });
            
            println!("  ✓ Found: {} - {}", products.last().unwrap().name, products.last().unwrap().price);

            if products.len() >= limit {
                break;
            }
        }

        println!("📦 DOM parsing extracted {} products", products.len());
        products
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
        fn find_products(val: &Value, products: &mut Vec<Product>, _limit: usize) {
            match val {
                Value::Array(arr) => {
                    // Check if this array contains product objects
                    for item in arr {
                        if let Some(obj) = item.as_object() {
                            // Try to parse as product
                            if let Some(product) = parse_product_from_json(obj) {
                                products.push(product);
                                continue;
                            }
                        }
                        
                        // Recurse into nested structures
                        find_products(item, products, _limit);
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
                        find_products(value, products, _limit);
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
                format!("Rp{p}")
            } else {
                return None;
            };

            // Extract other fields
            let rating = obj.get("rating")
                .or_else(|| obj.get("ratingScore"))
                .and_then(|v| {
                    if let Some(s) = v.as_str() {
                        Some(s.to_string())
                    } else { v.as_f64().map(|n| format!("{n:.1}")) }
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

            let sold = obj.get("sold")
                .or_else(|| obj.get("soldCount"))
                .or_else(|| obj.get("totalSold"))
                .and_then(|v| {
                    if let Some(s) = v.as_str() {
                        Some(s.to_string())
                    } else { v.as_i64().map(|n| format!("{n}")) }
                });

            Some(Product {
                name: name_str,
                price: price_str,
                rating,
                image_url,
                product_url,
                shop_location,
                sold,
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
