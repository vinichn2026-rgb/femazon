import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // Use a fallback dummy URL during Vercel build step if DATABASE_URL is undefined
  // This prevents PrismaClientInitializationError during static page generation
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:dummy@localhost:5432/postgres';
  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
