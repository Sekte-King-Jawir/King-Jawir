import { t } from 'elysia'

/**
 * Custom TypeBox validators untuk Elysia
 * Wrapper di atas t (TypeBox) bawaan Elysia
 */
export const v = {
  // Email validator
  email: () => t.String({ 
    format: 'email',
    error: 'Format email tidak valid'
  }),

  // Password validator (min 6 chars)
  password: () => t.String({ 
    minLength: 6,
    error: 'Password minimal 6 karakter'
  }),

  // Password strong (min 8, uppercase, lowercase, number)
  passwordStrong: () => t.String({
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$',
    error: 'Password minimal 8 karakter, harus ada huruf besar, huruf kecil, dan angka'
  }),

  // Phone Indonesia (08xxx atau +628xxx)
  phoneID: () => t.String({
    pattern: '^(\\+62|62|0)8[1-9][0-9]{7,10}$',
    error: 'Format nomor HP tidak valid (contoh: 081234567890)'
  }),

  // URL validator
  url: () => t.String({
    format: 'uri',
    error: 'Format URL tidak valid'
  }),

  // Slug validator (lowercase, numbers, dash)
  slug: () => t.String({
    minLength: 2,
    maxLength: 100,
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    error: 'Slug hanya boleh huruf kecil, angka, dan dash'
  }),

  // Price validator (positive number)
  price: () => t.Number({
    minimum: 0,
    maximum: 999999999,
    error: 'Harga harus positif (max 999,999,999)'
  }),

  // Rating validator (1-5)
  rating: () => t.Number({
    minimum: 1,
    maximum: 5,
    error: 'Rating harus antara 1-5'
  }),

  // Quantity validator (1-9999)
  quantity: () => t.Number({
    minimum: 1,
    maximum: 9999,
    error: 'Quantity harus antara 1-9999'
  }),

  // Stock validator (0-999999)
  stock: () => t.Number({
    minimum: 0,
    maximum: 999999,
    error: 'Stock harus antara 0-999,999'
  }),

  // Name validator (1-100 chars)
  name: () => t.String({
    minLength: 1,
    maxLength: 100,
    error: 'Nama harus 1-100 karakter'
  }),

  // Bio validator (max 500 chars)
  bio: () => t.String({
    maxLength: 500,
    error: 'Bio maksimal 500 karakter'
  }),

  // Address validator (max 500 chars)
  address: () => t.String({
    maxLength: 500,
    error: 'Alamat maksimal 500 karakter'
  }),

  // ID validator (CUID format)
  id: () => t.String({
    minLength: 1,
    error: 'ID tidak valid'
  }),

  // Pagination
  page: () => t.Optional(t.String({ pattern: '^[0-9]+$' })),
  limit: () => t.Optional(t.String({ pattern: '^[0-9]+$' })),
}
