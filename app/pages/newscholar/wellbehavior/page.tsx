'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { SchType } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// 1) สร้าง Interface สำหรับผลลัพธ์ที่คาดว่ากลับมาจาก API
interface ScholarshipResponse {
  id: string; // รหัสทุน
  schName: string; // ชื่อทุน
  pdfUrl?: string; // ลิงก์ PDF (ถ้ามี)
  // ... ฟิลด์อื่นๆ ตามที่ /api/scholarship ส่งกลับ
}

const CreateWellBehavior = () => {
  // ฟิลด์ที่ต้องการกรอก
  const [schName, setSchName] = useState('');
  const [description, setDescription] = useState('');
  const [academiYear, setAcademiYear] = useState('');
  const [term, setTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [programType, setProgramType] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfMimeType, setPdfMimeType] = useState<string | null>(null);

  // Fix ชนิดทุนเป็น WELL_BEHAVIOR
  const [schType] = useState<SchType>(SchType.WELL_BEHAVIOR);

  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ฟังก์ชันจัดการไฟล์ PDF
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPdf(event.target.files[0]);
      setPdfMimeType(event.target.files[0].type);
    }
  };

  // ตัวอย่างการอัปโหลด PDF (ถ้าต้องการ)
  const handleUploadPdf = async (): Promise<string | null> => {
    if (!pdf) return null;

    // แปลงเป็น Base64
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64File = await toBase64(pdf);
      const formData = new FormData();
      formData.append('pdf', base64File);
      formData.append('mimeType', pdfMimeType || '');

      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setPdfUrl(url);
        return url;
      } else {
        setPdfUrl(null);
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setPdfUrl(null);
      return null;
    }
  };

  // ฟังก์ชัน Submit เพื่อสร้าง Scholarship
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ถ้ามี PDF ให้ทำการอัปโหลดก่อน
    const url = await handleUploadPdf();

    // เตรียมข้อมูล
    const payload = {
      schName,
      description,
      academiYear,
      term,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      schType, // WELL_BEHAVIOR
      programType,
      pdfUrl: url,
      dynamicQuestions: [], // ในหน้านี้ยังไม่กำหนดคำถาม => ให้เป็น array ว่าง
    };

    try {
      // 2) ใส่ <ScholarshipResponse> เป็น generic เพื่อบอกว่า res.data เป็น ScholarshipResponse
      const res = await axios.post<ScholarshipResponse>('/api/scholarship', payload);

      if (res.status === 201) {
        // 3) TypeScript รู้ว่า res.data เป็น ScholarshipResponse => เข้าถึง .id ได้
        const createdScholarship = res.data;
        const scholarshipId = createdScholarship.id;
        // ทำอะไรต่อ เช่น ไปหน้าถัดไป
        router.push(`/pages/newscholar/wellbehavior/example?pageScholarshipId=${scholarshipId}`);
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างทุน');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating scholarship');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Section (Full Screen) */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            สร้างโครงการความประพฤติดี
          </h2>
          <h1 className="mb-4 text-center font-bold text-gray-900">กรอกข้อมูลของโครงการ</h1>
          <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อโครงการ
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อโครงการ"
                  value={schName}
                  onChange={(e) => setSchName(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ประกาศโครงการ (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    className="mt-4 text-green-500"
                    target="_blank"
                    rel="noopener noreferrer">
                    {pdfUrl}
                  </a>
                )}
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    วันที่เริ่มโครงการ
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start date"
                    dateFormat="dd/MM/yyyy"
                    className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    วันที่จบโครงการ
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End date"
                    dateFormat="dd/MM/yyyy"
                    className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">ปีการศึกษา</label>
                  <input
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    type="number"
                    value={academiYear}
                    onChange={(e) => setAcademiYear(e.target.value)}
                    placeholder="2568"
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="term" className="mb-2 block text-sm font-medium text-gray-900">
                    ภาคการศึกษา
                  </label>
                  <select
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    id="term"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="เทอมต้น">เทอมต้น</option>
                    <option value="เทอมปลาย">เทอมปลาย</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="programType"
                    className="mb-2 block text-sm font-medium text-gray-900">
                    สำหรับหลักสูตร
                  </label>
                  <select
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    id="programType"
                    value={programType}
                    onChange={(e) => setProgramType(e.target.value)}
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="THAI">ภาคไทย</option>
                    <option value="INTERNATIONAL">ภาคนานาชาติ</option>
                    <option value="BOTHTHAIANDINTERNATIONAL">ทั้งภาคไทยและนานาชาติ</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  รายละเอียดโครงการ
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="รายละเอียดโครงการ"
                  rows={6}
                  required
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white">
              ยืนยันและไปหน้าถัดไป
            </button>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default CreateWellBehavior;
