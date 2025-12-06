/**
 * Price Formatting Utilities
 * 
 * @description Provides consistent price formatting functions for Indonesian Rupiah
 * across the web application
 * 
 * @module lib/format
 */

/**
 * Formats a number as Indonesian Rupiah currency
 * 
 * @param num - Number to format
 * @returns Formatted string with Rupiah symbol and thousands separators
 * 
 * @example
 * formatRupiah(1500000) // "Rp1.500.000"
 */
export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

/**
 * Alias for formatRupiah (for API consistency)
 * 
 * @param amount - Amount to format
 * @returns Formatted Rupiah string
 */
export function formatPrice(amount: number): string {
  return formatRupiah(amount)
}

/**
 * Formats a number with Indonesian thousand separators
 * 
 * @param num - Number to format
 * @returns Formatted string with dots as thousand separators
 * 
 * @example
 * formatNumber(1234567) // "1.234.567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}
