/**
 * Database Connection Module
 * 
 * @description Initializes Prisma client with MariaDB adapter and connection pooling.
 * Handles connection lifecycle including cleanup on process exit.
 * 
 * @module lib/db
 * @requires @prisma/adapter-mariadb
 * @requires ./logger
 * 
 * @example
 * import { prisma } from './lib/db'
 * 
 * // Query users
 * const users = await prisma.user.findMany()
 * 
 * @example
 * // Transaction
 * await prisma.$transaction(async (tx) => {
 *   await tx.user.create({ data: { email: 'test@example.com' } })
 *   await tx.profile.create({ data: { userId: 'xxx' } })
 * })
 */

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

  prisma
    .$connect()
    .then(() => logger.info('✅ Database connection verified'))
    .catch(err => logger.error({ msg: '❌ Database connection failed', error: err.message }))

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

/**
 * Prisma client instance with MariaDB adapter
 * 
 * @description Singleton instance configured with:
 * - Connection pooling (10 connections, minimum 2 idle)
 * - Extended timeouts (30s connect, 60s idle)
 * - Automatic cleanup on process exit
 * - Test mode mock for unit tests
 * 
 * @example
 * const users = await prisma.user.findMany()
 */
export { prisma }
