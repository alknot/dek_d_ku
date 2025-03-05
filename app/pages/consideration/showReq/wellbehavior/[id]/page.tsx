'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { differenceInDays } from 'date-fns';
import { th } from 'date-fns/locale';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Scholarship {
  id: string;
  schName: string;
  // ฟิลด์อื่นๆ ตามที่ API ส่งกลับ
}

interface FormType {
  id: string;
  scholarshipID: string;
  schType: string;
  approveStatus: string;
  nisitNameTh: string;
  nisitNameEn: string;
  nisitAcademicyear: string;
  nisitid: string;
  faculty: string;
  department: string;
  advisor: string;
  gpa: number;
  dateofBirth: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  isLastTerm: boolean;
  certificate?: string | null;
  activityImageUrl?: string | null;
  // สามารถเพิ่ม field อื่น ๆ ที่ต้องการแสดงได้
}

export default function CommitteeViewPage() {
  // State สำหรับฟอร์มทั้งหมด
  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State สำหรับ search bar
  const [studentId, setStudentId] = useState('');
  const [academiYear, setAcademicYear] = useState('');
  const [term, setTerm] = useState('');
  const [programType, setProgramType] = useState('');
  const [schType, setSchType] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึงค่า query parameter เริ่มต้น (ถ้ามี)
  useEffect(() => {
    const initialYear = searchParams.get('academicYear') || '';
    const initialTerm = searchParams.get('term') || '';
    setAcademicYear(initialYear);
    setTerm(initialTerm);
  }, [searchParams]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ฟังก์ชันดึงข้อมูลฟอร์มจาก API โดยส่ง query parameters

  const scholarshipID = useParams().id;
  const [schName, setSchName] = useState<string>('');

  useEffect(() => {
    if (!scholarshipID) return;
    console.log('working009');
    // เรียก API เพื่อดึงข้อมูลทุน
    fetch(`/api/scholarship/${scholarshipID}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch scholarship details');
        }
        return res.json();
      })
      .then((data: Scholarship) => {
        setSchName(data.schName);
      })
      .catch((err) => console.error(err));
  }, [scholarshipID]);

  const fetchForms = async (p0: {
    studentId: string;
    academiYear: string;
    term: string;
    programType: string;
    schType: string;
  }) => {
    try {
      const academicYearParam = searchParams.get('academicYear');
      console.log(academicYearParam);
      const termParam = searchParams.get('term');
      const normalizedTerm =
        termParam === '1' ? 'เทอมต้น' : termParam === '2' ? 'เทอมปลาย' : termParam;
      console.log(normalizedTerm);

      console.log(scholarshipID);
      const response = await axios.get('/api/request', {
        params: {
          scholarshipID: scholarshipID,
          academicYear: academicYearParam,
          term: normalizedTerm,
        },
      });
      console.log(response.data);
      setForms(response.data as FormType[]);
    } catch (err: any) {
      console.error('Failed to fetch forms:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // เมื่อหน้าโหลด, ดึงข้อมูลฟอร์มด้วย query parameters เริ่มต้น
  useEffect(() => {
    fetchForms({ studentId, academiYear, term, programType, schType });
  }, [academiYear, term, programType, schType, studentId]);

  const handleSearch = () => {
    setLoading(true);
    fetchForms({ studentId, academiYear, term, programType, schType });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading forms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="space-y-6 bg-gray-50 p-6">
          <h1 className="text-center text-2xl font-bold">พิจารณาผู้สมัครเข้าร่วมโครงการ</h1>
          <h2 className="text-center text-xl font-semibold">โครงการ{schName}</h2>
          <div className="mt-4 text-center">
            <p>
              ปีการศึกษา: <strong>{academiYear}</strong> ภาคการศึกษา:{' '}
              <strong>{term === '1' ? 'เทอมต้น' : 'เทอมปลาย'}</strong>
            </p>
          </div>

          {/* Search Bar */}
          <div className="space-y-4 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <input
                type="text"
                placeholder="รหัสนิสิต"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              />
              <input
                type="text"
                placeholder="ชื่อนิสิต"
                value={academiYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              />
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2">
                <option value="">ประเภทย่อย</option>
                <option value="THAI">การแข่งขันทางวิชาการ/ศิลปกรรม</option>
                <option value="INTERNATIONAL">การดำรงตำแหน่ง</option>
                <option value="BOTH">สร้างเกียรติคุณต่อคณะ/มหาลัย</option>
              </select>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2">
                <option value="">ระดับการแข่งขัน</option>
                <option value="ระดับอุดมศึกษา">ระดับอุดมศึกษา</option>
                <option value="ระดับชาติ">ระดับชาติ</option>
                <option value="ระดับนานาชาติ">ระดับนานาชาติ</option>
              </select>
              <select
                value={schType}
                onChange={(e) => setSchType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2">
                <option value="">สถานะการตัดสิน</option>
                <option value="PENDING">รอการพิจารณา</option>
                <option value="PASS">ผ่านการพิจารณา</option>
                <option value="NOT_PASS">ไม่ผ่านการพิจารณา</option>
              </select>
            </div>
            <div className="text-center">
              <button
                onClick={handleSearch}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-500">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Table of Forms */}
          {forms.length === 0 ? (
            <p className="text-center">ยังไม่มีฟอร์มสมัครทุน</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">ที่</th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">รหัสนิสิต</th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                      ชื่อนิสิต (ไทย)
                    </th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">คณะ</th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">ภาควิชา</th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                      จำนวนเงินเต็มที่ควรเก็บได้
                    </th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                      จำนวนเงินที่ได้จริง
                    </th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">พิจารณาผล</th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                      สถานะการพิจารณาผล
                    </th>
                    <th className="px-6 py-3 text-center uppercase tracking-wider">comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {forms.map((form, index) => (
                    <tr key={form.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {form.nisitid}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {form.nisitNameTh}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {form.faculty}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {form.department}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {/* {form.department} */}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {/* {form.department} */}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {form.approveStatus === 'PENDING_SUBDEAN' && (
                          <button
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                            onClick={() =>
                              router.push(`/pages/showrequest/wellbehavior/${form.id}`)
                            }>
                            พิจารณาผล
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        {form.approveStatus}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                        <button
                          // onClick={generatePDF}
                          className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-500">
                          ดาวน์โหลด PDF รายชื่อ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
