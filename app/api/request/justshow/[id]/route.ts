import { handleError } from '@/app/libs/utils';
import { PrismaClient, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  try {
    const token = req.headers.get('Authorization');

    // if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Do something to verify token and get id
    // const userid = '';
    // const user = await db.user.findUnique({ where: { id: userid } });
    // if (!user) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const request = await db.form.findUnique({
      where: {
        id,
      },
    });

    if (!request) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(request, { status: 200 });
  } catch (e) {
    return handleError(e);
  }
}
