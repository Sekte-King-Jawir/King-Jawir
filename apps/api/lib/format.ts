/**
 * Data Formatting Utilities
 * 
 * @description Provides consistent formatting functions for dates, numbers, and currency
 * across the API with Indonesian locale support
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
  return `Rp${num.toLocaleString('id-ID')}`
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
  return num.toLocaleString('id-ID')
}

/**
 * Formats a date to Indonesian locale
 * 
 * @param date - Date object or ISO string to format
 * @param options - Optional Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string in Indonesian
 * 
 * @example
 * formatDate(new Date()) // "6 Desember 2025"
 * formatDate(new Date(), { dateStyle: 'short' }) // "06/12/2025"
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(
    'id-ID',
    options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ).format(dateObj)
}

/**
 * Formats a date as relative time in Indonesian
 * 
 * @param date - Date object or ISO string
 * @returns Human-readable relative time string
 * 
 * @example
 * formatRelativeTime(yesterday) // "1 hari yang lalu"
 * formatRelativeTime(justNow) // "Baru saja"
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit yang lalu`
  if (diffHour < 24) return `${diffHour} jam yang lalu`
  if (diffDay < 7) return `${diffDay} hari yang lalu`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} minggu yang lalu`
  if (diffDay < 365) return `${Math.floor(diffDay / 30)} bulan yang lalu`
  return `${Math.floor(diffDay / 365)} tahun yang lalu`
}

/**
 * Calculates percentage from value and total
 * 
 * @param value - Current value
 * @param total - Total value (denominator)
 * @returns Rounded percentage (0-100)
 * 
 * @example
 * calculatePercentage(25, 100) // 25
 * calculatePercentage(1, 3) // 33
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
