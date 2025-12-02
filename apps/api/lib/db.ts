import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Parse DATABASE_URL to extract connection details
const databaseUrl = process.env.DATABASE_URL || ''
const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

if (!urlMatch) {
  throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database')
}

const [, user, password, host, port, database] = urlMatch

const adapter = new PrismaMariaDb({
  host,
  port: Number(port),
  user,
  password,
  database
})

export const prisma = new PrismaClient({ adapter })
