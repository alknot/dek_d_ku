import { generateCuid } from '@/app/libs/utils';
import { PrismaClient, Termprice } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

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

    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = ['term', 'price'];

    // Validate required fields
    const missingField = requiredFields.find((field) => !body[field]);
    if (missingField) {
      return NextResponse.json({ message: `${missingField} is missing` }, { status: 400 });
    }

    if (!body)
      return NextResponse.json(
        { message: 'Term or price details are incomplete' },
        { status: 400 }
      );

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
