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

  // Get elektronik category for sample products
  const elektronik = await prisma.category.findUnique({
    where: { slug: 'elektronik' },
  })

  // Create sample products for the store
  if (elektronik) {
    const products = [
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Laptop Gaming',
        slug: 'laptop-gaming',
        price: 15000000,
        stock: 10,
        image: 'https://via.placeholder.com/300',
      },
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Mouse Wireless',
        slug: 'mouse-wireless',
        price: 250000,
        stock: 50,
        image: 'https://via.placeholder.com/300',
      },
      {
        storeId: store.id,
        categoryId: elektronik.id,
        name: 'Keyboard Mechanical',
        slug: 'keyboard-mechanical',
        price: 750000,
        stock: 25,
        image: 'https://via.placeholder.com/300',
      },
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      })
    }
    console.log('✅ Products created:', products.length)
  }

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
