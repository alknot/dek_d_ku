'use client';

import { cn } from '@/app/libs/utils';
import Typography from '@/components/partial/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompetitiveLevel } from '@prisma/client';
import {
  Document,
  Font,
  Image,
  PDFDownloadLink,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

// ลงทะเบียนฟอนต์ Sarabun จากไฟล์ใน public/fonts (ถ้ามี)
Font.register({
  family: 'Sarabun',
  src: '/fonts/Sarabun/Sarabun-Regular.ttf',
});

// สร้างสไตล์สำหรับ PDF Document โดยใช้ฟอนต์ Sarabun
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    lineHeight: 1.4,
    fontFamily: 'Sarabun',
  },
  headerImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 0.1,
    fontFamily: 'Sarabun',
  },
  startmain: {
    marginLeft: 100,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
  },
  main: {
    marginLeft: 50,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
  },
  lastmain: {
    marginLeft: 100,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
    marginTop: 10,
  },
  maindate: {
    marginLeft: 100,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
    marginTop: 15,
    textAlign: 'center',
  },

  maindate2: {
    marginLeft: 150,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Sarabun',
    marginTop: 15,
    textAlign: 'center',
  },

  maintable: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    fontFamily: 'Sarabun',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    fontFamily: 'Sarabun',
    textAlign: 'center',
    fontSize: 15,
  },
  tableRow: {
    flexDirection: 'row',
    fontFamily: 'Sarabun',
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#e4e4e4',
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Sarabun',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Sarabun',
  },
  summaryText: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 1.6,
    fontFamily: 'Sarabun',
  },
});
interface Scholarship {
  id: string;
  schName: string;
  schType: string;
  term: string;
  academiYear: string;
  // ฟิลด์อื่นๆ ตามที่ API ส่งกลับ
}

interface FormType {
  id: string;
  scholarshipID: string;
  schType: string;
  approveStatus: string;

  // Static Fields
  nisitNameTh: string;
  nisitNameEn: string;
  nisitid: string;
  faculty: string;
  department: string;

  programType: string;

  innovation: {
    // extracurricularType: string | null;
    competitiveLevel: string | null;
  } | null;
}

