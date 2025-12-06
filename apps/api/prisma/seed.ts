import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
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

  logger.info('🗑️ Cleaning existing data...')
  await prisma.user.deleteMany()
  logger.info('✅ Data cleaned')

  // ============================================================================
  // CREATE SAMPLE USERS (optional for analytics/tracking)
  // ============================================================================
  logger.info('👥 Creating sample users...')

  void (await prisma.user.create({
    data: {
      email: 'user1@kingjawir.com',
      name: 'Budi Santoso',
    },
  }))

  void (await prisma.user.create({
    data: {
      email: 'user2@kingjawir.com',
      name: 'Siti Rahayu',
    },
  }))

  void (await prisma.user.create({
    data: {
      email: 'user3@kingjawir.com',
      name: 'Ahmad Hidayat',
    },
  }))

  logger.info('✅ 3 Sample users created')

  // ============================================================================
  // SUMMARY
  // ============================================================================
  logger.info('')
  logger.info('🎉 Seed completed successfully!')
  logger.info('─'.repeat(50))
  logger.info('📊 Summary:')
  logger.info('   • 3 Sample users (no authentication required)')
  logger.info('─'.repeat(50))
  logger.info('🌐 Platform is now fully public!')
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
