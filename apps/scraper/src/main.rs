use anyhow::{Context, Result};
use axum::{
    extract::Query,
    http::StatusCode,
    response::{IntoResponse, Json},
    routing::get,
    Router,
};
use headless_chrome::{Browser, LaunchOptions};
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::ffi::OsStr;
use std::time::Duration;
use tower_http::cors::{Any, CorsLayer};

#[derive(Debug, Serialize, Deserialize)]
struct Product {
    name: String,
    price: String,
    rating: Option<String>,
    image_url: String,
    product_url: String,
    shop_location: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ScraperQuery {
    #[serde(default = "default_query")]
    query: String,
    #[serde(default = "default_limit")]
    limit: usize,
}

fn default_query() -> String {
    "iphone".to_string()
}

fn default_limit() -> usize {
    10
}

#[derive(Serialize)]
struct ScraperResponse {
    success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<Vec<Product>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
    count: usize,
}

#[tokio::main]
async fn main() {
    // Setup CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        .route("/api/scraper", get(scraper_handler))
        .layer(cors);

    // Start server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4103")
        .await
        .expect("Failed to bind to port 4103");

    println!("🚀 Tokopedia Scraper API running on http://0.0.0.0:4103");
    println!("📡 Endpoint: GET http://0.0.0.0:4103/api/scraper?query=iphone&limit=10");

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}

async fn scraper_handler(Query(params): Query<ScraperQuery>) -> impl IntoResponse {
    println!("🔍 New scraping request: query='{}', limit={}", params.query, params.limit);
    
    match scrape_tokopedia(&params.query, params.limit) {
        Ok(products) => {
            let count = products.len();
            println!("✅ Successfully scraped {} products", count);
            
            (
                StatusCode::OK,
                Json(ScraperResponse {
                    success: true,
                    data: Some(products),
                    error: None,
                    count,
                }),
            )
        }
        Err(e) => {
            let error_msg = format!("Failed to scrape: {}", e);
            println!("❌ Error: {}", error_msg);
            
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ScraperResponse {
                    success: false,
                    data: None,
                    error: Some(error_msg),
                    count: 0,
                }),
            )
        }
    }
}

