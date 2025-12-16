import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaInstances: Map<string, PrismaClient>
}

// Initialize the instances map
if (!globalForPrisma.prismaInstances) {
  globalForPrisma.prismaInstances = new Map()
}

// Get or create Prisma client for specific database URL
export function getPrismaClient(databaseUrl?: string): PrismaClient {
  const dbUrl = databaseUrl || process.env.DATABASE_URL || ''
  
  // Return existing instance if available
  if (globalForPrisma.prismaInstances.has(dbUrl)) {
    return globalForPrisma.prismaInstances.get(dbUrl)!
  }
  
  // Create new instance
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasources: {
      db: {
        url: dbUrl
      }
    }
  })
  
  // Store instance for reuse
  globalForPrisma.prismaInstances.set(dbUrl, client)
  
  return client
}

// Default prisma client (for backward compatibility)
export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

