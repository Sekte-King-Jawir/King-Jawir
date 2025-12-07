use anyhow::{Context, Result};
use headless_chrome::{Browser, LaunchOptions};

use crate::config::*;

pub struct BrowserClient {
    browser: Browser,
}

impl BrowserClient {
    pub fn new() -> Result<Self> {
        let launch_options = Self::create_launch_options();
        let browser = Browser::new(launch_options)
            .context("Failed to launch browser")?;
        
        Ok(Self { browser })
    }

    fn create_launch_options() -> LaunchOptions<'static> {
        use std::ffi::OsStr;
        
        let user_agent_arg = Box::leak(format!("--user-agent={USER_AGENT}").into_boxed_str());
        
        // Set browser path from environment variable if available
        if let Ok(chrome_bin) = std::env::var("CHROME_BIN") {
            LaunchOptions::default_builder()
                .headless(true)
                .window_size(Some((BROWSER_WINDOW_WIDTH, BROWSER_WINDOW_HEIGHT)))
                .path(Some(chrome_bin.into()))
                .args(vec![
                    OsStr::new(user_agent_arg),
                    OsStr::new("--disable-blink-features=AutomationControlled"),
                    OsStr::new("--lang=id-ID"),
                    OsStr::new("--accept-lang=id-ID"),
                    OsStr::new("--disable-gpu"),
                    OsStr::new("--no-sandbox"),
                    OsStr::new("--disable-images"),
                ])
                .build()
                .expect("Failed to build launch options")
        } else {
            LaunchOptions::default_builder()
                .headless(true)
                .window_size(Some((BROWSER_WINDOW_WIDTH, BROWSER_WINDOW_HEIGHT)))
                .args(vec![
                    OsStr::new(user_agent_arg),
                    OsStr::new("--disable-blink-features=AutomationControlled"),
                    OsStr::new("--lang=id-ID"),
                    OsStr::new("--accept-lang=id-ID"),
                    OsStr::new("--disable-gpu"),
                    OsStr::new("--no-sandbox"),
                    OsStr::new("--disable-images"),
                ])
                .build()
                .expect("Failed to build launch options")
        }
    }

    pub fn new_tab(&self) -> Result<std::sync::Arc<headless_chrome::Tab>> {
        self.browser.new_tab()
            .context("Failed to create new tab")
    }
}
