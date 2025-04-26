import { getFieldValue } from '@/app/libs/common';
import { generateCuid, handleError } from '@/app/libs/utils';
import { PrismaClient, Role, Termprice } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(request: Request) {
  try {
    const termPrices = await db.termprice.findMany();
    return NextResponse.json(termPrices, { status: 200 });
  } catch (e) {
    return handleError(e);
  }
}
