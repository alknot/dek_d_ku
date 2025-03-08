import { handleError } from '@/app/libs/utils';
import { PrismaClient, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (e) {
    return handleError(e);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  try {
    const data = await req.json();
    console.log('data', data);
    const role = data.role;
    const faculty = data.faculty;
    const department = data.department;
    console.log('data: ' + JSON.stringify(data));
    if (!role) {
      console.log('Invalid or missing role', role);
      return NextResponse.json({ message: 'Invalid or missing role' }, { status: 400 });
    }
    console.log('set role user id: ' + id);
    console.log('set role user role: ' + role);
    // Update the user role in the database
    const updatedUser = await db.user.update({
      where: { id: String(id) },
      data: {
        role: role as Role,
        faculty: faculty,
        department: department,

        // faculty:
      },
    });
    return NextResponse.json(
      { message: `User ${updatedUser.id} updated with role ${updatedUser.role}` },
      { status: 200 }
    );
  } catch (e) {
    return handleError(e);
  }
}
