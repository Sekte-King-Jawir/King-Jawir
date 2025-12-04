import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

let prisma: PrismaClient

if (process.env['NODE_ENV'] === 'test') {
  prisma = { $transaction: async (cb: any) => cb({}) } as any
} else {
  // Parse DATABASE_URL for mariadb adapter
  const dbUrl = process.env['DATABASE_URL'] || ''
  const url = new URL(dbUrl)

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

  // Cleanup on exit
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

export { prisma }