fn scrape_tokopedia(query: &str, limit: usize) -> Result<Vec<Product>> {
    let launch_options = LaunchOptions {
        // Running non-headless can bypass some anti-bot checks; flip to true if needed
        headless: false,
        window_size: Some((1920, 1080)),
        // Use a real user agent to avoid immediate blocking
        args: vec![
            OsStr::new("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"),
            OsStr::new("--disable-blink-features=AutomationControlled"),
            OsStr::new("--lang=id-ID"),
            OsStr::new("--accept-lang=id-ID"),
            OsStr::new("--disable-gpu"),
            OsStr::new("--no-sandbox"),
        ],
        ..Default::default()
    };

    let browser = Browser::new(launch_options).context("Failed to launch browser")?;
    let tab = browser.new_tab().context("Failed to create new tab")?;

    // Keep timeouts short to avoid long stalls
    tab.set_default_timeout(Duration::from_secs(10));

    // ob=3 -> Lowest Price
    // rt=4,5 -> Rating 4 and 5
    let url = format!(
        "https://www.tokopedia.com/search?st=product&q={}&ob=3&rt=4,5",
        urlencoding::encode(query)
    );

    println!("🌐 Navigating to {}", url);
    tab.navigate_to(&url).context("Failed to navigate to url")?;
    // Ensure navigation completes
    let _ = tab.wait_until_navigated();
    
    println!("⏳ Waiting for page to fully load and render...");

    // Wait much longer for full hydration (React lazy loading)
    std::thread::sleep(Duration::from_secs(8));

    // Try to trigger any pending renders by getting content multiple times
    let _ = tab.get_content();
    std::thread::sleep(Duration::from_millis(500));
    
    // Parse HTML directly - more reliable than evaluate
    let html_content = tab.get_content().context("Failed to get page content")?;
    println!("✅ Got page content ({} bytes)", html_content.len());
    
    // Try to extract __NEXT_DATA__ from HTML
    if let Some(start) = html_content.find(r#"<script id="__NEXT_DATA__" type="application/json">"#) {
        if let Some(data_start) = html_content[start..].find('>') {
            let json_start = start + data_start + 1;
            if let Some(json_end) = html_content[json_start..].find("</script>") {
                let json_str = &html_content[json_start..json_start + json_end];
                println!("🔍 Found __NEXT_DATA__ script ({} bytes)", json_str.len());
                
                if let Ok(next_data) = serde_json::from_str::<Value>(json_str) {
                    println!("✅ Parsed __NEXT_DATA__ successfully");
                    if let Some(products) = extract_from_next_data(&next_data, limit) {
                        if !products.is_empty() {
                            return Ok(products);
                        }
                    }
                }
            }
        }
    }

    println!("⚠️  __NEXT_DATA__ not found or empty, trying DOM extraction...");
    
    // Parse DOM for visible product cards
    println!("🔎 Parsing product cards from page...");
    let document = Html::parse_document(&html_content);
    let mut products = Vec::new();
    
    // Find the main product container
    let container_selector = Selector::parse(r#"div[data-testid="divSRPContentProducts"]"#)
        .expect("Invalid container selector");
    
    if let Some(container) = document.select(&container_selector).next() {
        println!("✅ Found product container");
        
        // Find all product link elements - these contain the full product card
        let product_selector = Selector::parse("a[href*='tokopedia.com/']")
            .expect("Invalid product selector");
        
        let product_elements: Vec<_> = container.select(&product_selector).collect();
        println!("✅ Found {} product cards", product_elements.len());
        
        // Selectors for extracting data from each card
        let name_selector = Selector::parse("span").unwrap();
        let price_selector = Selector::parse("div").unwrap();
        let img_selector = Selector::parse(r#"img[alt="product-image"]"#).unwrap();
        
        for (idx, product_el) in product_elements.iter().take(limit).enumerate() {
            println!("📦 Processing product {}/{}", idx + 1, limit.min(product_elements.len()));
            
            // Extract product URL
            let product_url = match product_el.value().attr("href") {
                Some(url) => url.to_string(),
                None => continue,
            };
            
            // Extract product name - find span containing the title
            let mut name = String::new();
            for span in product_el.select(&name_selector) {
                let text: String = span.text().collect::<String>().trim().to_string();
                // Product names are usually > 20 chars and contain product info
                if text.len() > 20 && !text.starts_with("Rp") {
                    name = text;
                    break;
                }
            }
            
            if name.is_empty() {
                continue; // Skip if no valid name found
            }
            
            // Extract price - find div containing "Rp"
            let mut price = String::new();
            for div in product_el.select(&price_selector) {
                let text: String = div.text().collect::<String>().trim().to_string();
                if text.starts_with("Rp") && text.len() < 30 {
                    price = text;
                    break;
                }
            }
            
            // Extract rating - look for rating pattern (e.g., "4.8", "5.0")
            let rating = {
                let html = product_el.html();
                // Search for rating pattern: digit.digit
                if let Ok(rating_regex) = regex::Regex::new(r#">(\d\.\d)<"#) {
                    rating_regex.captures(&html)
                        .and_then(|cap| cap.get(1))
                        .map(|m| m.as_str().to_string())
                } else {
                    None
                }
            };
            
            // Extract image URL
            let image_url = product_el.select(&img_selector)
                .next()
                .and_then(|img| img.value().attr("src"))
                .unwrap_or("")
                .to_string();
            
            // Extract shop location - typically the last text span in location section
            let shop_location = {
                let html = product_el.html();
                // Common Indonesian cities/regions
                let cities = ["Jakarta", "Bandung", "Surabaya", "Malang", "Kab.", "Kota"];
                cities.iter()
                    .find_map(|city| {
                        html.find(city).map(|pos| {
                            // Extract the location text
                            let after = &html[pos..];
                            let end = after.find('<').unwrap_or(50);
                            after[..end].trim().to_string()
                        })
                    })
            };
            
            println!("  ✅ {}", &name[..name.len().min(60)]);
            
            products.push(Product {
                name,
                price,
                rating,
                image_url,
                product_url,
                shop_location,
            });
        }
    } else {
        println!("❌ Product container not found");
    }
    
    if products.is_empty() {
        println!("⚠️  No products extracted");
    }
    
    Ok(products)
}

fn extract_from_next_data(v: &Value, limit: usize) -> Option<Vec<Product>> {
    // Recursively search for candidate product arrays
    fn collect_arrays<'a>(val: &'a Value, out: &mut Vec<&'a Vec<Value>>) {
        match val {
            Value::Array(a) => {
                // Check if this looks like a product array
                if let Some(first) = a.first() {
                    if let Some(obj) = first.as_object() {
                        if obj.contains_key("name") || obj.contains_key("title") || 
                           obj.contains_key("id") || obj.contains_key("productName") {
                            out.push(a);
                        }
                    }
                }
            }
            Value::Object(map) => {
                for (_k, v) in map {
                    collect_arrays(v, out);
                }
            }
            _ => {}
        }
    }

    fn get_str<'a>(obj: &'a serde_json::Map<String, Value>, key: &str) -> Option<String> {
        obj.get(key).and_then(|v| match v {
            Value::String(s) => Some(s.clone()),
            Value::Number(n) => Some(n.to_string()),
            _ => None,
        })
    }

    fn get_nested_str(obj: &serde_json::Map<String, Value>, path: &[&str]) -> Option<String> {
        let mut cur = Value::Object(obj.clone());
        for (i, k) in path.iter().enumerate() {
            match &cur {
                Value::Object(m) => {
                    if let Some(v) = m.get(*k) {
                        cur = v.clone();
                    } else {
                        return None;
                    }
                }
                _ => return None,
            }
            if i == path.len() - 1 {
                return match cur {
                    Value::String(s) => Some(s),
                    Value::Number(n) => Some(n.to_string()),
                    _ => None,
                };
            }
        }
        None
    }

    fn to_product(obj: &serde_json::Map<String, Value>) -> Option<Product> {
        // Try multiple possible field names
        let name = get_str(obj, "name")
            .or_else(|| get_str(obj, "title"))
            .or_else(|| get_str(obj, "productName"))
            .or_else(|| get_str(obj, "product_name"))?;
        
        let price = get_str(obj, "priceDisplay")
            .or_else(|| get_str(obj, "price"))
            .or_else(|| get_str(obj, "priceRange"))
            .or_else(|| get_nested_str(obj, &["priceRange", "min"]))
            .unwrap_or_else(|| "N/A".to_string());
        
        let rating = get_str(obj, "rating")
            .or_else(|| get_str(obj, "ratingAverage"))
            .or_else(|| get_str(obj, "rate"));
        
        let image_url = get_str(obj, "imageUrl")
            .or_else(|| get_str(obj, "image_url"))
            .or_else(|| get_str(obj, "image"))
            .or_else(|| get_nested_str(obj, &["image", "url"]))
            .or_else(|| get_nested_str(obj, &["imageUrl", "cover"]))
            .unwrap_or_default();
        
        let product_url = get_str(obj, "url")
            .or_else(|| get_str(obj, "productUrl"))
            .or_else(|| get_str(obj, "product_url"))
            .or_else(|| get_str(obj, "link"))
            .unwrap_or_default();
        
        let shop_location = get_nested_str(obj, &["shop", "city"])
            .or_else(|| get_nested_str(obj, &["shop", "location"]))
            .or_else(|| get_str(obj, "shopCity"))
            .or_else(|| get_str(obj, "shop_city"));

        Some(Product {
            name,
            price,
            rating,
            image_url,
            product_url,
            shop_location,
        })
    }

    let mut arrays = Vec::new();
    collect_arrays(v, &mut arrays);

    println!("🔎 Found {} potential product arrays in data", arrays.len());

    // Find the first array with objects that look like products
    for (idx, arr) in arrays.iter().enumerate() {
        let mut collected: Vec<Product> = Vec::new();
        for item in arr.iter() {
            if let Value::Object(obj) = item {
                if let Some(p) = to_product(obj) {
                    collected.push(p);
                    if collected.len() >= limit { break; }
                }
            }
        }
        if !collected.is_empty() {
            println!("✅ Successfully extracted {} products from array #{}", collected.len(), idx + 1);
            return Some(collected);
        }
    }

    None
}

