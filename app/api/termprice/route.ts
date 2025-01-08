import { getFieldValue } from '@/app/libs/common';
import { generateCuid } from '@/app/libs/utils';
import { PrismaClient, Role, Termprice } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Papa from "papaparse";

const db = new PrismaClient();

export async function GET() {
  try {
    const termPrices = await db.termprice.findMany();
    return NextResponse.json(termPrices, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

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
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = [
      'academicYear',
      'term',
      'department',
      'faculty',
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


    const acceptableCSVFileTypes =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";

    const termPriceData: Termprice = {
      id: generateCuid(),
      academicYear: body.academicYear,
      term: body.term,
      department: body.department,
      faculty: body.faculty,
      price1: body.price1,
      price2: body.price2,
      price3: body.price3,
      programType: body.programType,
      study: body.study,
      sumPrice: body.sumPrice,
      createdAt: body.createdAt,
      updatedAt: body.updatedAt
    };

    const newTermPrice = await db.termprice.create({
      data: termPriceData,
    });

    return NextResponse.json(newTermPrice, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
