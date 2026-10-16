import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

const createPrismaClient = () => {
  let connectionString = process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/postgres';

  // If using Supabase pooler, route through port 6543 for transaction pooling
  if (connectionString.includes('pooler.supabase.com:5432')) {
    connectionString = connectionString.replace(':5432/', ':6543/');
  }

  const pool = globalForPrisma.pool ?? new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Prevent idle connection drops from becoming unhandled errors
  pool.on('error', (err) => {
    console.warn('[Prisma Pool Idle Notice]:', err?.message || err);
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

