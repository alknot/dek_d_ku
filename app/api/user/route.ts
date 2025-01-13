import { getFieldValue } from '@/app/libs/common';
import { handleError } from '@/app/libs/utils';
import { TypePerson } from '@/app/types/user';
import { Prisma, PrismaClient, Role, User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization'); // userid

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  // Do something to verify token and get id
  const userId = '';

  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  if (user?.role !== Role.SA_STAFF)
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const users = await db.user.findMany();

  return NextResponse.json({ users: users ?? [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if the body is null or not an object
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = [
      'id',
      'typePerson',
      'userprincipalname',
      'prenameTh',
      'firstnameTh',
      'lastnameTh',
      'prenameEn',
      'firstnameEn',
      'lastnameEn',
      'faculty',
      'email',
    ];

    // const optionalFields = [
    //   // Student only
    //   'major',
    //   'advisor',
    //   'gpa',

    //   // Staff only
    //   'position',
    //   'positionId',
    //   'department',
    //   'departmentId',

    //   // Contract
    //   'mobilePhone',
    // ];

    // Validate required fields
    const missingField = requiredFields.find((field) => !getFieldValue(body, field));
    if (missingField) {
      return NextResponse.json({ message: `${missingField} is missing` }, { status: 400 });
    }

    const typePerson: TypePerson = body.typePerson;
    if (!Object.values(TypePerson).includes(typePerson)) {
      return NextResponse.json({ message: 'Invalid typePerson value' }, { status: 400 });
    }

    const userData: User = {
      // Required fields
      id: body.id,
      userprincipalname: body.userprincipalname,
      prenameTh: body.prenameTh,
      firstnameTh: body.firstnameTh,
      lastnameTh: body.lastnameTh,
      prenameEn: body.prenameEn,
      firstnameEn: body.firstnameEn,
      lastnameEn: body.lastnameEn,
      role: typePerson === TypePerson.STUDENT ? Role.STUDENT : Role.NOT_ASSIGNED, // Pending admin approval
      faculty: body.faculty,
      email: body.email,

      // Optional fields
      major: body.major,
      advisor: body.advisor, // Maybe not needed
      gpa: body.gpa, // Maybe not needed
      position: body.position, // Maybe not needed
      positionId: body.positionId,
      department: body.department,
      departmentId: body.departmentId, // Maybe not needed
      mobilePhone: body.mobilePhone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Proceed with creating the user
    const user = await db.user.create({
      data: userData,
    });
    if (!user) {
      return NextResponse.json({ message: 'User not created' }, { status: 400 });
    }
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    return handleError(e);
  }
}
