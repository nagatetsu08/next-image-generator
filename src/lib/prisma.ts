import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const adapter = new PrismaTiDBCloud({ url: process.env.DATABASE_URL });


//　以下はログ等にホットリロードのたびにwarningが出た時の対処 

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
// 既存インスタンスがあれば再利用し、なければ新規作成
// export const prisma = globalForPrisma.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const prisma = new PrismaClient({ adapter });

export default prisma;