import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      message: 'Application is healthy',
    },
    {
      status: 200,
    }
  );
}
