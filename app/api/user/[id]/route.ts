import { handleError } from '@/app/libs/utils';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (e) {
    return handleError(e);
  }
}
