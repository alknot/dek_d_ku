import { getFieldValue } from '@/app/libs/common';
import { generateCuid, handleError } from '@/app/libs/utils';
import { Form, PrismaClient, RequestStatus, Role, SchType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Mock userId (ควรเปลี่ยนเป็น decode token จริง)
    const userid = '';
    const user = await db.user.findUnique({ where: { id: userid } });
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    switch (user.role) {
      case Role.SA_STAFF: {
        const saRequests = await db.form.findMany();
        return NextResponse.json(saRequests ?? [], { status: 200 });
      }
      case Role.DEPARTMENT_HEAD: {
        const deptHeadRequests = await db.form.findMany({
          where: { approveStatus: 'PENDING_DEPARTMENT_HEAD' },
        });
        return NextResponse.json(deptHeadRequests ?? [], { status: 200 });
      }
      case Role.FACULTY_STAFF: {
        const facultyRequests = await db.form.findMany({
          where: { approveStatus: 'PENDING_FACULTY' },
        });
        return NextResponse.json(facultyRequests ?? [], { status: 200 });
      }
      case Role.DEAN: {
        const deanRequests = await db.form.findMany({
          where: { approveStatus: 'PENDING_DEAN' },
        });
        return NextResponse.json(deanRequests ?? [], { status: 200 });
      }
      default:
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // กำหนด required fields ตาม key ใน payload
    const requiredFields = [
      'scholarshipID', // เปลี่ยนจาก 'forScholarship'
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
    console.log("working0");
    // เพิ่มฟิลด์เฉพาะตามประเภททุน
    if (body.schType === SchType.WELL_BEHAVIOR) {
      requiredFields.push('wellBehavior');
    } else if (body.schType === SchType.EXTRACURRICULAR) {
      requiredFields.push('extraCurricular');
    } else if (body.schType === SchType.INNOVATION) {
      requiredFields.push('innovation');
    }

    // ตรวจสอบหากมีฟิลด์ที่หายไปหรือเป็นค่าว่าง
    const missingField = requiredFields.find((field) => {
      const val = getFieldValue(body, field);
      return val === undefined || val === null || val === '';
    });
    if (missingField) {
      return NextResponse.json(
        { message: `Field '${missingField}' is missing or empty` },
        { status: 400 }
      );
      
    }
    console.log("working1");
    // สร้าง newFormData โดยแปลงค่าต่าง ๆ ให้ตรงกับ Prisma schema
    const newFormData: Form = {
      id: generateCuid(),
      scholarshipID: body.scholarshipID, // ใช้ scholarshipID
      schType: body.schType,
      approveStatus: RequestStatus.PENDING_DEPARTMENT_HEAD,

      nisitNameTh: body.nisitNameTh,
      nisitNameEn: body.nisitNameEn,
      nisitAcademicyear: body.nisitAcademicyear,
      nisitid: body.nisitid,
      faculty: body.faculty,
      department: body.department,
      advisor: body.advisor,
      gpa: parseFloat(body.gpa),
      dateofBirth: body.dateofBirth ? new Date(body.dateofBirth) : new Date(),
      age: body.age,
      phone: body.phone,
      email: body.email,
      address: body.address,
      isLastTerm: !!body.isLastTerm,

      certificate: body.certificate ?? null,
      activityImageUrl: body.activityImageUrl ?? null,
      staticQuestions: body.staticQuestions ?? null,
      dynamicQuestions: body.dynamicQuestions ?? [],
      wellBehavior: null,
      extracurricular: null,
      innovation: null,
      comment: null,
      commentedBy: null,
      
    };
    console.log("working2");

    // สร้าง record ตาม schType
    switch (body.schType) {
      case SchType.WELL_BEHAVIOR: {
        const wbForm = await db.form.create({
          data: { ...newFormData, wellBehavior: body.wellBehavior },
        });
        return NextResponse.json(wbForm, { status: 201 });
      }
      case SchType.EXTRACURRICULAR: {
        const ecForm = await db.form.create({
          data: { ...newFormData, extracurricular: body.extraCurricular },
        });
        return NextResponse.json(ecForm, { status: 201 });
      }
      case SchType.INNOVATION: {
        const ivForm = await db.form.create({
          data: { ...newFormData, innovation: body.innovation },
        });
        return NextResponse.json(ivForm, { status: 201 });
      }
      default:
        return NextResponse.json({ message: 'Unknown schType' }, { status: 400 });
    }
    
  } catch (e: any) {
    return handleError(e);
  }
}
