import { handleError } from '@/app/libs/utils';
import { PrismaClient, Role } from '@prisma/client';
import { is } from 'date-fns/locale';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();
export async function GET(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  const email = (await params).email;
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (e) {
    return handleError(e);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
    const email = (await params).email;  
    try {
    const data = await req.json();
    console.log('data', data);
    const role = data.role;

    console.log('data: ' + JSON.stringify(data));


    // Update the user role in the database
    const updatedUser = await db.user.update({
      where: { email: String(email) },
      data: {

        isAcceptPolicy: data.isAcceptPolicy,
      },
    });
    return NextResponse.json(
      { status: 200 }
    );
  } catch (e) {
    return handleError(e);
  }
}