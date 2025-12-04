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
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    idleTimeout: 10000,
  })

  prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  })
  
  logger.info('✅ Database connection established')

  // Cleanup on exit
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

export { prisma }
