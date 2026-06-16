import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

function connectionString(): string {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;
  if (!url) throw new Error("No database URL set (DATABASE_URL or POSTGRES_PRISMA_URL)");
  return url;
}

/** Lazy PrismaClient singleton (pg driver adapter). Instantiated on first use, not at import. */
export function getPrisma(): PrismaClient {
  if (globalForPrisma.__prisma) return globalForPrisma.__prisma;
  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: connectionString() }) });
  globalForPrisma.__prisma = client;
  return client;
}
