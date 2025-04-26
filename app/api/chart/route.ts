import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const db = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const academicYear = searchParams.get('academicYear')!;
  const rawTerm = searchParams.get('term')!;
  const term = (() => {
    switch (rawTerm) {
      case 'เทอมต้น':
        return '1';
      case 'เทอมปลาย':
        return '2';
      default:
        return rawTerm;
    }
  })();
  console.log('academicYear data:', academicYear);
  console.log('term data:', term);
  // นับจำนวนฟอร์มที่ยื่นในแต่ละ scholarshipID
  const grouped1 = await db.form.groupBy({
    by: ['scholarshipID'],
  });
  console.log('Grouped1 data:', grouped1);
  const grouped = await db.form.groupBy({
    by: ['scholarshipID'],
    where: {
      academicYear: academicYear,
      term: term,
    },

    _count: { id: true },
  });

  // ดึงชื่อโครงการมาจากตาราง scholarship
  const data = await Promise.all(
    grouped.map(async (g) => {
      const sch = await db.scholarship.findUnique({
        where: { id: g.scholarshipID },
      });
      return {
        project: sch?.schName ?? 'Unknown',
        count: g._count.id,
      };
    })
  );
  console.log('Grouped data:', data);
  return NextResponse.json(data);
}
