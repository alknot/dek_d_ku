import { PrismaClient, QuestionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return Response.json({
    test: (await params).id,
  });
}
