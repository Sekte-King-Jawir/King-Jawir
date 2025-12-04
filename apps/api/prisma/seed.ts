import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { hashPassword } from '../lib/hash'
import { logger } from '../lib/logger'

// Create a dedicated Prisma client for seeding (no cleanup handlers)
const dbUrl = process.env['DATABASE_URL'] || ''
const url = new URL(dbUrl)

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  connectionLimit: 10,
  connectTimeout: 30000,
  acquireTimeout: 30000,
  idleTimeout: 60000,
  minimumIdle: 2,
  allowPublicKeyRetrieval: true,
})

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
})

async function main() {
  logger.info('🌱 Starting database seed...')

  // Clean existing data
  logger.info('🗑️  Cleaning existing data...')
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.store.deleteMany()
  await prisma.user.deleteMany()
  logger.info('✅ Data cleaned')

  // ============================================================================
  // CREATE USERS
  // ============================================================================
  logger.info('👥 Creating users...')

  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@marketplace.com',
      name: 'Admin System',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
    },
  })
  logger.info(`✅ Admin: ${admin.email}`)

  const sellerPassword = await hashPassword('seller123')
  const seller1 = await prisma.user.create({
    data: {
      email: 'seller@marketplace.com',
      name: 'Toko Elektronik Jakarta',
      password: sellerPassword,
      role: 'SELLER',
      emailVerified: true,
    },
  })

  const seller2 = await prisma.user.create({
    data: {
      email: 'fashion.seller@marketplace.com',
      name: 'Fashion Store Bandung',
      password: sellerPassword,
      role: 'SELLER',
      emailVerified: true,
    },
  })

  const seller3 = await prisma.user.create({
    data: {
      email: 'food.seller@marketplace.com',
      name: 'Toko Makanan Surabaya',
      password: sellerPassword,
      role: 'SELLER',
      emailVerified: true,
    },
  })

  logger.info('✅ 3 Sellers created')

  const customerPassword = await hashPassword('customer123')
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer@marketplace.com',
      name: 'Budi Santoso',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: true,
    },
  })

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@marketplace.com',
      name: 'Siti Rahayu',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: true,
    },
  })

  void (await prisma.user.create({
    data: {
      email: 'customer3@marketplace.com',
      name: 'Ahmad Hidayat',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: true,
    },
  }))

  logger.info('✅ 3 Customers created')

  // ============================================================================
  // CREATE STORES
  // ============================================================================
  logger.info('🏪 Creating stores...')

  const store1 = await prisma.store.create({
    data: {
      userId: seller1.id,
      name: 'Toko Elektronik Jakarta',
      slug: 'toko-elektronik-jakarta',
      description: 'Toko elektronik terpercaya dengan harga terbaik',
    },
  })

  const store2 = await prisma.store.create({
    data: {
      userId: seller2.id,
      name: 'Fashion Store Bandung',
      slug: 'fashion-store-bandung',
      description: 'Fashion trendy untuk semua kalangan',
    },
  })

  const store3 = await prisma.store.create({
    data: {
      userId: seller3.id,
      name: 'Toko Makanan Surabaya',
      slug: 'toko-makanan-surabaya',
      description: 'Makanan dan minuman berkualitas',
    },
  })

  logger.info('✅ 3 Stores created')

  // ============================================================================
  // CREATE CATEGORIES
  // ============================================================================
  logger.info('📁 Creating categories...')

  const elektronik = await prisma.category.create({
    data: { name: 'Elektronik', slug: 'elektronik' },
  })

  const fashion = await prisma.category.create({
    data: { name: 'Fashion', slug: 'fashion' },
  })

  const makanan = await prisma.category.create({
    data: { name: 'Makanan & Minuman', slug: 'makanan-minuman' },
  })

  logger.info('✅ 3 Categories created')

  // ============================================================================
  // CREATE PRODUCTS
  // ============================================================================
  logger.info('📦 Creating products...')

  // Store 1 - Elektronik
  const p1 = await prisma.product.create({
    data: {
      storeId: store1.id,
      categoryId: elektronik.id,
      name: 'Laptop Gaming ASUS ROG',
      slug: 'laptop-gaming-asus-rog',
      description: 'Laptop gaming dengan RTX 3060, RAM 16GB, SSD 512GB',
      price: 15000000,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
    },
  })

  const p2 = await prisma.product.create({
    data: {
      storeId: store1.id,
      categoryId: elektronik.id,
      name: 'Mouse Wireless Logitech',
      slug: 'mouse-wireless-logitech',
      description: 'Mouse wireless ergonomis dengan sensor presisi tinggi',
      price: 250000,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    },
  })

  void (await prisma.product.create({
    data: {
      storeId: store1.id,
      categoryId: elektronik.id,
      name: 'Keyboard Mechanical RGB',
      slug: 'keyboard-mechanical-rgb',
      description: 'Keyboard mechanical dengan RGB backlight dan switch blue',
      price: 750000,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    },
  }))

  void (await prisma.product.create({
    data: {
      storeId: store1.id,
      categoryId: elektronik.id,
      name: 'Monitor LED 27 inch',
      slug: 'monitor-led-27-inch',
      description: 'Monitor 27 inch IPS 144Hz untuk gaming dan multimedia',
      price: 3500000,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    },
  }))

  void (await prisma.product.create({
    data: {
      storeId: store1.id,
      categoryId: elektronik.id,
      name: 'Headphone Bluetooth Sony',
      slug: 'headphone-bluetooth-sony',
      description: 'Headphone dengan noise cancelling dan battery 30 jam',
      price: 1200000,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
  }))

  // Store 2 - Fashion
  const p6 = await prisma.product.create({
    data: {
      storeId: store2.id,
      categoryId: fashion.id,
      name: 'Kaos Polos Premium',
      slug: 'kaos-polos-premium',
      description: 'Kaos cotton combed 30s nyaman dan adem',
      price: 75000,
      stock: 200,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    },
  })

  const p7 = await prisma.product.create({
    data: {
      storeId: store2.id,
      categoryId: fashion.id,
      name: 'Celana Jeans Slim Fit',
      slug: 'celana-jeans-slim-fit',
      description: 'Celana jeans slim fit dengan bahan stretch',
      price: 250000,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    },
  })

  void (await prisma.product.create({
    data: {
      storeId: store2.id,
      categoryId: fashion.id,
      name: 'Jaket Hoodie Fleece',
      slug: 'jaket-hoodie-fleece',
      description: 'Jaket hoodie hangat berbahan fleece tebal',
      price: 180000,
      stock: 80,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    },
  }))

  const p9 = await prisma.product.create({
    data: {
      storeId: store2.id,
      categoryId: fashion.id,
      name: 'Sneakers Casual Putih',
      slug: 'sneakers-casual-putih',
      description: 'Sepatu sneakers casual warna putih nyaman dipakai',
      price: 350000,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    },
  })

  // Store 3 - Makanan
  void (await prisma.product.create({
    data: {
      storeId: store3.id,
      categoryId: makanan.id,
      name: 'Kopi Arabica Gayo 200gr',
      slug: 'kopi-arabica-gayo-200gr',
      description: 'Kopi arabica asli Gayo dengan roasting medium',
      price: 85000,
      stock: 150,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    },
  }))

  void (await prisma.product.create({
    data: {
      storeId: store3.id,
      categoryId: makanan.id,
      name: 'Madu Hutan Asli 500ml',
      slug: 'madu-hutan-asli-500ml',
      description: 'Madu murni dari hutan tanpa campuran',
      price: 150000,
      stock: 100,
      image: 'https://statik.tempo.co/data/2016/06/08/id_513473/513473_650.jpg',
    },
  }))

  void (await prisma.product.create({
    data: {
      storeId: store3.id,
      categoryId: makanan.id,
      name: 'Keripik Singkong 250gr',
      slug: 'keripik-singkong-250gr',
      description: 'Keripik singkong renyah rasa pedas manis',
      price: 25000,
      stock: 300,
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500',
    },
  }))

  logger.info('✅ 12 Products created')

  // ============================================================================
  // CREATE ORDERS
  // ============================================================================
  logger.info('📝 Creating orders...')

  await prisma.order.create({
    data: {
      userId: customer1.id,
      total: 15250000,
      status: 'DONE',
      items: {
        create: [
          { productId: p1.id, quantity: 1, price: 15000000 },
          { productId: p2.id, quantity: 1, price: 250000 },
        ],
      },
    },
  })

  await prisma.order.create({
    data: {
      userId: customer2.id,
      total: 855000,
      status: 'SHIPPED',
      items: {
        create: [
          { productId: p6.id, quantity: 3, price: 75000 },
          { productId: p7.id, quantity: 2, price: 250000 },
          { productId: p9.id, quantity: 1, price: 350000 },
        ],
      },
    },
  })

  logger.info('✅ 2 Orders created')

  // ============================================================================
  // CREATE REVIEWS
  // ============================================================================
  logger.info('⭐ Creating reviews...')

  await prisma.review.create({
    data: {
      userId: customer1.id,
      productId: p1.id,
      rating: 5,
      comment: 'Laptop gaming mantap! Performa tinggi dan pengiriman cepat.',
    },
  })

  await prisma.review.create({
    data: {
      userId: customer2.id,
      productId: p6.id,
      rating: 4,
      comment: 'Kaos nyaman dan bahan bagus. Ukuran sesuai.',
    },
  })

  logger.info('✅ 2 Reviews created')

  // ============================================================================
  // SUMMARY
  // ============================================================================
  logger.info('')
  logger.info('🎉 Seed completed!')
  logger.info('─'.repeat(50))
  logger.info('📊 Summary:')
  logger.info('   • 1 Admin, 3 Sellers, 3 Customers')
  logger.info('   • 3 Stores, 3 Categories')
  logger.info('   • 12 Products, 2 Orders, 2 Reviews')
  logger.info('─'.repeat(50))
  logger.info('🔑 Test Accounts:')
  logger.info('   Admin:    admin@marketplace.com / admin123')
  logger.info('   Seller:   seller@marketplace.com / seller123')
  logger.info('   Customer: customer@marketplace.com / customer123')
  logger.info('─'.repeat(50))
}

main()
  .catch(e => {
    logger.error({ msg: '❌ Seed failed', error: e.message })
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