fn extract_from_api_response(val: &Value, limit: usize) -> Option<Vec<Product>> {
    // Handle GraphQL response
    if let Some(arr) = val.as_array() {
        if let Some(first) = arr.first() {
            if let Some(data_obj) = first.as_object() {
                if let Some(data_val) = data_obj.get("data") {
                    if let Some(ace_data) = data_val.as_object() {
                        if let Some(search_product) = ace_data.get("ace_search_product_v4") {
                            if let Some(header) = search_product.as_object().and_then(|o| o.get("header")) {
                                if let Some(products_arr) = header.as_object().and_then(|o| o.get("data")) {
                                    return parse_product_array(products_arr, limit);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Handle ACE API response
    if let Some(obj) = val.as_object() {
        if let Some(data) = obj.get("data") {
            if let Some(products_arr) = data.as_object().and_then(|o| o.get("products")) {
                return parse_product_array(products_arr, limit);
            }
        }
    }

    None
}

fn parse_product_array(val: &Value, limit: usize) -> Option<Vec<Product>> {
    if let Some(arr) = val.as_array() {
        let mut products = Vec::new();
        for item in arr.iter().take(limit) {
            if let Some(obj) = item.as_object() {
                let name = obj.get("name")
                    .or_else(|| obj.get("title"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string();
                
                let price = obj.get("price")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string())
                    .or_else(|| obj.get("price").and_then(|v| v.as_i64()).map(|n| n.to_string()))
                    .unwrap_or_default();
                
                let rating = obj.get("rating")
                    .or_else(|| obj.get("ratingAverage"))
                    .and_then(|v| v.as_str().or_else(|| v.as_f64().map(|f| f.to_string().leak() as &str)))
                    .map(|s| s.to_string());
                
                let image_url = obj.get("imageUrl")
                    .or_else(|| obj.get("image_url"))
                    .or_else(|| obj.get("image"))
                    .and_then(|v| {
                        if let Some(s) = v.as_str() { Some(s) }
                        else { v.as_object().and_then(|o| o.get("url")).and_then(|u| u.as_str()) }
                    })
                    .unwrap_or("")
                    .to_string();
                
                let product_url = obj.get("url")
                    .or_else(|| obj.get("productUrl"))
                    .or_else(|| obj.get("link"))
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string();
                
                let shop_location = obj.get("shop")
                    .and_then(|s| s.as_object())
                    .and_then(|o| o.get("city").or_else(|| o.get("location")))
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());

                if !name.is_empty() {
                    products.push(Product {
                        name,
                        price,
                        rating,
                        image_url,
                        product_url,
                        shop_location,
                    });
                }
            }
        }
        if !products.is_empty() {
            return Some(products);
        }
    }
    None
}

fn collect_products_via_dom(tab: &headless_chrome::Tab, limit: usize) -> Result<Vec<Product>> {
        let js = r#"(() => {
            function txt(el){ if(!el) return ''; return (el.getAttribute('aria-label') || el.textContent || '').trim(); }
            function queryDeep(root, selector){
                const queue = [root];
                const seen = new Set();
                while(queue.length){
                    const node = queue.shift();
                    if(!node || seen.has(node)) continue; seen.add(node);
                    if(node.nodeType === 1){
                        try { const m = node.matches && node.matches(selector); if(m) return node; } catch(e) {}
                        if(node.shadowRoot) queue.push(node.shadowRoot);
                        const children = node.children || [];
                        for(let i=0;i<children.length;i++){ queue.push(children[i]); }
                    }
                }
                return null;
            }
            function queryAllCards(){
                const res = [];
                const queue = [document.documentElement];
                const seen = new Set();
                while(queue.length){
                    const node = queue.shift(); if(!node || seen.has(node)) continue; seen.add(node);
                    if(node.nodeType === 1){
                        const el = node;
                        if(el.getAttribute && el.getAttribute('data-testid') === 'master-product-card'){
                            res.push(el);
                        }
                        if(el.shadowRoot) queue.push(el.shadowRoot);
                        const children = el.children || [];
                        for(let i=0;i<children.length;i++){ queue.push(children[i]); }
                    }
                }
                return res;
            }
            const pool = queryAllCards();
            const items = pool.map(c => {
                const link = queryDeep(c, "a[data-testid^='lnkSRP'], a[href]");
                const nameEl = queryDeep(c, "[data-testid='spnSRPProdName'], a[data-testid^='lnkSRP'], a[aria-label]");
                const priceEl = queryDeep(c, "[data-testid='spnSRPProdPrice'], [data-testid='lblProductPrice'], [data-testid='spnSRPProdPriceDiscount'], [data-testid='price']");
                const ratingEl = queryDeep(c, "[data-testid='lblSRPProdRating'], [data-testid='icnStarRating'] + span");
                const imgEl = queryDeep(c, "img[data-testid='imgSRPProdMain'], img");
                const locEl = queryDeep(c, "[data-testid='lblSRPProdLocation'], [data-testid='lblShopLocation']");
                const href = link ? (link.href || link.getAttribute('href') || '') : '';
                const name = txt(nameEl);
                const price = txt(priceEl);
                const rating = txt(ratingEl);
                const img = imgEl ? (imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '') : '';
                const loc = txt(locEl);
                return { name, price, rating: rating || null, image_url: img, product_url: href, shop_location: loc || null };
            });
            return items;
        })()"#;
    let mut eval_res = tab.evaluate(js, true)?;
    if let Some(val) = eval_res.value.take() {
        if let Ok(mut products) = serde_json::from_value::<Vec<Product>>(val) {
            products.retain(|p| !p.name.is_empty() && !p.product_url.is_empty());
            if products.len() > limit { products.truncate(limit); }
            return Ok(products);
        }
    }
    Ok(vec![])
}