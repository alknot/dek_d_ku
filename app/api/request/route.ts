import { getFieldValue } from '@/app/libs/common';
import { generateCuid, handleError } from '@/app/libs/utils';
import { Form, PrismaClient, RequestStatus, Role, SchType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;
//     const form = await db.form.findUnique({ where: { id } });
//     if (!form) {
//       return NextResponse.json({ message: "Form not found" }, { status: 404 });
//     }
//     return NextResponse.json(form, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Internal error" }, { status: 500 });
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');
    // if (!token) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // Mock userId (ควรเปลี่ยนเป็น decode token จริง)
    // const userid = '';
    // const user = await db.user.findUnique({ where: { id: userid } });

    const { searchParams } = new URL(req.url);
    const scholarshipID = searchParams.get("scholarshipID");
    const academicYear = searchParams.get("academicYear");
    
    const term = searchParams.get("term") === 'เทอมต้น' ? '1' 
                      : searchParams.get("term") === 'เทอมปลาย' ? '2' 
                      : searchParams.get("term");
    

    // ค้นหาข้อมูลโดยใช้เงื่อนไขที่สร้างขึ้น
    const forms = await db.form.findMany({
      where: {
        ...(scholarshipID && { scholarshipID }),
        ...(academicYear && { academicYear }),
        ...(term && { term }),
      },
    });

    return NextResponse.json(forms ?? [], { status: 200 });

    // if (!user) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    // const saRequests = await db.form.findMany();
    //   return NextResponse.json(saRequests ?? [], { status: 200 });
    // switch (user.role) {
    //   case Role.SA_STAFF: {
    //     const saRequests = await db.form.findMany();
    //     return NextResponse.json(saRequests ?? [], { status: 200 });
    //   }
    //   case Role.DEPARTMENT_HEAD: {
    //     const deptHeadRequests = await db.form.findMany({
    //       where: { approveStatus: 'PENDING_DEPARTMENT_HEAD' },
    //     });
    //     return NextResponse.json(deptHeadRequests ?? [], { status: 200 });
    //   }
    //   case Role.FACULTY_STAFF: {
    //     const facultyRequests = await db.form.findMany({
    //       where: { approveStatus: 'PENDING_FACULTY' },
    //     });
    //     return NextResponse.json(facultyRequests ?? [], { status: 200 });
    //   }
    //   case Role.DEAN: {
    //     const deanRequests = await db.form.findMany({
    //       where: { approveStatus: 'PENDING_DEAN' },
    //     });
    //     return NextResponse.json(deanRequests ?? [], { status: 200 });
    //   }
    //   default:
    //     return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }
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
    console.log('working0');
    console.log('body.schType', body.schType);
    // เพิ่มฟิลด์เฉพาะตามประเภททุน
    if (body.schType === SchType.WELL_BEHAVIOR) {
      requiredFields.push('wellBehavior');
    } else if (body.schType === SchType.EXTRACURRICULAR) {
      requiredFields.push('extraCurricular');
    } else if (body.schType === SchType.INNOVATION) {
      requiredFields.push('innovation');
    }
    console.log('working1.0');
    // ตรวจสอบหากมีฟิลด์ที่หายไปหรือเป็นค่าว่าง
    // const missingField = requiredFields.find((field) => {
    //   const val = getFieldValue(body, field);
    //   return val === undefined || val === null || val === '';
    // });
    console.log('working1.11');
    // if (missingField) {
    //   return NextResponse.json(
    //     { message: `Field '${missingField}' is missing or empty` },
    //     { status: 400 }
    //   );
    // }
    console.log('working1.2');

    const scholarship = await db.scholarship.findUnique({
      where: { id: body.scholarshipID },
    });
    console.log('working1.3');

    if (!scholarship) {
      return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
    }
    // สร้าง newFormData โดยแปลงค่าต่าง ๆ ให้ตรงกับ Prisma schema
    const newFormData: Form = {
      id: generateCuid(),
      scholarshipID: body.scholarshipID, // ใช้ scholarshipID
      schType: body.schType,
      approveStatus: RequestStatus.PENDING_SUBDEAN,

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

      programType: body.programType,
      study: body.study,

      certificate: body.certificate ?? undefined,
      activityImageUrl: body.activityImageUrl ?? undefined,
      staticQuestions: body.staticQuestions ?? undefined,
      dynamicQuestions: body.dynamicQuestions ?? [],
      wellBehavior: null,
      extracurricular: null,
      innovation: null,
      comment: null,
      commentedBy: null,

      academicYear: body.academicYear,
      term: body.term,
    };
    console.log('working2');

    // สร้าง record ตาม schType
    switch (body.schType) {
      case SchType.WELL_BEHAVIOR: {
        const wbForm = await db.form.create({
          data: { ...newFormData, wellBehavior: body.wellBehavior, schType: body.schType },
        });
        return NextResponse.json(wbForm, { status: 201 });
      }
      case SchType.EXTRACURRICULAR: {
        const ecForm = await db.form.create({
          data: { ...newFormData, extracurricular: body.extraCurricular, schType: body.schType },
        });
        return NextResponse.json(ecForm, { status: 201 });
      }
      case SchType.INNOVATION: {
        const ivForm = await db.form.create({
          data: { ...newFormData, innovation: body.innovation, schType: body.schType },
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
