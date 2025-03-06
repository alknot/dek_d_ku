'use client';

import apiClient from '@/common/apiClient';
import Modal from '@/components/Modal';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { differenceInDays, format } from 'date-fns';
import { th } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scholarship interface
  interface Scholarship {
    schType: string;
    id: number;
    academiYear: string;
    term: string;
    programType: string;
    schName: string;
    description: string;
    startDate: string;
    endDate: string;
    pdfUrl: string;
  }

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [academiYear, setAcademicYear] = useState('');
  const [term, setTerm] = useState('');
  const [programType, setProgramType] = useState('');
  const [schType, setSchType] = useState('');

  // สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // แสดง 10 แถวต่อหน้า

  // หา totalPages = เพดาน(จำนวนรายการ / pageSize)
  const totalPages = Math.ceil(scholarships.length / pageSize);

  // ตัด array scholarships ให้เหลือเฉพาะข้อมูลของหน้านั้น
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedScholarships = scholarships.slice(startIndex, endIndex);

  const router = useRouter();

  // ฟังก์ชันเปิด/ปิด Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ดึงข้อมูลทุน (Scholarship) จาก /api/scholarship
  const fetchScholarships = async () => {
    try {
      const response = await apiClient.get('/scholarship', {
        params: {
          academiYear,
          term,
          programType,
          schType,
        },
      });
      // สมมติว่า API ส่งกลับมาในรูปแบบ { scholarships: Scholarship[] }
      const data = response.data as { scholarships: Scholarship[] };
      setScholarships(data.scholarships);
      setCurrentPage(1); // รีเซ็ตเป็นหน้าแรกเมื่อมีการค้นหาใหม่
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    }
  };

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    console.log('Fetching scholarships...');
    fetchScholarships();
  }, []);

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    fetchScholarships();
  };

  // Modal เกี่ยวกับ Scholarship (ถ้าใช้งาน)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const handleOpenModal = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScholarship(null);
  };

  // ตัวอย่างฟังก์ชันเมื่อกด "สมัครโครงการนี้"
  const navigateToForm = (scholarship: Scholarship) => {
    if (!scholarship) {
      console.error('No scholarship selected');
      return;
    }
    setIsModalOpen(false); // Close the modal first

    switch (scholarship.schType) {
      case 'WELL_BEHAVIOR':
        if (scholarship.term === 'เทอมต้น') {
          const term = 1;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/wellbehavior/${scholarship.id}?academiYear=${encodeURIComponent(
            scholarship.academiYear
          )}&term=${encodeURIComponent(term)}`;
          router.push(url);
        } else if (scholarship.term === 'เทอมปลาย') {
          const term = 2;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/wellbehavior/${scholarship.id}?term=${encodeURIComponent(
            term
          )}&academicYear=${encodeURIComponent(scholarship.academiYear)}`;
          router.push(url);
        }
        break;
      case 'EXTRACURRICULAR':
        if (scholarship.term === 'เทอมต้น') {
          const term = 1;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/extracurricular/${scholarship.id}?academiYear=${encodeURIComponent(
            scholarship.academiYear
          )}&term=${encodeURIComponent(term)}`;
          router.push(url);
        } else if (scholarship.term === 'เทอมปลาย') {
          const term = 2;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/extracurricular/${scholarship.id}?term=${encodeURIComponent(
            term
          )}&academicYear=${encodeURIComponent(scholarship.academiYear)}`;
          router.push(url);
        }
        break;
      case 'INNOVATION':
        if (scholarship.term === 'เทอมต้น') {
          const term = 1;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/innovation/${scholarship.id}?academiYear=${encodeURIComponent(
            scholarship.academiYear
          )}&term=${encodeURIComponent(term)}`;
          router.push(url);
        } else if (scholarship.term === 'เทอมปลาย') {
          const term = 2;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/innovation/${scholarship.id}?term=${encodeURIComponent(
            term
          )}&academicYear=${encodeURIComponent(scholarship.academiYear)}`;
          router.push(url);
        }
        break;
      default:
        console.error('Unsupported scholarship type:', scholarship.schType);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="space-y-6 bg-gray-50 p-6">
          <h1 className="text-center text-2xl font-bold text-gray-800">โครงการที่เปิดรับสมัคร</h1>

          {/* Search */}
          <div className="space-y-4 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {/* Field 1: ปีการศึกษา */}
              <div>
                <input
                  type="text"
                  placeholder="ปีการศึกษา"
                  value={academiYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Field 2: เทอม */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}>
                <option value="">เทอม</option>
                <option value="เทอมต้น">เทอมต้น</option>
                <option value="เทอมปลาย">เทอมปลาย</option>
              </select>

              {/* Field 3: หลักสูตร */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}>
                <option value="">หลักสูตรที่เปิดรับ</option>
                <option value="THAI">หลักสูตรไทย</option>
                <option value="INTERNATIONAL">หลักสูตรนานาชาติ</option>
              </select>

              {/* Field 4: ประเภทโครงการ */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={schType}
                onChange={(e) => setSchType(e.target.value)}>
                <option value="">ประเภทโครงการ</option>
                <option value="WELL_BEHAVIOR">ประพฤติดี</option>
                <option value="EXTRACURRICULAR">กิจกรรมนอกหลักสูตร</option>
                <option value="INNOVATION">ความคิดสร้างสรรค์และนวัตกรรม</option>
              </select>
            </div>
            {/* ปุ่มค้นหา */}
            <div className="text-center">
              <button
                onClick={handleSearch}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-500">
                ค้นหา
              </button>
            </div>
          </div>

          {/* ตารางแสดงผล (Pagination) */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-center">ที่</th>
                  <th className="w-28 px-2 py-2 text-left text-center">ปีการศึกษา</th>
                  <th className="px-4 py-2 text-left text-center">เทอม</th>
                  <th className="px-4 py-2 text-left text-center">หลักสูตรที่เปิดรับ</th>
                  <th className="px-4 py-2 text-left text-center">โครงการ</th>
                  <th className="px-9 py-2 text-left text-center">กำหนดการ</th>
                  <th className="px-9 py-2 text-left text-center">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {displayedScholarships.map((scholarship, index) => {
                  const daysLeft = differenceInDays(new Date(scholarship.endDate), new Date());
                  let buttonColor = 'bg-green-600';
                  if (daysLeft <= 14 && daysLeft > 7) {
                    buttonColor = 'bg-yellow-600';
                  } else if (daysLeft <= 7) {
                    buttonColor = 'bg-red-600';
                  }

                  // ลำดับที่ = (currentPage - 1) * pageSize + index + 1
                  const itemNumber = (currentPage - 1) * pageSize + (index + 1);

                  return (
                    <tr key={scholarship.id}>
                      <td className="w-12 border px-4 py-2 text-center">{itemNumber}</td>
                      <td className="w-28 border px-4 py-2 text-center">
                        {scholarship.academiYear}
                      </td>
                      <td className="w-28 border px-4 py-2 text-center">{scholarship.term}</td>
                      <td className="w-40 border px-4 py-2 text-center">
                        {scholarship.programType === 'THAI'
                          ? 'หลักสูตรไทย'
                          : scholarship.programType === 'INTERNATIONAL'
                            ? 'หลักสูตรนานาชาติ'
                            : scholarship.programType === 'BOTHTHAIANDINTERNATIONAL'
                              ? 'หลักสูตรไทย,นานาชาติ'
                              : scholarship.programType}
                      </td>
                      <td className="border px-4 py-2">{scholarship.schName}</td>
                      <td className="w-80 border px-4 py-2 text-center">
                        {format(new Date(scholarship.startDate), 'dd MMMM yyyy', { locale: th })} -{' '}
                        {format(new Date(scholarship.endDate), 'dd MMMM yyyy', { locale: th })}
                        <br />
                        {daysLeft >= 0 ? (
                          <button className={`rounded-lg px-2 py-1 text-white ${buttonColor}`}>
                            คงเหลือ {daysLeft} วัน
                          </button>
                        ) : (
                          <span className="text-red-600">หมดเขต</span>
                        )}
                      </td>
                      <td className="w-40 border px-4 py-2 text-center">
                        {daysLeft >= 0 && (
                          <button
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                            onClick={() => handleOpenModal(scholarship)}>
                            รายละเอียด
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* แถบ Pagination เป็นปุ่มเลขหน้า */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg px-3 py-1 ${
                    page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal แสดงรายละเอียดทุน */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedScholarship && (
          <div>
            <h2 className="mb-4 text-xl font-bold">{selectedScholarship.schName}</h2>
            <div className="flex items-center space-x-2">
              <p>
                <strong>เอกสารประจำโครงการ:</strong>
              </p>
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                onClick={() => window.open(selectedScholarship.pdfUrl, '_blank')}>
                แสดงเอกสาร
              </button>
            </div>
            <p>
              <strong>ปีการศึกษา:</strong> {selectedScholarship.academiYear}
            </p>
            <p>
              <strong>เทอม:</strong> {selectedScholarship.term}
            </p>
            <p>
              <strong>หลักสูตรที่เปิดรับ:</strong>{' '}
              {selectedScholarship.programType === 'THAI'
                ? 'หลักสูตรไทย'
                : selectedScholarship.programType === 'INTERNATIONAL'
                  ? 'หลักสูตรนานาชาติ'
                  : selectedScholarship.programType === 'BOTHTHAIANDINTERNATIONAL'
                    ? 'หลักสูตรไทย,นานาชาติ'
                    : selectedScholarship.programType}
            </p>
            <p>
              <strong>รายละเอียดโครงการ:</strong> {selectedScholarship.description}
            </p>
            <p>
              <strong>กำหนดการ:</strong>{' '}
              {format(new Date(selectedScholarship.startDate), 'dd MMMM yyyy', { locale: th })} -{' '}
              {format(new Date(selectedScholarship.endDate), 'dd MMMM yyyy', { locale: th })}
            </p>

            <button
              className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white"
              onClick={() => navigateToForm(selectedScholarship)}>
              สมัครโครงการนี้
            </button>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <Footer />
    </div>
  );
}
