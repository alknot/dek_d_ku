import { generateCuid } from '@/app/libs/utils';
import { Form, PrismaClient, RequestStatus, Role, SchType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // ตัวอย่างตรวจสอบ token (สำหรับระบบ Auth จริงควรตรวจสอบและ decode token)
    const token = req.headers.get('Authorization');
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // mock userId สำหรับทดสอบ (เปลี่ยนเมื่อมีระบบ Auth จริง)
    const userId = 'mockUserIdForTest';

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // เลือก query ตาม role ของ user
    switch (user.role) {
      case Role.SA_STAFF: {
        const saRequests = await db.form.findMany();
        return NextResponse.json(saRequests ?? [], { status: 200 });
      }
      case Role.DEPARTMENT_HEAD: {
        const deptHeadRequests = await db.form.findMany({
          where: { approveStatus: RequestStatus.PENDING_DEPARTMENT_HEAD },
        });
        return NextResponse.json(deptHeadRequests ?? [], { status: 200 });
      }
      case Role.FACULTY_STAFF: {
        const facultyRequests = await db.form.findMany({
          where: { approveStatus: RequestStatus.PENDING_SUBDEAN },
        });
        return NextResponse.json(facultyRequests ?? [], { status: 200 });
      }
      case Role.DEAN: {
        const deanRequests = await db.form.findMany({
          where: { approveStatus: RequestStatus.PENDING_DEAN },
        });
        return NextResponse.json(deanRequests ?? [], { status: 200 });
      }
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
    // ตัวอย่างตรวจสอบ token (สำหรับระบบ Auth จริงควรตรวจสอบและ decode token)
    // const token = req.headers.get('Authorization');
    // if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // mock userId สำหรับทดสอบ
    // const userId = 'mockUserIdForTest';

    const body = await req.json();
    console.log(body);
    // ตรวจสอบ field ที่จำเป็น (สามารถปรับปรุงเพิ่มเติมได้ตามต้องการ)
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
      'isLastTerm',
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ message: `${field} is missing` }, { status: 400 });
      }
    }

    // สร้างข้อมูลฟอร์มใหม่ โดยใช้ข้อมูล static จาก body
    const newFormData: Form = {
      id: generateCuid(),
      scholarshipID: body.forScholarship,
      schType: body.schType,
      approveStatus: RequestStatus.PENDING_DEAN,
      checkReject: c
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
      isLastTerm: body.isLastTerm,

      academicYear: body.academicYear,
      term: body.term,

      programType: body.programType,
      study: body.study,

      certificate: body.certificate,
      activityImageUrl: body.activityImageUrl,
      staticQuestions: body.staticQuestions,
      // ฟิลด์ staticQuestions (หรือ staticData ถ้ามีการปรับ schema ใหม่)
      dynamicQuestions: body.dynamicQuestions ?? [],
      // ตั้งค่า default สำหรับ dynamic question fields
      wellBehavior: null,
      extracurricular: null,
      innovation: null,
      comment: null,
      commentedBy: null,
    };

    // สร้าง Form ตามประเภททุน (schType)
    switch (body.schType) {
      case SchType.WELL_BEHAVIOR: {
        const wbForm = await db.form.create({
          data: { ...newFormData, wellBehavior: body.wellBehavior || null },
        });
        return NextResponse.json(wbForm, { status: 201 });
      }
      case SchType.EXTRACURRICULAR: {
        // เปลี่ยนจาก extraCurricular เป็น extracurricular ให้ตรงกับ Prisma schema
        const ecForm = await db.form.create({
          data: { ...newFormData, extracurricular: body.extracurricular || null },
        });
        return NextResponse.json(ecForm, { status: 201 });
      }
      case SchType.INNOVATION: {
        const ivForm = await db.form.create({
          data: { ...newFormData, innovation: body.innovation || null },
        });
        return NextResponse.json(ivForm, { status: 201 });
      }
      case SchType.OTHER: {
        // สำหรับทุน OTHER เราสร้าง Form โดยไม่มีข้อมูล dynamic เฉพาะเพิ่มเติม
        const otherForm = await db.form.create({
          data: { ...newFormData },
        });
        return NextResponse.json(otherForm, { status: 201 });
      }
      default: {
        return NextResponse.json({ message: 'Unknown scholarship type' }, { status: 400 });
      }
    }
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
