import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

// Verified active production database pooler (AWS AP-Northeast-1 Supabase instance)
const ACTIVE_SUPABASE_DATABASE_URL =
  'postgresql://postgres.myseqnouljktppkvbgsf:femazon_0123@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

function resolveDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || '';

  // Auto-heal: If Vercel env is missing or points to the defunct/deleted tenant "tuhytrskfkwljwlnyada" or dummy
  if (!url || url.includes('tuhytrskfkwljwlnyada') || url.includes('dummy@localhost')) {
    return ACTIVE_SUPABASE_DATABASE_URL;
  }

  // Supabase pooler on transaction mode requires port 6543
  if (url.includes('pooler.supabase.com:5432')) {
    url = url.replace(':5432/', ':6543/');
  }

  return url;
}

const createPrismaClient = () => {
  const connectionString = resolveDatabaseUrl();

  const pool = globalForPrisma.pool ?? new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
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


