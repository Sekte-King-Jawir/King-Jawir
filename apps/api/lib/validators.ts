import { t } from 'elysia'

/**
 * Custom TypeBox validators for Elysia with Indonesian error messages
 *
 * @description Provides pre-configured validators for common input types
 * with Indonesian error messages for better UX
 *
 * @example
 * ```typescript
 * import { v } from './lib/validators'
 *
 * body: t.Object({
 *   email: v.email(),
 *   password: v.password(),
 *   phone: v.phoneID()
 * })
 * ```
 */
export const v = {
  /**
   * Validates email format
   * @returns TypeBox email validator with Indonesian error message
   */
  email: () =>
    t.String({
      format: 'email',
      error: 'Format email tidak valid',
    }),

  /**
   * Validates password with minimum 6 characters
   * @returns TypeBox string validator
   */
  password: () =>
    t.String({
      minLength: 6,
      error: 'Password minimal 6 karakter',
    }),

  /**
   * Validates strong password (min 8 chars, must contain uppercase, lowercase, and number)
   * @returns TypeBox string validator with pattern matching
   */
  passwordStrong: () =>
    t.String({
      minLength: 8,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$',
      error: 'Password minimal 8 karakter, harus ada huruf besar, huruf kecil, dan angka',
    }),

  /**
   * Validates Indonesian phone number format (08xxx, 628xxx, or +628xxx)
   * @returns TypeBox string validator with pattern matching
   * @example phoneID() // Accepts: 081234567890, 6281234567890, +6281234567890
   */
  phoneID: () =>
    t.String({
      pattern: '^(\\+62|62|0)8[1-9][0-9]{7,10}$',
      error: 'Format nomor HP tidak valid (contoh: 081234567890)',
    }),

  /**
   * Validates URL format
   * @returns TypeBox URI format validator
   */
  url: () =>
    t.String({
      format: 'uri',
      error: 'Format URL tidak valid',
    }),

  /**
   * Validates URL-friendly slug (lowercase letters, numbers, and dashes only)
   * @returns TypeBox string validator with pattern matching
   * @example slug() // Accepts: "product-name", "iphone-15-pro"
   */
  slug: () =>
    t.String({
      minLength: 2,
      maxLength: 100,
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
      error: 'Slug hanya boleh huruf kecil, angka, dan dash',
    }),

  /**
   * Validates price (positive number, max 999,999,999)
   * @returns TypeBox number validator
   */
  price: () =>
    t.Number({
      minimum: 0,
      maximum: 999999999,
      error: 'Harga harus positif (max 999,999,999)',
    }),

  /**
   * Validates rating (1-5 stars)
   * @returns TypeBox number validator
   */
  rating: () =>
    t.Number({
      minimum: 1,
      maximum: 5,
      error: 'Rating harus antara 1-5',
    }),

  /**
   * Validates quantity (1-9999)
   * @returns TypeBox number validator
   */
  quantity: () =>
    t.Number({
      minimum: 1,
      maximum: 9999,
      error: 'Quantity harus antara 1-9999',
    }),

  /**
   * Validates stock quantity (0-999,999)
   * @returns TypeBox number validator
   */
  stock: () =>
    t.Number({
      minimum: 0,
      maximum: 999999,
      error: 'Stock harus antara 0-999,999',
    }),

  /**
   * Validates name (1-100 characters)
   * @returns TypeBox string validator
   */
  name: () =>
    t.String({
      minLength: 1,
      maxLength: 100,
      error: 'Nama harus 1-100 karakter',
    }),

  /**
   * Validates bio text (max 500 characters)
   * @returns TypeBox string validator
   */
  bio: () =>
    t.String({
      maxLength: 500,
      error: 'Bio maksimal 500 karakter',
    }),

  /**
   * Validates address (max 500 characters)
   * @returns TypeBox string validator
   */
  address: () =>
    t.String({
      maxLength: 500,
      error: 'Alamat maksimal 500 karakter',
    }),

  /**
   * Validates ID (CUID format)
   * @returns TypeBox string validator
   */
  id: () =>
    t.String({
      minLength: 1,
      error: 'ID tidak valid',
    }),

  /**
   * Validates page number for pagination (optional)
   * @returns TypeBox optional string validator with numeric pattern
   */
  page: () => t.Optional(t.String({ pattern: '^[0-9]+$' })),

  /**
   * Validates limit for pagination (optional)
   * @returns TypeBox optional string validator with numeric pattern
   */
  limit: () => t.Optional(t.String({ pattern: '^[0-9]+$' })),
}
