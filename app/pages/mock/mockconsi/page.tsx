'use client';

import Modal from '@/components/Modal';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { differenceInDays, format } from 'date-fns';
import { th } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './nuebotton.module.css';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  interface Scholarship {
    id: number;
    academiYear: string;
    term: string;
    programType: string;
    schName: string;
    description: string;
    startDate: string;
    endDate: string;
    pdf: string;
  }

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [academiYear, setAcademicYear] = useState('');
  const [term, setTerm] = useState('');
  const [programType, setProgramType] = useState('');
  const [schType, setSchType] = useState('');
  const router = useRouter();

  // const navigateToForm = (scholarship: Scholarship) => {
  //   // Here you can either set state or use routing to navigate
  //   // For example, using React Router:

  //   router.push(`../../../pages/recentscholar/applyform/${selectedScholarship?.id}`);
  //   setIsModalOpen(false); // Close the modal first
  //   // Alternatively, set some state to conditionally render the form in the current component
  //   setSelectedScholarship(scholarship); // assuming this triggers the form display
  // };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/scholarship', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          academiYear: academiYear,
          term: term,
          programType: programType,
          schType: schType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scholarships');
      }

      const data: { scholarships: Scholarship[] } = await response.json();
      setScholarships(data.scholarships);
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleSearch = () => {
    fetchScholarships();
  };

  const handleOpenModal = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScholarship(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Section (Full Screen) */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="space-y-6 bg-gray-50 p-6">
          {/* หัวข้อ */}
          <h1 className="text-center text-2xl font-bold text-gray-800">
            พิจารณาผู้สมัครเข้าร่วมโครงการ
          </h1>

          {/* ช่องค้นหา */}
          <div className="space-y-4 rounded-lg bg-white p-4 shadow">
            <h3 className="text-center text-2xl font-bold text-gray-800">โครงการ [$schName]</h3>
            <h1 className="text-center text-2xl font-bold text-gray-800">
              ปีการศึกษา [$academiYear] ภาคการศึกษา [$term]
            </h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {/* Dropdown 1 */}
              <div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="รหัสนิสิต"
                  value={academiYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </div>
              {/* Dropdown 2 */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}>
                <option value="">ประเภทย่อย</option>
                <option value="THAI">เข้าร่วมการแข่งขันทางวิชาการหรือศิลปกรรม</option>
                <option value="INTERNATIONAL">การดำรงตำแหน่ง</option>
                <option value="INTERNATIONAL">
                  นิสิตที่ดำเนินกิจกรรมสร้างเกียรติคุณต่อคณะหรือมหาลัย
                </option>
              </select>
              {/* Dropdown 3 */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}>
                <option value="">ระดับการแข่งขัน</option>
                <option value="เทอมต้น">ระดับอุดมศึกษา</option>
                <option value="เทอมปลาย">ระดับชาติ</option>
                <option value="เทอมปลาย">ระดับนานาชาติ</option>
              </select>
              {/* Dropdown 4 */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={schType}
                onChange={(e) => setSchType(e.target.value)}>
                <option value="">สถานะการตัดสิน</option>
                <option value="WELL_BEHAVIOR">รอการพิจารณา</option>
                <option value="EXTRACURRICULAR">ผ่านการพิจารณา</option>
                <option value="ACADEMIC">ไม่ผ่านการพิจารณา</option>
              </select>
              {/* Dropdown 5 */}

              {/* Dropdown 6 */}
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

          {/* ตาราง */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-center">ที่</th>
                  <th className="w-36 px-2 py-2 text-left text-center">รหัสนิสิต</th>
                  <th className="px-4 py-2 text-left text-center">ชื่อ - สกุล</th>
                  <th className="px-4 py-2 text-left text-center">หลักสูตร</th>
                  <th className="px-4 py-2 text-left text-center">คณะ</th>
                  <th className="px-9 py-2 text-left text-center">ภาควิชา</th>
                  <th className="px-9 py-2 text-left text-center">จำนวนเงินเต็มที่ควรเก็บได้</th>
                  <th className="px-9 py-2 text-left text-center">จำนวนเงินที่ได้จริง</th>
                  <th className="px-9 py-2 text-left text-center">พิจารณาผล</th>
                  <th className="px-9 py-2 text-left text-center">สถานะการพิจารณาผล</th>
                  <th className="px-9 py-2 text-left text-center">comment</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((scholarship, index) => {
                  const daysLeft = differenceInDays(new Date(scholarship.endDate), new Date());
                  let buttonColor = 'bg-green-600';
                  if (daysLeft <= 14 && daysLeft > 7) {
                    buttonColor = 'bg-yellow-600';
                  } else if (daysLeft <= 7) {
                    buttonColor = 'bg-red-600';
                  }

                  return (
                    <tr key={scholarship.id}>
                      <td className="w-12 border px-4 py-2">{index + 1}</td>
                      <td className="w-28 border px-2 py-2 text-center">6410401027</td>
                      <td className="w-96 border px-4 py-2 text-center"></td>
                      <td className="w-60 border px-4 py-2"></td>
                      <td className="border px-4 py-2"></td>
                      <td className="w-80 border px-4 py-2 text-center"></td>
                      <td className="w-60 border px-4 py-2 text-center"></td>
                      <td className="w-60 border px-4 py-2 text-center"></td>
                      <td className="w-40 border px-4 py-2 text-center">
                        <button
                          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                          onClick={() => handleOpenModal(scholarship)}>
                          พิจารณาผล
                        </button>
                      </td>
                      <td className="w-40 border px-2 py-2 text-center">
                        <button className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-blue-400">
                          ผ่าน
                        </button>
                      </td>
                      <td className="w-28 border px-2 py-2 text-center">
                        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400">
                          comment
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedScholarship && (
          <div>
            <h2 className="mb-4 text-xl font-bold">{selectedScholarship.schName}</h2>
            <p>
              <strong>ปีการศึกษา:</strong> {selectedScholarship.academiYear}
            </p>
            <p>
              <strong>เทอม:</strong> {selectedScholarship.term}
            </p>
            <p>
              <strong>หลักสูตรที่เปิดรับ:</strong> {selectedScholarship.programType}
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
              // onClick={() => navigateToForm(selectedScholarship)}
            >
              พิจารณาผลการสมัครเข้าร่วมโครงการนี้
            </button>
          </div>
        )}
      </Modal>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
