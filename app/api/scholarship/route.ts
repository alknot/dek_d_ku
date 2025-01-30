import { getFieldValue } from '@/app/libs/common';
import { generateCuid, handleError } from '@/app/libs/utils';
import { PrismaClient, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  // Do something to verify token and get id
  const id = '';
  try {
    const user = await db.user.findUnique({ where: { id } });

    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const scholarships = await db.scholarship.findMany();

    return NextResponse.json({ scholarships: scholarships ?? [] }, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    // const token = req.headers.get('Authorization');
    const token = 'fake-token';
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const userId = '';

    // const user = await db.user.findUnique({ where: { id: userId } });
    const user = {"role" : "SA_STAFF"};

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'SA_STAFF')
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await req.json();

    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = [
      'schName',
      'description',
      'academiYear',
      'term',
      // 'amount',
      'startDate',
      'endDate',
      'schType',
      'attachment',
      // 'price',
    ];

    // Validate required fields
    const missingField = requiredFields.find((field) => !getFieldValue(body, field));
    if (missingField) {
      return NextResponse.json({ message: `${missingField} is missing` }, { status: 400 });
    }

    // Extract nested objects
    const { attachment, price } = body;

    if (!attachment || !attachment.filename || !price || !price.faculty) {
      return NextResponse.json(
        { message: 'Attachment or price details are incomplete' },
        { status: 400 }
      );
    }

    // Perform transaction
    const result = await db.$transaction(async (tx) => {
      // Create the related entities first
      const createdAttachment = await tx.file.create({
        data: {
          id: generateCuid(),
          filename: attachment.filename,
          mimetype: attachment.mimetype,
          data: attachment.data,
        },
      });

      let createdPrice;

      if (price.id) {
        const oldPrice = await tx.termprice.findUnique({ where: { id: price.id } });
        if (!oldPrice) return NextResponse.json({ message: 'Price not found' }, { status: 404 });
        createdPrice = oldPrice;
      } else {
        const newPrice = await tx.termprice.create({
          data: {
            id: generateCuid(),
            faculty: price.faculty,
            // department: price.department,
            academicYear: price.academicYear,
            term: price.term,
            programType: price.programType,
            study: price.study,
            price1: price.price1,
            price2: price.price2,
            price3: price.price3,
            sumPrice: price.sumPrice,
          },
        });
        if (!newPrice) return NextResponse.json({ message: "Can't create" }, { status: 500 });
        createdPrice = newPrice;
      }

      // Create the scholarship
      const newScholarship = await tx.scholarship.create({
        data: {
          id: generateCuid(),
          schName: body.schName,
          description: body.description,
          academiYear: body.academiYear,
          term: body.term,
          amount: body.amount,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          schType: body.schType.toUpperCase(),
          attachment: createdAttachment.id,
          price: createdPrice.id,
        },
      });

      return newScholarship;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    return handleError(e);
  }
}
