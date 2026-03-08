import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

// 根据 DATABASE_URL 判断使用哪个 adapter
const databaseUrl = process.env.DATABASE_URL || ''

let prisma: PrismaClient

if (databaseUrl.startsWith('file:') || databaseUrl.endsWith('.db')) {
  // SQLite 使用 libsql adapter
  const adapter = new PrismaLibSql({ url: databaseUrl })
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
} else {
  // PostgreSQL 使用 pg adapter
  const adapter = new PrismaPg({ connectionString: databaseUrl })
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma