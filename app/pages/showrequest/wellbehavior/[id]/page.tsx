'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// import { console } from "inspector";

// สมมติรูปแบบของ Dynamic Question
interface DynamicQuestion {
  question: string;
  type: string; // เช่น "TEXT", "CHECKBOX", "CHOICE", "DATE"
  options?: string[]; // ในกรณีที่เป็น CHOICE/CHECKBOX
  required?: boolean;
  answer?: string; // หรืออาจเป็น array ถ้าเป็น checkbox
  selectedDate?: string; // ถ้า type เป็น DATE
}

// กำหนด type สำหรับ Form ตาม Schema ของคุณ
interface FormType {
  id: string;
  scholarshipID: string;
  schType: string;
  approveStatus: string;

  // Static Fields
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

  programType: string;
  study: string;

  academicYear: string;
  term: string;

  certificate?: string | null;
  activityImageUrl?: string | null;
  wellBehavior?: {
    beahavior_detail: string;
  } | null;

  // Dynamic Questions
  dynamicQuestions?: DynamicQuestion[];
}

interface TermPriceData {
  price1: number;
  price2: number;
  price3: number;
  sumPrice: number;
}

export default function ShowRequestFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // รับ id จาก URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [formDetail, setFormDetail] = useState<FormType | null>(null);
  const [termPriceData, setTermPriceData] = useState<TermPriceData | null>(null);
  console.log('termpricedata', termPriceData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // ดึงข้อมูลฟอร์มจาก API
  useEffect(() => {
    if (!id) return;
    const fetchFormDetail = async () => {
      try {
        const res = await fetch(`/api/request/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch form, status: ${res.status}`);
        }
        const data: FormType = await res.json();
        setFormDetail(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFormDetail();
  }, [id]);
  ///////////////////////////////////////////////
  useEffect(() => {
    if (!formDetail) return;
    // ตรวจสอบว่าค่าที่จำเป็นมีครบหรือไม่ (study อาจเป็น null ก็ได้)

    const academicYear = formDetail.academicYear || '';
    const term = formDetail.term || '';
    const faculty = formDetail.faculty || '';
    const department = formDetail.department || '';
    const programType = formDetail.programType || '';
    const study = formDetail.study || '';

    const fetchTermPriceData = async () => {
      try {
        // สร้าง URLSearchParams เพื่อรวม query parameters
        const params = new URLSearchParams({
          academicYear,
          term,
          faculty,
          department,
          programType,
        });

        // ถ้ามีค่า study (ไม่ใช่ null) ให้ append เข้าไปด้วย
        if (study !== null && study !== undefined) {
          params.append('study', study);
        }

        const response = await fetch(`/api/termprice?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Error fetching termprice: ${response.status}`);
        }
        const data = await response.json();
        setTermPriceData(data[0]); // สมมติว่าเราเก็บข้อมูลไว้ใน state ชื่อ termpriceData
        console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTermPriceData();
  }, [formDetail]);
  ///////////////////////////////////////

  // ฟังก์ชันสำหรับจัด format วันเกิดเป็น dd/MM/yyyy
  const formattedDateOfBirth = formDetail?.dateofBirth
    ? format(parseISO(formDetail.dateofBirth), 'dd/MM/yyyy', { locale: th })
    : 'ไม่ระบุวันเกิด';

  // ฟังก์ชันอัปเดตสถานะฟอร์ม
  const updateFormStatus = async (status: string) => {
    if (!formDetail) return;
    try {
      const res = await fetch(`/api/request/${formDetail.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approveStatus: status }),
      });
      if (!res.ok) {
        throw new Error(`Update failed, status: ${res.status}`);
      }
      const updatedForm = await res.json();
      setFormDetail(updatedForm);
      alert(`อัปเดตสถานะสำเร็จ: ${status}`);
      window.history.back();
    } catch (error: any) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading form details...</p>
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

  if (!formDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Form not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />
      {/* Main Section */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            แบบฟอร์มเสนอรายชื่อนิสิตดีเด่นมหาวิทยาลัยเกษรศาสตร์
          </h2>

          {/* Static Fields */}
          <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาไทย)
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={formDetail.nisitNameTh}
                  readOnly
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={formDetail.nisitNameEn}
                  readOnly
                />
              </div>
              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    นิสิตชั้นปีที่
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.nisitAcademicyear}
                    readOnly
                  />
                </div>
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">รหัสนิสิต</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.nisitid}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">เกิดวันที่</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formattedDateOfBirth}
                    readOnly
                  />
                </div>
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">อายุ</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.age}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">คณะ</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.faculty}
                    readOnly
                  />
                </div>
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    ภาควิชา/สาขาวิชา
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.department}
                    readOnly
                  />
                </div>
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    คะแนนเฉลี่ยสะสม
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.gpa.toString()}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">โทรศัพท์</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.phone}
                    readOnly
                  />
                </div>
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">E-mail</label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={formDetail.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่ออาจารย์ที่ปรึกษา
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={formDetail.advisor}
                  readOnly
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ที่อยู่ปัจจุบัน
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={formDetail.address}
                  readOnly
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  บรรยายความประพฤติดี
                </label>
                <textarea
                  rows={6}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={formDetail.wellBehavior?.beahavior_detail || 'ไม่มีข้อมูล'}
                  readOnly
                />
              </div>
            </div>

            {/* Dynamic Questions Section */}
            {formDetail.dynamicQuestions && formDetail.dynamicQuestions.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-2 text-lg font-bold">คำถามเพิ่มเติม</h2>
                {formDetail.dynamicQuestions.map((dq, index) => (
                  <div key={index} className="mb-4 rounded border p-4">
                    <p className="mb-2 font-bold">
                      Q{index + 1}: {dq.question}
                    </p>
                    {/* ตรวจสอบประเภทของคำถาม */}
                    {dq.type === 'TEXT' && (
                      <p className="text-gray-700">คำตอบ: {dq.answer || 'ไม่มีคำตอบ'}</p>
                    )}
                    {dq.type === 'CHOICE' && (
                      <p className="text-gray-700">คำตอบ (ตัวเลือก): {dq.answer || 'ไม่มีคำตอบ'}</p>
                    )}
                    {dq.type === 'CHECKBOX' && (
                      <p className="text-gray-700">คำตอบ (Checkbox): {dq.answer || 'ไม่มีคำตอบ'}</p>
                    )}
                    {dq.type === 'DATE' && (
                      <p className="text-gray-700">
                        วันที่เลือก:{' '}
                        {dq.selectedDate
                          ? format(parseISO(dq.selectedDate), 'dd/MM/yyyy', { locale: th })
                          : 'ไม่มีข้อมูล'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="mb-2 mt-6 font-bold text-gray-900">จำนวนเงินเต็มที่ควรเก็บได้</p>
            <div className="mb-4 flex space-x-10 sm:col-span-2">
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงมหาลัย
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={termPriceData?.price1?.toString() || ''}
                  readOnly
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงคณะ
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={termPriceData?.price2?.toString() || ''}
                  readOnly
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าหน่วยกิต
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={termPriceData?.price3?.toString() || ''}
                  readOnly
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  รวม
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={termPriceData?.sumPrice?.toString() || ''}
                  readOnly
                />
              </div>
            </div>

            <p className="mb-2 font-bold text-gray-900">จำนวนเงินที่ควรเก็บได้จริง</p>
            <div className="flex space-x-10 sm:col-span-2">
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงมหาลัย
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                  readOnly
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงคณะ
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                  readOnly
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าหน่วยกิต
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                  readOnly
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  รวม
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                  readOnly
                />
              </div>
            </div>

            {/* ปุ่มย้อนกลับ + ปุ่ม comment + ปุ่มตัดสิน */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                className="w-1/6 rounded-lg bg-gray-500 px-4 py-2 text-white"
                onClick={() => window.history.back()}>
                ย้อนกลับ
              </button>
              <div className="flex space-x-3">
                <button type="button" className="rounded-lg bg-blue-500 px-4 py-2 text-white">
                  comment
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-red-500 px-4 py-2 text-white"
                  onClick={() => updateFormStatus('REJECTED')}>
                  ไม่ผ่านการตัดสิน
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-green-500 px-4 py-2 text-white"
                  onClick={() => updateFormStatus('PENDING_DEAN')}>
                  ผ่านการตัดสิน
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
