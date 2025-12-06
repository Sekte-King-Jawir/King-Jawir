/**
 * Formatting utilities for consistent data presentation
 */

/**
 * Format number to Indonesian Rupiah currency
 * @param num - Number to format
 * @returns Formatted string (e.g., "Rp1.234.567")
 */
export function formatRupiah(num: number): string {
  return `Rp${num.toLocaleString('id-ID')}`
}

/**
 * Format number with thousand separators (Indonesian locale)
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.234.567")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('id-ID')
}

/**
 * Format date to Indonesian locale
 * @param date - Date object or ISO string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
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
 * Format relative time in Indonesian (e.g., "2 hari yang lalu")
 * @param date - Date object or ISO string
 * @returns Relative time string
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
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
