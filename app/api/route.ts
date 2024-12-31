import { setCorsHeaders } from '@libs/api/middleware';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET() {
  return setCorsHeaders(NextResponse.json({ message: 'Hello, World!' }, { status: 200 }));
}
