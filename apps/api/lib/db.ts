import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Parse DATABASE_URL to extract connection details
const databaseUrl = process.env.DATABASE_URL || ''

// Skip DB adapter if in test environment (use default connection)
let prisma: PrismaClient

if (process.env.NODE_ENV === 'test') {
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

  const [, user, password, host, port, database] = urlMatch

  const adapter = new PrismaMariaDb({
    host,
    port: Number(port),
    user,
    password,
    database,
  })

  prisma = new PrismaClient({ adapter })
}

export { prisma }
