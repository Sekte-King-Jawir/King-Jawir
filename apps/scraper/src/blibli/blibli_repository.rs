use anyhow::{Context, Result};
use scraper::{Html, Selector};
use std::thread;

use crate::browser::BrowserClient;
use crate::config::*;
use crate::blibli::blibli_model::BlibliProduct;

pub struct BlibliRepository {
    browser: BrowserClient,
}

impl BlibliRepository {
    pub fn new() -> Result<Self> {
        let browser = BrowserClient::new()?;
        Ok(Self { browser })
    }

    /// Fetch HTML content from Blibli search page
    pub fn fetch_search_page(&self, query: &str) -> Result<String> {
        let tab = self.browser.new_tab()?;
        tab.set_default_timeout(get_page_load_timeout());

        // Navigate directly to Blibli search page
        let search_url = format!("https://www.blibli.com/cari/{}", query.replace(" ", "%20"));
        println!("🌐 Navigating directly to Blibli search page: {}", search_url);
        tab.navigate_to(&search_url).context("Failed to navigate to Blibli search page")?;

        // Wait for search results page to load
        println!("⏳ Waiting for search results to load...");
        thread::sleep(std::time::Duration::from_secs(4));
        // Wait for product cards using selector check
        println!("🔍 Waiting for Blibli product cards to load...");
        let mut products_found = false;
        let max_attempts = 20; // 10 seconds max
        let product_check_script = r#"
            (function() {
                const productCards = document.querySelectorAll('a.elf-product-card');
                return productCards.length;
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
                        println!("   ⏳ Still loading... {} products found so far", count);
                    }
                }
            }
            thread::sleep(std::time::Duration::from_millis(500));
        }
        if !products_found {
            println!("⚠️  Timeout waiting for products, proceeding with what we have...");
        }
        // Dynamic scrolling
        println!("🔄 Starting dynamic scroll to load all Blibli products...");
        let get_product_count_script = r#"
            (function() {
                const productCards = document.querySelectorAll('a.elf-product-card');
                return productCards.length;
            })();
        "#;
        let mut previous_count = 0;
        let mut stable_count = 0;
        let max_scroll_attempts = 8;
        for scroll_attempt in 1..=max_scroll_attempts {
            let _ = tab.evaluate("window.scrollTo(0, document.body.scrollHeight);", false);
            thread::sleep(std::time::Duration::from_millis(800));
            let current_count = match tab.evaluate(get_product_count_script, false) {
                Ok(obj) => obj.value.and_then(|v| v.as_i64()).unwrap_or(0) as usize,
                Err(_) => 0,
            };
            println!("  Scroll {}/{}: {} products detected", scroll_attempt, max_scroll_attempts, current_count);
            if current_count == previous_count && current_count > 0 {
                stable_count += 1;
                if stable_count >= 2 {
                    println!("✅ Product count stable at {}, stopping scroll", current_count);
                    break;
                }
            } else {
                stable_count = 0;
                previous_count = current_count;
            }
            if scroll_attempt < max_scroll_attempts {
                thread::sleep(std::time::Duration::from_millis(400));
            }
        }
        let _ = tab.evaluate("window.scrollTo(0, 0);", false);
        thread::sleep(std::time::Duration::from_millis(500));
        println!("✅ Scrolling complete, extracting Blibli products...");
        let html_content = tab.get_content().context("Failed to get page content")?;
        Ok(html_content)
    }

    /// Extract price from product card with proper handling of discounts
    fn extract_price_from_card(&self, card: &scraper::ElementRef) -> String {
        // Try to get the discounted price first (els-product__fixed-price)
        let fixed_price_selector = Selector::parse(".els-product__fixed-price").unwrap();
        if let Some(fixed_price_elem) = card.select(&fixed_price_selector).next() {
            let price_texts: Vec<String> = fixed_price_elem.text().map(|s| s.to_string()).collect();
            if !price_texts.is_empty() {
                let price_text = price_texts.join("").trim().to_string();
                // Remove any non-numeric characters except dots and commas
                let clean_price_str = price_text.replace("Rp", "").replace(".", "").replace(",", "").trim().to_string();
                if !clean_price_str.is_empty() {
                    if let Ok(price_num) = clean_price_str.parse::<u64>() {
                        return self.format_price(price_num);
                    }
                }
            }
        }

        // Fallback: try to get any price text that starts with "Rp"
        let all_texts: Vec<String> = card.text().map(|s| s.to_string()).collect();
        for text in all_texts {
            let trimmed = text.trim();
            if trimmed.starts_with("Rp") {
                // Extract the price part by finding valid Rupiah format: Rp followed by digits and dots
                // Valid format: RpXX.XXX or RpXXX.XXX.XXX etc., but stop if pattern breaks
                let remaining = &trimmed[2..]; // Remove "Rp"
                let mut price_part = String::new();
                let mut dot_count = 0;
                let mut digits_after_last_dot = 0;

                for ch in remaining.chars() {
                    if ch.is_numeric() {
                        price_part.push(ch);
                        if dot_count > 0 {
                            digits_after_last_dot += 1;
                            // Stop after 3 digits following a dot (standard Rupiah format)
                            if digits_after_last_dot >= 3 {
                                break;
                            }
                        }
                    } else if ch == '.' && dot_count < 1 {
                        // Allow only one dot
                        price_part.push(ch);
                        dot_count += 1;
                        digits_after_last_dot = 0;
                    } else {
                        // Stop at first invalid character
                        break;
                    }
                }

                if !price_part.is_empty() && price_part.len() >= 3 {
                    // Clean and parse the price
                    let numeric_part = price_part.replace(".", "").replace(",", "");
                    if let Ok(price_num) = numeric_part.parse::<u64>() {
                        return self.format_price(price_num);
                    }
                }
            }
        }

        "Rp0".to_string()
    }

    /// Format price number to Indonesian format with dots as thousand separators
    fn format_price(&self, price: u64) -> String {
        let price_str = price.to_string();
        let mut result = String::new();
        let chars: Vec<char> = price_str.chars().collect();

        for (i, &ch) in chars.iter().enumerate() {
            if i > 0 && (chars.len() - i) % 3 == 0 {
                result.push('.');
            }
            result.push(ch);
        }

        format!("Rp{}", result)
    }

    /// Parse Blibli products from HTML using DOM selectors
    pub fn parse_products_from_dom(&self, html: &str, limit: usize) -> Vec<BlibliProduct> {
        let document = Html::parse_document(html);
        let card_selector = Selector::parse("a.elf-product-card").unwrap();
        let img_selector = Selector::parse("img").unwrap();
        let text_selector = Selector::parse("div").unwrap();
        let mut products = Vec::new();
        let mut seen_urls = std::collections::HashSet::new();
        println!("🔍 Searching for Blibli products...");
        for card in document.select(&card_selector) {
            if products.len() >= limit {
                break;
            }
            let product_url = card.value().attr("href").map(|href| {
                if href.starts_with("http") {
                    href.to_string()
                } else if href.starts_with('/') {
                    format!("https://www.blibli.com{}", href)
                } else {
                    format!("https://www.blibli.com/{}", href)
                }
            }).unwrap_or_default();
            if product_url.is_empty() || seen_urls.contains(&product_url) {
                continue;
            }
            seen_urls.insert(product_url.clone());
            let image_url = card.select(&img_selector).next().and_then(|img| img.value().attr("src").or_else(|| img.value().attr("data-src"))).map(|s| s.to_string()).unwrap_or_default();

            // Extract price more precisely from price wrapper
            let price = self.extract_price_from_card(&card);

            let all_texts: Vec<String> = card.select(&text_selector).map(|div| div.text().collect::<String>().trim().to_string()).filter(|text| !text.is_empty()).collect();
            let name = all_texts.iter().filter(|text| text.len() > 10 && !text.starts_with("Rp") && !text.contains("terjual")).max_by_key(|text| text.len()).cloned().unwrap_or_else(|| "Unknown Product".to_string());
            let rating = all_texts.iter().find(|text| text.contains('.') && text.parse::<f32>().map(|r| r <= 5.0).unwrap_or(false)).cloned();
            let sold = all_texts.iter().find(|text| text.to_lowercase().contains("terjual") || text.to_lowercase().contains("rb terjual")).cloned();
            let shop_location = all_texts.iter().find(|text| text.contains("Kab.") || text.contains("Kota") || text.contains("Jakarta") || text.contains("Bandung") || text.contains("Surabaya")).cloned();
            if !name.is_empty() && !price.is_empty() {
                products.push(BlibliProduct {
                    name,
                    price,
                    rating,
                    image_url,
                    product_url,
                    shop_location,
                    sold,
                });
            }
        }
        println!("📦 Extracted {} Blibli products from DOM", products.len());
        products
    }

    /// Main scraping method
    pub fn scrape(&self, query: &str, limit: usize) -> Result<Vec<BlibliProduct>> {
        println!("🛒 Starting Blibli scraping for: '{}'", query);
        let html = self.fetch_search_page(query)?;
        println!("✅ Got page content ({} bytes)", html.len());
        let products = self.parse_products_from_dom(&html, limit);
        println!("✅ Successfully extracted {} products", products.len());
        Ok(products)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use scraper::Html;

    #[test]
    fn test_extract_price_from_card_with_discount() {
        let html = r#"
            <a class="elf-product-card">
                <div class="els-product__price-wrapper">
                    <div class="els-product__price-top">
                        <div class="els-product__fixed-price-wrapper">
                            <div title="60.270" class="els-product__fixed-price">
                                <span class="els-product__fixed-price-label">Rp</span>
                                <span>60.270</span>
                            </div>
                        </div>
                        <span title="86.100" class="els-product__discount-price">86.100</span>
                        <div class="els-product__discount-wrapper">
                            <div class="els-promo-label b-discount b-small">
                                <div class="els-promo-label__text">30% </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        "#;

        let document = Html::parse_document(html);
        let card_selector = Selector::parse("a.elf-product-card").unwrap();
        let card = document.select(&card_selector).next().unwrap();

        let repo = BlibliRepository::new().unwrap();
        let price = repo.extract_price_from_card(&card);

        assert_eq!(price, "Rp60.270");
    }

    #[test]
    fn test_extract_price_from_card_without_discount() {
        let html = r#"
            <a class="elf-product-card">
                <div>Rp45.000</div>
                <div>Product name</div>
            </a>
        "#;

        let document = Html::parse_document(html);
        let card_selector = Selector::parse("a.elf-product-card").unwrap();
        let card = document.select(&card_selector).next().unwrap();

        let repo = BlibliRepository::new().unwrap();
        let price = repo.extract_price_from_card(&card);

        assert_eq!(price, "Rp45.000");
    }

    #[test]
    fn test_extract_price_from_card_mixed_content() {
        let html = r#"
            <a class="elf-product-card">
                <div>Rp58.05061.0505% Diskon 50%</div>
                <div>Product name with discount</div>
            </a>
        "#;

        let document = Html::parse_document(html);
        let card_selector = Selector::parse("a.elf-product-card").unwrap();
        let card = document.select(&card_selector).next().unwrap();

        let repo = BlibliRepository::new().unwrap();
        let price = repo.extract_price_from_card(&card);

        // Should extract clean price without discount info
        assert_eq!(price, "Rp58.050");
    }
}
