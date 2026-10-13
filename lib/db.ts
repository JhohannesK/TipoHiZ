import { PrismaClient } from '../prisma/generated/prisma/edge';

// Legacy NextAuth schema. Runtime auth uses Better Auth's MongoDB adapter.
export const prisma = new PrismaClient();
