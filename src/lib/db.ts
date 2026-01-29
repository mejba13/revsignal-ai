import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  // In development/test, we might not have a database URL
  // Return a mock client that will fail gracefully
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn('DATABASE_URL not set. Database operations will fail.');
    // Return client without adapter for build time
    return new PrismaClient();
  }

  const pool = globalForPrisma.pool ?? new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
  }

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
