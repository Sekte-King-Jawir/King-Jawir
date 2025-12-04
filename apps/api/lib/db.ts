import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { logger } from './logger'

let prisma: PrismaClient

if (process.env['NODE_ENV'] === 'test') {
  logger.info('🧪 Using test mode - mock database')
  prisma = { $transaction: async (cb: any) => cb({}) } as any
} else {
  logger.info('🔌 Initializing database connection...')
  
  // Parse DATABASE_URL for mariadb adapter
  const dbUrl = process.env['DATABASE_URL'] || ''
  
  if (!dbUrl) {
    logger.error('❌ DATABASE_URL is not defined')
    throw new Error('DATABASE_URL is not defined')
  }
  
  const url = new URL(dbUrl)
  logger.debug({
    msg: '📊 Database config',
    host: url.hostname,
    port: url.port || 3306,
    database: url.pathname.slice(1),
  })

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1), // Remove leading slash
    connectionLimit: 10, // Increased from 5
    connectTimeout: 30000, // Increased to 30s
    acquireTimeout: 30000, // Increased to 30s
    idleTimeout: 60000, // Increased to 60s
    minimumIdle: 2, // Keep minimum 2 idle connections
    allowPublicKeyRetrieval: true,
  })

  prisma = new PrismaClient({
    adapter,
    log: process.env['NODE_ENV'] === 'development' ? ['error', 'warn'] : ['error'],
  })
  
  logger.info('✅ Database connection established')

  // Test connection
  prisma.$connect()
    .then(() => logger.info('✅ Database connection verified'))
    .catch(err => logger.error({ msg: '❌ Database connection failed', error: err.message }))

  // Cleanup on exit
  const cleanup = async () => {
    logger.info('🔌 Disconnecting from database...')
    await prisma.$disconnect()
    logger.info('✅ Database disconnected')
  }

  process.on('beforeExit', cleanup)
  process.on('SIGINT', async () => {
    await cleanup()
    process.exit(0)
  })
  process.on('SIGTERM', async () => {
    await cleanup()
    process.exit(0)
  })
}

export { prisma }
