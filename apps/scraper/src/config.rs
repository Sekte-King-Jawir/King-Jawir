use std::time::Duration;

pub const DEFAULT_QUERY: &str = "iphone";
pub const DEFAULT_LIMIT: usize = 10;
pub const SERVER_HOST: &str = "0.0.0.0";
pub const SERVER_PORT: u16 = 4103;

pub const BROWSER_WINDOW_WIDTH: u32 = 1920;
pub const BROWSER_WINDOW_HEIGHT: u32 = 1080;
pub const PAGE_LOAD_TIMEOUT_SECS: u64 = 15; // Increased for dynamic loading

pub const USER_AGENT: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
pub const TOKOPEDIA_BASE_URL: &str = "https://www.tokopedia.com";
pub const SEARCH_ENDPOINT: &str = "/search";

// Indonesian cities for location extraction
pub const INDONESIAN_CITIES: &[&str] = &[
    "Jakarta", "Bandung", "Surabaya", "Malang", "Kab.", "Kota",
    "Semarang", "Yogyakarta", "Medan", "Makassar", "Bali"
];

pub fn default_query() -> String {
    DEFAULT_QUERY.to_string()
}

pub fn default_limit() -> usize {
    DEFAULT_LIMIT
}

pub fn get_page_load_timeout() -> Duration {
    Duration::from_secs(PAGE_LOAD_TIMEOUT_SECS)
}