// สร้าง Document Component โดยเพิ่ม Image เข้าไป (เช่น Logo ของเอกสาร)
export default function PrintEx() {
  const PDFViewer = dynamic(() => import('../../pdfViewer'), {
    ssr: false,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params.id;
  console.log('id', id);

  const [formDetail, setFormDetail] = useState<FormType[] | null>(null);
  const [schDetail, setschDetail] = useState<Scholarship | null>(null);
  useEffect(() => {
    if (!id) return;
    const fetchSchDetail = async () => {
      try {
        console.log('woek2');
        const res = await fetch(`/api/scholarship/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch form, status: ${res.status}`);
        }
        const data: Scholarship = await res.json();
        setschDetail(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSchDetail();
  }, []);

  const competitiveLevelMapping: { [key: string]: string } = {
    TERTIARY: 'ระดับอุดมศึกษา',
    NATIONAL: 'ระดับชาติ',
    INTERNATIONAL: 'ระดับนานาติ',
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetchFormDetail = async () => {
      try {
        console.log('woek1');
        const res = await fetch(`/api/request/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch form, status: ${res.status}`);
        }
        const data: FormType[] = await res.json();
        setFormDetail(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFormDetail();
  }, []);
  const date = new Date();
  const dateNow = format(date, 'dd MMMM yyyy', { locale: th });

  const MyDocument = ({
    studentList,
    schDetail,
  }: {
    studentList: FormType[];
    schDetail: Scholarship;
  }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* เพิ่มรูป (Image) ที่ด้านบน */}
        <Image
          style={styles.headerImage}
          src="/images/Logo_ku_th.svg.png" // เปลี่ยนเป็น URL ของรูปที่ต้องการ
        />

        {/* ส่วนที่ 1: สรุปทุนการศึกษาทั้งหมด */}
        <Text style={styles.subtitle}>ประกาศมหาวิทยาลัยเกษตรศาสตร์</Text>
        <Text style={styles.subtitle}>เรื่อง โครงการ {schDetail.schName}</Text>
        <Text style={styles.subtitle}>--------------------------------</Text>

        <Text style={styles.startmain}>
          ตามที่มหาวิทยาลัยเกษตรศาสตร์ ได้ตราระเบียบว่าด้วยการสร้างค่านิยมที่ดีของนิสิต พ.ศ. ๒๕๕๓
        </Text>

        {/* ส่วนที่ 2: สรุปทุนส่วนกลางของมหาวิทยาลัย */}
        <Text style={styles.main}>
          เพื่อเสริมสร้างให้นิสิตได้มีค่านิยมต่อการประกอบความดีให้ยิ่งๆขึ้นไป นั้น
          คณะอนุกรรมการพิจารณานิสิตดีเด่น
        </Text>
        <Text style={styles.main}>
          และผู้แทนนิสิตเข้ารับรางวัลพระราชทาน
          ได้ดำเนินการคัดเลือกนิสิตที่มีผลงานดีเด่นด้านความประพฤติดีเด่นน
        </Text>
        <Text style={styles.main}>
          ประจำ {schDetail.term} ปีการศึกษา {schDetail.academiYear}{' '}
          ที่มีคุณสมบัติตามที่ได้กำหนดไว้ในระเบียบดังกล่าววว
        </Text>
        <Text style={styles.lastmain}>จึงประกาศยกย่องเพื่อมาเป็นเกียรติสืบไป</Text>
        <Text style={styles.maindate}>ประกาศ ณ วันที่ {dateNow}</Text>

        <Text style={{ ...styles.maindate2, marginTop: 30, fontSize: 12 }}>
          (ลงชื่อ) .......................................................
        </Text>
        <Text style={{ ...styles.maindate2, marginTop: 5, fontSize: 12 }}>
          ผู้อนุมัติทุนการศึกษา
        </Text>
      </Page>

      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.subtitle}>
          รายชื่อนิสิตที่มีผลงานดีเด่นด้านความประพฤติดี ประจำ{schDetail.term} ปีการศึกษา{' '}
          {schDetail.academiYear}
        </Text>
        <Text style={styles.subtitle}>
          นิสิตที่ได้รับการยกเว้นธรรมเนียมการศึกษา ประจำ{schDetail.term} ปีการศึกษา{' '}
          {schDetail.academiYear}
        </Text>

        {/* <Text style={styles.maintable}>รายชื่อนิสิตผู้ได้รับทุน</Text> */}

        <View style={styles.table}>
          {/* หัวตาราง */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { width: '5%' }]}>ลำดับบ</Text>
            <Text style={[styles.tableColHeader, { width: '10%' }]}>รหัสนิสิต</Text>
            <Text style={[styles.tableColHeader, { width: '30%' }]}>ชื่อ-สกุล</Text>
            <Text style={[styles.tableColHeader, { width: '15%' }]}>คณะ</Text>
            <Text style={[styles.tableColHeader, { width: '15%' }]}>สาขาวิชา</Text>
            <Text style={[styles.tableColHeader, { width: '25%' }]}>ระดับการแข่งขัน</Text>
          </View>

          {/* แสดงข้อมูลจาก studentList */}
          {studentList.map((student, index) => (
            <View style={styles.tableRow} key={student.id}>
              <Text style={[styles.tableCol, { width: '5%' }]}>{index + 1}</Text>
              <Text style={[styles.tableCol, { width: '10%' }]}>{student.nisitid}</Text>
              <Text style={[styles.tableCol, { width: '30%' }]}>{student.nisitNameTh}</Text>
              <Text style={[styles.tableCol, { width: '15%' }]}>{student.faculty}</Text>
              <Text style={[styles.tableCol, { width: '15%' }]}>{student.department}</Text>
              <Text style={[styles.tableCol, { width: '25%' }]}>
                {student.innovation?.competitiveLevel
                  ? competitiveLevelMapping[student.innovation.competitiveLevel] ||
                    student.innovation.competitiveLevel
                  : ''}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
  return (
    <div>
      {formDetail && schDetail && (
        <PDFViewer width="100%" height="1200">
          <MyDocument studentList={formDetail} schDetail={schDetail} />
        </PDFViewer>
      )}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        {/* <PDFDownloadLink document={<MyDocument />} fileName="ScholarshipSummary2566.pdf">
          {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
        </PDFDownloadLink> */}
      </div>
    </div>
  );
}
