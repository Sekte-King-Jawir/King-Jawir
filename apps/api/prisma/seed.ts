import 'dotenv/config'
import { prisma } from '../lib/db'
import { hashPassword } from '../lib/hash'

async function main() {
  console.log('🌱 Starting seed...')

  // Create Admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marketplace.com' },
    update: {},
    create: {
      email: 'admin@marketplace.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create Seller user with Store
  const sellerPassword = await hashPassword('seller123')
  const seller = await prisma.user.upsert({
    where: { email: 'seller@marketplace.com' },
    update: {},
    create: {
      email: 'seller@marketplace.com',
      name: 'Seller Demo',
      password: sellerPassword,
      role: 'SELLER',
      emailVerified: true,
    },
  })
  console.log('✅ Seller created:', seller.email)

  // Create Store for Seller
  const store = await prisma.store.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      userId: seller.id,
      name: 'Toko Demo',
      slug: 'toko-demo',
    },
  })
  console.log('✅ Store created:', store.name)

  // Create Customer user
  const customerPassword = await hashPassword('customer123')
  const customer = await prisma.user.upsert({
    where: { email: 'customer@marketplace.com' },
    update: {},
    create: {
      email: 'customer@marketplace.com',
      name: 'Customer Demo',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: true,
    },
  })
  console.log('✅ Customer created:', customer.email)

  // Create Categories
  const categories = [
    { name: 'Elektronik', slug: 'elektronik' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Makanan & Minuman', slug: 'makanan-minuman' },
    { name: 'Kesehatan', slug: 'kesehatan' },
    { name: 'Olahraga', slug: 'olahraga' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created:', categories.length)

  // Get all categories
  const elektronik = await prisma.category.findUnique({ where: { slug: 'elektronik' } })
  const fashion = await prisma.category.findUnique({ where: { slug: 'fashion' } })
  const makanan = await prisma.category.findUnique({ where: { slug: 'makanan-minuman' } })
  const kesehatan = await prisma.category.findUnique({ where: { slug: 'kesehatan' } })
  const olahraga = await prisma.category.findUnique({ where: { slug: 'olahraga' } })

  // Create sample products for each category
  const allProducts = []

  // Elektronik products
  if (elektronik) {
    allProducts.push(
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Laptop Gaming ASUS ROG',
        slug: 'laptop-gaming-asus-rog',
        price: 15000000,
        stock: 10,
        image: 'https://via.placeholder.com/300?text=Laptop+Gaming',
      },
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Mouse Wireless Logitech',
        slug: 'mouse-wireless-logitech',
        price: 250000,
        stock: 50,
        image: 'https://via.placeholder.com/300?text=Mouse+Wireless',
      },
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Keyboard Mechanical RGB',
        slug: 'keyboard-mechanical-rgb',
        price: 750000,
        stock: 25,
        image: 'https://via.placeholder.com/300?text=Keyboard',
      },
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Monitor LED 27 inch',
        slug: 'monitor-led-27-inch',
        price: 3500000,
        stock: 15,
        image: 'https://via.placeholder.com/300?text=Monitor+LED',
      },
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Headphone Bluetooth Sony',
        slug: 'headphone-bluetooth-sony',
        price: 1200000,
        stock: 30,
        image: 'https://via.placeholder.com/300?text=Headphone',
      },
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Webcam Full HD 1080p',
        slug: 'webcam-full-hd-1080p',
        price: 450000,
        stock: 40,
        image: 'https://via.placeholder.com/300?text=Webcam',
      }
    )
  }

  // Fashion products
  if (fashion) {
    allProducts.push(
      {
        storeId: store.id,
        categoryId: fashion.id,
        name: 'Kaos Polos Premium Cotton',
        slug: 'kaos-polos-premium-cotton',
        price: 89000,
        stock: 100,
        image: 'https://via.placeholder.com/300?text=Kaos+Polos',
      },
      {
        storeId: store.id,
        categoryId: fashion.id,
        name: 'Celana Jeans Slim Fit',
        slug: 'celana-jeans-slim-fit',
        price: 350000,
        stock: 60,
        image: 'https://via.placeholder.com/300?text=Celana+Jeans',
      },
      {
        storeId: store.id,
        categoryId: fashion.id,
        name: 'Jaket Hoodie Unisex',
        slug: 'jaket-hoodie-unisex',
        price: 275000,
        stock: 45,
        image: 'https://via.placeholder.com/300?text=Hoodie',
      },
      {
        storeId: store.id,
        categoryId: fashion.id,
        name: 'Sepatu Sneakers Casual',
        slug: 'sepatu-sneakers-casual',
        price: 450000,
        stock: 35,
        image: 'https://via.placeholder.com/300?text=Sneakers',
      },
      {
        storeId: store.id,
        categoryId: fashion.id,
        name: 'Topi Baseball Cap',
        slug: 'topi-baseball-cap',
        price: 75000,
        stock: 80,
        image: 'https://via.placeholder.com/300?text=Topi',
      },
      {
        storeId: store.id,
        categoryId: fashion.id,
        name: 'Tas Ransel Laptop',
        slug: 'tas-ransel-laptop',
        price: 320000,
        stock: 25,
        image: 'https://via.placeholder.com/300?text=Tas+Ransel',
      }
    )
  }

  // Makanan & Minuman products
  if (makanan) {
    allProducts.push(
      {
        storeId: store.id,
        categoryId: makanan.id,
        name: 'Kopi Arabica Premium 250g',
        slug: 'kopi-arabica-premium-250g',
        price: 85000,
        stock: 100,
        image: 'https://via.placeholder.com/300?text=Kopi+Arabica',
      },
      {
        storeId: store.id,
        categoryId: makanan.id,
        name: 'Teh Hijau Organik',
        slug: 'teh-hijau-organik',
        price: 45000,
        stock: 150,
        image: 'https://via.placeholder.com/300?text=Teh+Hijau',
      },
      {
        storeId: store.id,
        categoryId: makanan.id,
        name: 'Madu Murni Hutan 500ml',
        slug: 'madu-murni-hutan-500ml',
        price: 125000,
        stock: 40,
        image: 'https://via.placeholder.com/300?text=Madu+Murni',
      },
      {
        storeId: store.id,
        categoryId: makanan.id,
        name: 'Keripik Singkong Pedas',
        slug: 'keripik-singkong-pedas',
        price: 25000,
        stock: 200,
        image: 'https://via.placeholder.com/300?text=Keripik',
      },
      {
        storeId: store.id,
        categoryId: makanan.id,
        name: 'Cokelat Dark 70% Cacao',
        slug: 'cokelat-dark-70-cacao',
        price: 55000,
        stock: 75,
        image: 'https://via.placeholder.com/300?text=Cokelat+Dark',
      },
      {
        storeId: store.id,
        categoryId: makanan.id,
        name: 'Granola Oat Sehat',
        slug: 'granola-oat-sehat',
        price: 68000,
        stock: 60,
        image: 'https://via.placeholder.com/300?text=Granola',
      }
    )
  }

  // Kesehatan products
  if (kesehatan) {
    allProducts.push(
      {
        storeId: store.id,
        categoryId: kesehatan.id,
        name: 'Vitamin C 1000mg 60 Tablet',
        slug: 'vitamin-c-1000mg-60-tablet',
        price: 95000,
        stock: 80,
        image: 'https://via.placeholder.com/300?text=Vitamin+C',
      },
      {
        storeId: store.id,
        categoryId: kesehatan.id,
        name: 'Masker Medis 3 Ply 50pcs',
        slug: 'masker-medis-3-ply-50pcs',
        price: 35000,
        stock: 200,
        image: 'https://via.placeholder.com/300?text=Masker',
      },
      {
        storeId: store.id,
        categoryId: kesehatan.id,
        name: 'Hand Sanitizer 500ml',
        slug: 'hand-sanitizer-500ml',
        price: 45000,
        stock: 150,
        image: 'https://via.placeholder.com/300?text=Sanitizer',
      },
      {
        storeId: store.id,
        categoryId: kesehatan.id,
        name: 'Minyak Kayu Putih 120ml',
        slug: 'minyak-kayu-putih-120ml',
        price: 28000,
        stock: 100,
        image: 'https://via.placeholder.com/300?text=Minyak+Kayu+Putih',
      },
      {
        storeId: store.id,
        categoryId: kesehatan.id,
        name: 'Omega 3 Fish Oil 60 Softgel',
        slug: 'omega-3-fish-oil-60-softgel',
        price: 150000,
        stock: 45,
        image: 'https://via.placeholder.com/300?text=Fish+Oil',
      },
      {
        storeId: store.id,
        categoryId: kesehatan.id,
        name: 'Thermometer Digital',
        slug: 'thermometer-digital',
        price: 75000,
        stock: 60,
        image: 'https://via.placeholder.com/300?text=Thermometer',
      }
    )
  }

  // Olahraga products
  if (olahraga) {
    allProducts.push(
      {
        storeId: store.id,
        categoryId: olahraga.id,
        name: 'Dumbbell Set 20kg',
        slug: 'dumbbell-set-20kg',
        price: 850000,
        stock: 20,
        image: 'https://via.placeholder.com/300?text=Dumbbell',
      },
      {
        storeId: store.id,
        categoryId: olahraga.id,
        name: 'Matras Yoga Premium',
        slug: 'matras-yoga-premium',
        price: 250000,
        stock: 40,
        image: 'https://via.placeholder.com/300?text=Matras+Yoga',
      },
      {
        storeId: store.id,
        categoryId: olahraga.id,
        name: 'Resistance Band Set',
        slug: 'resistance-band-set',
        price: 125000,
        stock: 55,
        image: 'https://via.placeholder.com/300?text=Resistance+Band',
      },
      {
        storeId: store.id,
        categoryId: olahraga.id,
        name: 'Sepeda Statis Indoor',
        slug: 'sepeda-statis-indoor',
        price: 2500000,
        stock: 10,
        image: 'https://via.placeholder.com/300?text=Sepeda+Statis',
      },
      {
        storeId: store.id,
        categoryId: olahraga.id,
        name: 'Skipping Rope Speed',
        slug: 'skipping-rope-speed',
        price: 55000,
        stock: 80,
        image: 'https://via.placeholder.com/300?text=Skipping+Rope',
      },
      {
        storeId: store.id,
        categoryId: olahraga.id,
        name: 'Botol Minum Sport 1L',
        slug: 'botol-minum-sport-1l',
        price: 85000,
        stock: 100,
        image: 'https://via.placeholder.com/300?text=Botol+Sport',
      }
    )
  }

  // Insert all products
  for (const product of allProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('✅ Products created:', allProducts.length)

  console.log('')
  console.log('🎉 Seed completed!')
  console.log('')
  console.log('📋 Test Accounts:')
  console.log('─'.repeat(40))
  console.log('Admin:    admin@marketplace.com / admin123')
  console.log('Seller:   seller@marketplace.com / seller123')
  console.log('Customer: customer@marketplace.com / customer123')
  console.log('─'.repeat(40))
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
