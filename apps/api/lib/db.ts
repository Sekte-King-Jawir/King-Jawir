import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Parse DATABASE_URL to extract connection details
const databaseUrl = process.env['DATABASE_URL'] || ''

// Skip DB adapter if in test environment (use default connection)
let prisma: PrismaClient

if (process.env['NODE_ENV'] === 'test') {
  // For testing, create a basic PrismaClient without adapter
  // Tests should mock prisma methods as needed
  prisma = { $transaction: async (cb: any) => cb({}) } as any
} else if (!databaseUrl) {
  prisma = new PrismaClient({} as any)
} else {
  const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

  if (!urlMatch) {
    throw new Error(
      'Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database'
    )
  }

  const [, user, passwordEncoded, host, port, database] = urlMatch
  // Decode URL-encoded password (e.g., %21 -> !)
  const password = decodeURIComponent(passwordEncoded!)

  const adapter = new PrismaMariaDb({
    host: host!,
    port: Number(port),
    user: user!,
    password,
    database: database!,
  })

  prisma = new PrismaClient({ adapter })
}

export { prisma }
