import { getFieldValue } from '@/app/libs/common';
import { generateCuid } from '@/app/libs/utils';
import { Form, PrismaClient, RequestStatus, Role, SchType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Do something to verify token and get id
    const userid = '';
    const user = await db.user.findUnique({ where: { id: userid } });
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    switch (user.role) {
      case Role.SA_STAFF:
        const saRequests = await db.form.findMany();
        return NextResponse.json(saRequests ?? [], { status: 200 });
      case Role.DEPARTMENT_HEAD:
        const deptHeadRequests = await db.form.findMany({
          where: { approveStatus: 'PENDING_DEPARTMENT_HEAD' },
        });
        return NextResponse.json(deptHeadRequests ?? [], { status: 200 });
      case Role.FACULTY_STAFF:
        const facultyRequests = await db.form.findMany({
          where: { approveStatus: 'PENDING_FACULTY' },
        });
        return NextResponse.json(facultyRequests ?? [], { status: 200 });
      case Role.DEAN:
        const deanRequests = await db.form.findMany({
          where: { approveStatus: 'PENDING_DEAN' },
        });
        return NextResponse.json(deanRequests ?? [], { status: 200 });
      default:
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // Do something to verify token and get id
    const userid = '';
    const user = await db.user.findUnique({ where: { id: userid } });
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();

    // Check if the body is null or not an object
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = [
      'forScholarship',
      'schType',

      'nisitNameTh',
      'nisitNameEn',
      'nisitAcademicyear',
      'nisitid',
      'faculty',
      'department',
      'advisor',
      'gpa',
      'dateofBirth',
      'age',
      'phone',
      'email',
      'address',
    ];

    let dynamicQusetionField: string[] = [];

    switch (body.schType) {
      case SchType.WELL_BEHAVIOR:
        dynamicQusetionField = ['wellBehavior'];
        break;
      case SchType.EXTRACURRICULAR:
        dynamicQusetionField = ['extraCurricular'];
        break;
      case SchType.INNOVATION:
        dynamicQusetionField = ['innovation'];
        break;
    }

    // Validate required fields
    const missingField = requiredFields
      .concat(dynamicQusetionField)
      .find((field) => !getFieldValue(body, field));
    if (missingField) {
      return NextResponse.json({ message: `${missingField} is missing` }, { status: 400 });
    }

    const newFormData: Form = {
      id: generateCuid(),
      createdBy: userid,
      forScholarship: body.forScholarship,
      schType: body.schType,
      approveStatus: RequestStatus.PENDING_DEPARTMENT_HEAD,

      nisitNameTh: body.nisitNameTh,
      nisitNameEn: body.nisitNameEn,
      nisitAcademicyear: body.nisitAcademicyear,
      nisitid: body.nisitid,
      faculty: body.faculty,
      department: body.department,
      advisor: body.advisor,
      gpa: body.gpa,
      dateofBirth: body.dateofBirth,
      age: body.age,
      phone: body.phone,
      email: body.email,
      address: body.address,

      certificate: body.certificate,
      activityImageUrl: body.activityImageUrl,

      staticQuestions: body.staticQuestions,

      wellBehavior: null,
      extracurricular: null,
      innovation: null,
      comment: null,
      commentedBy: null
    };

    switch (body.schType) {
      case SchType.WELL_BEHAVIOR:
        const wbForm = await db.form.create({
          data: { ...newFormData, wellBehavior: body.wellBehavior },
        });
        return NextResponse.json(wbForm, { status: 201 });
      case SchType.EXTRACURRICULAR:
        const ecForm = await db.form.create({
          data: { ...newFormData, extracurricular: body.extraCurricular },
        });
        return NextResponse.json(ecForm, { status: 201 });
      case SchType.INNOVATION:
        const ivForm = await db.form.create({
          data: { ...newFormData, innovation: body.innovation },
        });
        return NextResponse.json(ivForm, { status: 201 });
    }
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
