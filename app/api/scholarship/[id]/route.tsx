import { PrismaClient, QuestionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

// GET scholarship by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const scholarship = await db.scholarship.findUnique({
      where: { id },
    });
    if (!scholarship) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(scholarship, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

// PATCH: update dynamicQuestions หรือฟิลด์อื่น
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = (await req.json()) as {
      dynamicQuestions?: {
        question: string;
        type: QuestionType;
        options: string[];
        required: boolean;
      }[];
    };

    const updated = await db.scholarship.update({
      where: { id },
      data: {
        dynamicQuestions: body.dynamicQuestions ?? [],
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
