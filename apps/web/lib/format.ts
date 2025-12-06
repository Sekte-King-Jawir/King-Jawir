/**
 * Price formatting utilities
 * For consistent price display across the application
 */

/**
 * Format number to Indonesian Rupiah currency
 * @param num - Number to format
 * @returns Formatted string (e.g., "Rp1.234.567")
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
 * Alias for formatRupiah (for consistency with API)
 * @param amount - Amount to format
 * @returns Formatted string (e.g., "Rp1.234.567")
 */
export function formatPrice(amount: number): string {
  return formatRupiah(amount)
}

/**
 * Format number with thousand separators (Indonesian locale)
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.234.567")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}
