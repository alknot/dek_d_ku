import { getFieldValue } from '@/app/libs/common';
import { generateCuid, handleError } from '@/app/libs/utils';
import { PrismaClient, Role, Termprice } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const token = req.headers.get('Authorization');

    const userId = '';

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== Role.SA_STAFF) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Validate the request body
    if (!body || !Array.isArray(body) || !body.every((item) => typeof item === 'object')) {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = [
      'academicYear',
      'term',
      'department',
      // 'faculty',
      'price1',
      'price2',
      'price3',
      'programType',
      'study',
      'sumPrice',
    ];

    // Validate required fields
    const missingField = requiredFields.find((field) => !getFieldValue(body, field));
    if (missingField) {
      return NextResponse.json({ message: `${missingField} is missing` }, { status: 400 });
    }

    if (!body)
      return NextResponse.json(
        { message: 'Term or price details are incomplete' },
        { status: 400 }
      );

    const termPriceData: Termprice[] = body.map((b) => ({
      id: generateCuid(),
      academicYear: b.academicYear,
      term: b.term,
      department: b.department,
      faculty: b.faculty,
      price1: b.price1,
      price2: b.price2,
      price3: b.price3,
      programType: b.programType,
      study: b.study,
      sumPrice: b.sumPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const newTermPrices = await db.termprice.createMany({
      data: termPriceData,
    });

    return NextResponse.json(newTermPrices, { status: 201 });
  } catch (e: any) {
    return handleError(e);
  }
}
