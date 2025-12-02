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
    connectionLimit: 10,
    connectTimeout: 30000,
    acquireTimeout: 30000,
  })

  prisma = new PrismaClient({ adapter })
}

export { prisma }
