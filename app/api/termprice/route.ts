import { getFieldValue } from '@/app/libs/common';
import { generateCuid, handleError } from '@/app/libs/utils';
import { PrismaClient, Role, Termprice } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

const db = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const academicYearParam = searchParams.get('academicYear');
    const termParam = searchParams.get('term');
    const facultyParam = searchParams.get('faculty');
    const departmentParam = searchParams.get('department');
    const programTypeParam = searchParams.get('programType');
    const studyParam = searchParams.get('study');

    // สร้าง object สำหรับ filter โดยเริ่มจาก academicYear และ term
    const filter: {
      academicYear?: string;
      term?: string;
      faculty?: string;
      department?: string;
      programType?: string;
      study?: string;
    } = {};

    if (academicYearParam) {
      const academicYear = Number(academicYearParam);
      if (!isNaN(academicYear)) {
        filter.academicYear = academicYear.toString();
      }
    }
    if (termParam) {
      let normalizedTerm = termParam;
      if (termParam === '1') {
        normalizedTerm = 'เทอมต้น';
      } else if (termParam === '2') {
        normalizedTerm = 'เทอมปลาย';
      }
      filter.term = normalizedTerm;
    }
    // เพิ่ม filter สำหรับ faculty, department, programType และ study
    if (facultyParam) {
      filter.faculty = facultyParam;
    }
    if (departmentParam) {
      filter.department = departmentParam;
    }
    if (programTypeParam) {
      if (programTypeParam === 'THAI') {
        filter.programType = 'ไทย';
      } else if (programTypeParam === 'INTERNATIONAL') {
        filter.programType = 'นานาชาติ';
      } else {
        filter.programType = programTypeParam;
      }
    }
    if (studyParam) {
      filter.study = studyParam;
    }

    const termPrices = await db.termprice.findMany({
      where: filter,
    });

    return NextResponse.json(termPrices, { status: 200 });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // const token = req.headers.get('Authorization');

    // const userId = '';

    // const user = await db.user.findUnique({ where: { id: userId } });
    // if (!user) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    // if (user.role !== Role.SA_STAFF) {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing request body' }, { status: 400 });
    }

    const requiredFields = [
      'academicYear',
      'term',
      'department',
      'faculty',
      'price1',
      'price2',
      'price3',
      'programType',
      'study',
      'sumPrice',
    ];

    // Validate required fields
    const missingField = requiredFields.find((field) => !getFieldValue(body, field));
    if (missingField) {
      return NextResponse.json({ message: `${missingField} is missing` }, { status: 400 });
    }

    if (!body)
      return NextResponse.json(
        { message: 'Term or price details are incomplete' },
        { status: 400 }
      );

    const termPriceData: Termprice = {
      id: generateCuid(),
      academicYear: body.academicYear,
      term: body.term,
      department: body.department,
      faculty: body.faculty,
      price1: body.price1,
      price2: body.price2,
      price3: body.price3,
      programType: body.programType,
      study: body.study,
      sumPrice: body.sumPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTermPrice = await db.termprice.create({
      data: termPriceData,
    });

    return NextResponse.json(newTermPrice, { status: 201 });
  } catch (e: any) {
    return handleError(e);
  }
}

export async function DELETE(request: Request) {
  try {
    // อ่าน query parameters จาก URL
    const { searchParams } = new URL(request.url);
    const academicYearParam = searchParams.get('academicYear');
    const termParam = searchParams.get('term');

    // สร้าง object สำหรับเงื่อนไข filter
    const filter: { academicYear?: string; term?: string } = {};

    if (academicYearParam) {
      const academicYear = Number(academicYearParam);
      if (!isNaN(academicYear)) {
        filter.academicYear = academicYear.toString();
      }
    }
    if (termParam) {
      filter.term = termParam;
    }

    // ตรวจสอบว่ามีการส่งค่ามาอย่างน้อย academicYear และ term
    if (!filter.academicYear || !filter.term) {
      return NextResponse.json({ message: 'Missing filter parameters' }, { status: 400 });
    }

    // ลบข้อมูลที่ตรงกับเงื่อนไขที่ระบุ
    const deleteResult = await db.termprice.deleteMany({
      where: filter,
    });

    return NextResponse.json(deleteResult, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}
