import { getFieldValue } from '@/app/libs/common';
import { generateCuid, handleError } from '@/app/libs/utils';
import { Form, PrismaClient, RequestStatus, Role, SchType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { decodeToken } from 'react-jwt';

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
    // console.log('req', req);
    const token = req.headers.get('Authorization');

    const { searchParams } = new URL(req.url);
    const scholarshipID = searchParams.get('scholarshipID');
    const academicYear = searchParams.get('academicYear');
    const studentId = searchParams.get('studentId');
    // console.log('studentId', studentId);
    const nisitNameTH = searchParams.get('nisitNameTH');
    const faculty = searchParams.get('faculty');
    // console.log('nisitNameTH', nisitNameTH);
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = decodeToken(token) as any;
    // console.log('user', user);
    const term =
      searchParams.get('term') === 'เทอมต้น'
        ? '1'
        : searchParams.get('term') === 'เทอมปลาย'
          ? '2'
          : searchParams.get('term');

    // ค้นหาข้อมูลโดยใช้เงื่อนไขที่สร้างขึ้น
    const forms = await db.form.findMany({
      where: {
        ...(scholarshipID && { scholarshipID }),
        ...(academicYear && { academicYear }),
        ...(term && { term }),
      },
    });
    console.log('scholarshipID', scholarshipID);
    console.log('forms', forms);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // const saRequests = await db.form.findMany();
    // return NextResponse.json(saRequests ?? [], { status: 200 });
    const accessUser = await db.user.findUnique({
      where: {
        email: user['google-mail'],
      },
    });
    if (!accessUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    switch (accessUser.role) {
      // case Role.SA_STAFF: {
      //   const saRequests = await db.form.findMany();
      //   return NextResponse.json(saRequests ?? [], { status: 200 });
      // }
      case Role.DEPUTY_DEAN || Role.FACULTY_STAFF: {
        // console.log('studentIdinside', studentId);
        const deptRequests = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_DEPUTY_DEAN',
            faculty: accessUser.faculty ?? undefined,
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });

        const notPass = await db.form.findMany({
          where: {
            approveStatus: 'REJECTED',
            checkReject: 'REJECTED_DEPUTY_DEAN',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });

        const pass = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_DEAN',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });

        const allFaculty = await db.form.findMany({
          where: {
            faculty: accessUser.faculty ?? undefined,
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });
        return NextResponse.json(
          {
            getByFaculty: allFaculty ?? [],
            getByStatus: deptRequests ?? [],
            getPass: pass ?? [],
            getRejected: notPass ?? [],
          },
          { status: 200 }
        );
      }

      case Role.DEAN: {
        const deanRequests = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_DEAN',
            faculty: accessUser.faculty ?? undefined,
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });

        const notPass = await db.form.findMany({
          where: {
            approveStatus: 'REJECTED',
            checkReject: 'REJECTED_DEAN',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            faculty: accessUser.faculty ?? undefined,
          },
        });

        const pass = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_SA',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            faculty: accessUser.faculty ?? undefined,
          },
        });

        const allFaculty = await db.form.findMany({
          where: {
            faculty: accessUser.faculty ?? undefined,
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });
        return NextResponse.json(
          {
            getByFaculty: allFaculty ?? [],
            getByStatus: deanRequests ?? [],
            getPass: pass ?? [],
            getRejected: notPass ?? [],
          },
          { status: 200 }
        );
      }

      case Role.SA_STAFF: {
        const saRequests = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_SA',
            scholarshipID: scholarshipID ?? undefined,

            // faculty: accessUser.faculty ?? undefined,
            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });

        const notPass = await db.form.findMany({
          where: {
            approveStatus: 'REJECTED',
            scholarshipID: scholarshipID ?? undefined,

            // faculty: accessUser.faculty ?? undefined,
            checkReject: 'REJECTED_SA',
            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });

        const pass = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_BOARD',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });

        const allFaculty = await db.form.findMany({
          where: {
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });
        return NextResponse.json(
          {
            getByFaculty: allFaculty ?? [],
            getByStatus: saRequests ?? [],
            getPass: pass ?? [],
            getRejected: notPass ?? [],
          },
          { status: 200 }
        );
      }

      case Role.COMMITTEE: {
        const committeeRequest = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_BOARD',
            scholarshipID: scholarshipID ?? undefined,

            // faculty: accessUser.faculty ?? undefined,
            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });

        const notPass = await db.form.findMany({
          where: {
            approveStatus: 'REJECTED',
            checkReject: 'REJECTED_BOARD',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });

        const pass = await db.form.findMany({
          where: {
            approveStatus: 'PENDING_CHAIRMAN',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });

        const allFaculty = await db.form.findMany({
          where: {
            scholarshipID: scholarshipID ?? undefined,

            // faculty: accessUser.faculty ?? undefined,
            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });
        return NextResponse.json(
          {
            getByFaculty: allFaculty ?? [],
            getByStatus: committeeRequest ?? [],
            getPass: pass ?? [],
            getRejected: notPass ?? [],
          },
          { status: 200 }
        );
      }

      case Role.CHAIRMAN: {
        const chaimanRequest = await db.form.findMany({
          where: {
            OR: [{ approveStatus: 'PENDING_CHAIRMAN' }, { checkReject: 'REJECTED_BOARD' }],
            scholarshipID: scholarshipID ?? undefined,

            // faculty: accessUser.faculty ?? undefined,
            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });

        const notPass = await db.form.findMany({
          where: {
            approveStatus: 'REJECTED',
            checkReject: 'REJECTED',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });

        const pass = await db.form.findMany({
          where: {
            approveStatus: 'APPROVED',
            scholarshipID: scholarshipID ?? undefined,

            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
            // faculty: accessUser.faculty ?? undefined,
          },
        });

        const allFaculty = await db.form.findMany({
          where: {
            scholarshipID: scholarshipID ?? undefined,

            // faculty: accessUser.faculty ?? undefined,
            // nisitid: studentId ?? undefined,
            // nisitNameTh: nisitNameTH ?? undefined,
          },
        });
        return NextResponse.json(
          {
            getByFaculty: allFaculty ?? [],
            getByStatus: chaimanRequest ?? [],
            getPass: pass ?? [],
            getRejected: notPass ?? [],
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(forms ?? [], { status: 200 });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("body",body)
    console.log({ body });

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
    // console.log('working0');
    // console.log('body.schType', body.schType);
    // เพิ่มฟิลด์เฉพาะตามประเภททุน
    if (body.schType === SchType.WELL_BEHAVIOR) {
      requiredFields.push('wellBehavior');
    } else if (body.schType === SchType.EXTRACURRICULAR) {
      requiredFields.push('extraCurricular');
    } else if (body.schType === SchType.INNOVATION) {
      requiredFields.push('innovation');
    }
    // console.log('working1.0');
    // ตรวจสอบหากมีฟิลด์ที่หายไปหรือเป็นค่าว่าง
    // const missingField = requiredFields.find((field) => {
    //   const val = getFieldValue(body, field);
    //   return val === undefined || val === null || val === '';
    // });
    // console.log('working1.11');
    // if (missingField) {
    //   return NextResponse.json(
    //     { message: `Field '${missingField}' is missing or empty` },
    //     { status: 400 }
    //   );
    // }
    // console.log('working1.2');

    const scholarship = await db.scholarship.findUnique({
      where: { id: body.scholarshipID },
    });
    console.log('working1.3');

    if (!scholarship) {
      return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
    }
    const newFormData: Form = {
      id: generateCuid(),
      scholarshipID: body.scholarshipID, // ใช้ scholarshipID
      schType: body.schType,
      approveStatus: RequestStatus.PENDING_DEPUTY_DEAN,
      createdBy: body.createdBy,

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

      universityPrice: body.universityPrice ?? undefined,
      facultyPrice: body.facultyPrice ?? undefined,
      creditPrice: body.creditPrice ?? undefined,
      sumPrice: body.sumPrice ?? undefined,

      newUniversityPrice: body.newuniversityPrice ?? undefined,
      newFacultyPrice: body.newfacultyPrice ?? undefined,
      newCreditPrice: body.newcreditPrice ?? undefined,
      newSumPrice: body.newsumPrice ?? undefined,

      certificate: body.certificate ?? undefined,
      activityImageUrl: body.activityImageUrl ?? undefined,
      staticQuestions: body.staticQuestions ?? undefined,
      dynamicQuestions: body.dynamicQuestions ?? [],
      wellBehavior:
        body.schType === SchType.WELL_BEHAVIOR
          ? {
              beahavior_detail: body.wellBehavior.beahavior_detail || null,
            }
          : null,
      innovation:
        body.schType === SchType.INNOVATION
          ? {
              // innovationType: body.innovationType ?? 'UNIVERSITY_COMPETITION',
              competitionName: body.innovation.competitionName ?? '-',
              teamName: body.innovation.teamName ?? '-',
              innovationName: body.innovation.innovationName ?? '-',
              prizeName: body.innovation.prizeName ?? '-',
              organizer: body.innovation.organizer ?? '-',
              activityHour: body.innovation.activityHour ?? 'OTHER',
              attachfile: body.innovation.attachFile ?? '-',
              competitiveLevel: body.innovation.competitiveLevel ?? 'NATIONAL',
              numberOfTeam: Number(body.innovation.numberOfTeam) ?? 0,
              awardDate: body.innovation.awardDate,
            }
          : null,

      extracurricular:
        body.schType === SchType.EXTRACURRICULAR
          ? {
              extracurricularType:
                body.extracurricular.extracurricularType ?? 'UNIVERSITY_COMPETITION',
              competitionName: body.extracurricular.competitionName ?? 'a',
              teamName: body.extracurricular.teamName ?? 'a',
              innovationName: body.extracurricular.innovationName ?? 'a',
              prizeName: body.extracurricular.prizeName ?? 'a',
              organizer: body.extracurricular.organizer ?? 'a',
              activityHour: body.extracurricular.activityHour ?? null,
              attachfile: body.extracurricular.attachFile ?? '',
              competitiveLevel: body.extracurricular.competitiveLevel ?? 'INTERNATIONAL',
              numberOfTeam: Number(body.extracurricular.numberOfTeam) ?? 0,
              awardDate: body.extracurricular.awardDate,
            }
          : null,
      comment: null,
      commentedBy: null,
      checkReject: 'NOT_REJECTED',
      academicYear: body.academicYear,
      term: body.term,
    };
    console.log('working2');

    console.log(newFormData);
    console.log(newFormData?.innovation?.awardDate);

    // สร้าง record ตาม schType
    switch (body.schType) {
      case SchType.WELL_BEHAVIOR: {
        const wbForm = await db.form.create({
          data: {
            ...newFormData,
            // wellBehavior: body.wellBehavior,
            // schType: body.schType,
          },
        });
        return NextResponse.json(wbForm, { status: 201 });
      }
      case SchType.EXTRACURRICULAR: {
        const ecForm = await db.form.create({
          data: {
            ...newFormData,
            // schType: body.schType,
            // innovation: body.innovation,
          },
        });
        return NextResponse.json(ecForm, { status: 201 });
      }

      case SchType.INNOVATION: {
        const ivForm = await db.form.create({
          data: {
            ...newFormData,
            // schType: body.schType,
            // innovation: body.innovation,
          },
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
