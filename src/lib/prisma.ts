import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

import { Pool } from 'pg';

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/postgres';
  
  const pool = new Pool({
    connectionString,
    // Enable SSL to satisfy Supabase requirements, ignoring self-signed certs if any
    ssl: { rejectUnauthorized: false },
  });
  
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
