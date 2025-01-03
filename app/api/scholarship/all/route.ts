import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET() {
  const scholarships = await db.scholarship.findMany();
}
