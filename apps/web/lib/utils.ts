/**
 * Client-side Utility Functions
 * 
 * @description Pure utility functions for common operations in the web application
 * All functions are side-effect free and can be safely used in any component
 * 
 * @module lib/utils
 */

/**
 * Formats a number as USD currency
 * 
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1500) // "$1,500"
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a number as Indonesian Rupiah currency
 * 
 * @param amount - Amount to format
 * @returns Formatted Rupiah string with thousands separators
 * 
 * @example
 * formatRupiah(1500000) // "Rp1.500.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Alias for formatRupiah (for consistency with API)
 * 
 * @param amount - Amount to format
 * @returns Formatted Rupiah string
 */
export function formatPrice(amount: number): string {
  return formatRupiah(amount)
}

/**
 * Truncates text to a maximum length and adds ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * truncateText("Long product name", 10) // "Long produ..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

/**
 * Generates a URL-friendly slug from text
 * 
 * @param text - Text to convert to slug
 * @returns URL-safe slug string
 * 
 * @example
 * generateSlug("iPhone 15 Pro Max") // "iphone-15-pro-max"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Creates a promise that resolves after specified milliseconds
 * 
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 * 
 * @example
 * await delay(1000) // Wait 1 second
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Creates a debounced version of a function
 * 
 * @template T - Function type
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before executing
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

/**
 * Checks if an object is empty (has no keys)
 * 
 * @param obj - Object to check
 * @returns True if object has no keys
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

/**
 * Creates a deep copy of an object using JSON serialization
 * 
 * @template T - Type of object to clone
 * @param obj - Object to clone
 * @returns Deep cloned object
 * 
 * @warning Does not preserve functions, undefined, or circular references
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Gets a random item from an array
 * 
 * @template T - Array item type
 * @param array - Array to pick from
 * @returns Random item or undefined if array is empty
 */
export function getRandomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * 
 * @template T - Array item type
 * @param array - Array to shuffle
 * @returns New shuffled array (does not mutate original)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = newArray[i]
    newArray[i] = newArray[j]!
    newArray[j] = temp!
  }
  return newArray
}

/**
 * Formats a date to Indonesian locale
 * 
 * @param date - Date to format (string or Date object)
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string in Indonesian
 * 
 * @example
 * formatDate(new Date()) // "6 Desember 2025"
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
 * @param date - Date to format (string or Date object)
 * @returns Relative time string (e.g., "2 hari yang lalu")
 * 
 * @example
 * formatRelativeTime(yesterday) // "1 hari yang lalu"
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
 * Calculates discount percentage from original and discounted prices
 * 
 * @param originalPrice - Original price before discount
 * @param discountedPrice - Price after discount
 * @returns Discount percentage (0-100)
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Formats a number with Indonesian thousand separators
 * 
 * @param num - Number to format
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234567) // "1.234.567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Validates email format using regex
 * 
 * @param email - Email string to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates Indonesian phone number format
 * 
 * @param phone - Phone number string to validate
 * @returns True if phone format is valid (08xxx, 628xxx, +628xxx)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[2-9]\d{7,11}$/
  return phoneRegex.test(phone)
}

/**
 * Extracts initials from a name (max 2 characters)
 * 
 * @param name - Full name string
 * @returns Uppercase initials
 * 
 * @example
 * getInitials("John Doe") // "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Clamps a number between minimum and maximum values
 * 
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 * 
 * @example
 * clamp(150, 0, 100) // 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
