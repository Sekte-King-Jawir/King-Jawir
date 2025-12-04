import type { Category, Product, FlashDeal, Brand, Collection, Testimonial } from '@/types'

// ============================================================================
// CATEGORIES DATA
// ============================================================================

export const categories: Category[] = [
  { id: '1', name: 'Phones', slug: 'phones', productCount: 24 },
  { id: '2', name: 'Smart Watches', slug: 'smart-watches', productCount: 18 },
  { id: '3', name: 'Cameras', slug: 'cameras', productCount: 12 },
  { id: '4', name: 'Headphones', slug: 'headphones', productCount: 32 },
  { id: '5', name: 'Computers', slug: 'computers', productCount: 45 },
  { id: '6', name: 'Gaming', slug: 'gaming', productCount: 28 },
]

// ============================================================================
// PRODUCTS DATA
// ============================================================================

export const products: Product[] = [
  {
    id: '1',
    name: 'Apple iPhone 14 Pro Max 128GB Deep Purple',
    slug: 'iphone-14-pro-max',
    price: 1099,
    stock: 10,
    image: null,
    category: { id: '1', name: 'Phones', slug: 'phones' },
    store: { id: '1', name: 'Apple Store' },
  },
  {
    id: '2',
    name: 'Apple Watch Series 8 GPS 41mm Starlight',
    slug: 'apple-watch-series-8',
    price: 399,
    stock: 15,
    image: null,
    category: { id: '2', name: 'Smart Watches', slug: 'smart-watches' },
    store: { id: '1', name: 'Apple Store' },
  },
  {
    id: '3',
    name: 'Samsung Galaxy S23 Ultra 256GB Phantom Black',
    slug: 'samsung-galaxy-s23-ultra',
    price: 1199,
    stock: 8,
    image: null,
    category: { id: '1', name: 'Phones', slug: 'phones' },
    store: { id: '2', name: 'Samsung Store' },
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    slug: 'sony-wh-1000xm5',
    price: 349,
    stock: 20,
    image: null,
    category: { id: '4', name: 'Headphones', slug: 'headphones' },
    store: { id: '3', name: 'Sony Store' },
  },
  {
    id: '5',
    name: 'MacBook Pro 14" M3 Pro 512GB Space Black',
    slug: 'macbook-pro-14-m3',
    price: 1999,
    stock: 5,
    image: null,
    category: { id: '5', name: 'Computers', slug: 'computers' },
    store: { id: '1', name: 'Apple Store' },
  },
  {
    id: '6',
    name: 'PlayStation 5 Console Digital Edition',
    slug: 'playstation-5-digital',
    price: 449,
    stock: 12,
    image: null,
    category: { id: '6', name: 'Gaming', slug: 'gaming' },
    store: { id: '4', name: 'Sony Store' },
  },
  {
    id: '7',
    name: 'Canon EOS R6 Mark II Mirrorless Camera',
    slug: 'canon-eos-r6-mark-ii',
    price: 2499,
    stock: 6,
    image: null,
    category: { id: '3', name: 'Cameras', slug: 'cameras' },
    store: { id: '5', name: 'Canon Store' },
  },
  {
    id: '8',
    name: 'AirPods Pro 2nd Gen with MagSafe Case',
    slug: 'airpods-pro-2',
    price: 249,
    stock: 30,
    image: null,
    category: { id: '4', name: 'Headphones', slug: 'headphones' },
    store: { id: '1', name: 'Apple Store' },
  },
]

// ============================================================================
// FLASH DEALS DATA
// ============================================================================

export const flashDeals: FlashDeal[] = [
  { id: 1, name: 'iPad Pro M2', emoji: '📱', price: 999, originalPrice: 1199, discount: 17, sold: 234 },
  { id: 2, name: 'AirPods Max', emoji: '🎧', price: 429, originalPrice: 549, discount: 22, sold: 567 },
  { id: 3, name: 'GoPro Hero 11', emoji: '📷', price: 349, originalPrice: 499, discount: 30, sold: 189 },
  { id: 4, name: 'Nintendo Switch', emoji: '🎮', price: 279, originalPrice: 349, discount: 20, sold: 892 },
]

// ============================================================================
// BRANDS DATA
// ============================================================================

export const brands: Brand[] = [
  { name: 'Apple', emoji: '🍎' },
  { name: 'Samsung', emoji: '📱' },
  { name: 'Sony', emoji: '🎮' },
  { name: 'Microsoft', emoji: '💻' },
  { name: 'Google', emoji: '🔍' },
  { name: 'Nintendo', emoji: '🕹️' },
]

// ============================================================================
// COLLECTIONS DATA
// ============================================================================

export const collections: Collection[] = [
  { id: 1, name: 'Trending', emoji: '🔥', count: 156, gradient: 'from-orange-500 to-red-500', description: 'Produk paling dicari' },
  { id: 2, name: 'New Arrival', emoji: '✨', count: 48, gradient: 'from-blue-500 to-cyan-400', description: 'Baru datang' },
  { id: 3, name: 'Best Seller', emoji: '⭐', count: 89, gradient: 'from-amber-500 to-yellow-400', description: 'Paling laris' },
  { id: 4, name: 'Sale', emoji: '🏷️', count: 234, gradient: 'from-green-500 to-emerald-400', description: 'Diskon spesial' },
]

// ============================================================================
// TESTIMONIALS DATA
// ============================================================================

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    avatar: '👨',
    role: 'Pelanggan Setia',
    content: 'Pelayanan sangat memuaskan! Produk original dan pengiriman cepat. Pasti akan belanja lagi di sini.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Siti Rahma',
    avatar: '👩',
    role: 'Tech Enthusiast',
    content: 'Harga kompetitif dengan kualitas produk yang terjamin. Customer service juga sangat responsif.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ahmad Fadli',
    avatar: '🧑',
    role: 'Gamer',
    content: 'Koleksi gaming gear-nya lengkap banget! Banyak promo menarik juga. Recommended!',
    rating: 5,
  },
]
