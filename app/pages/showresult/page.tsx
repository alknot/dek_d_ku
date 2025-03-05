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
      const response = await axios.get('/api/scholarship', {
        params: {
          academiYear: academiYear,
          term: term,
          programType: programType,
          schType: schType,
        },
      });
      const data = response.data as { scholarships: Scholarship[] };
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
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="space-y-6 bg-gray-50 p-6">
          {/* หัวข้อ */}
          <h1 className="text-center text-2xl font-bold text-gray-800">ดูผลการพิจารณา</h1>

          {/* ช่องค้นหา */}
          <div className="space-y-4 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {/* Dropdown 1 */}
              <div>
                <input
                  type="text"
                  id="academicYear"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ปีการศึกษา"
                  value={academiYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </div>
              {/* Dropdown 2 */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}>
                <option value="">เทอม</option>
                <option value="เทอมต้น">เทอมต้น</option>
                <option value="เทอมปลาย">เทอมปลาย</option>
              </select>
              {/* Dropdown 3 */}

              {/* Dropdown 4 */}

              {/* Dropdown 5 */}
              <select
                className="rounded-lg border-gray-300 p-2"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}>
                <option value="">หลักสูตรที่เปิดรับ</option>
                <option value="THAI">หลักสูตรไทย</option>
                <option value="INTERNATIONAL">หลักสูตรนานาชาติ</option>
              </select>
              {/* Dropdown 6 */}
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

          {/* ตาราง */}
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
                  <th className="px-9 py-2 text-left text-center">ดูผลการพิจารณา</th>
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
                      <td className="w-28 border px-2 py-2 text-center">
                        {scholarship.academiYear}
                      </td>
                      <td className="w-28 border px-4 py-2 text-center">{scholarship.term}</td>
                      <td className="w-28 border px-4 py-2">{scholarship.programType}</td>
                      <td className="w-80 border px-4 py-2">{scholarship.schName}</td>
                      <td className="w-80 border px-4 py-2 text-center">
                        {format(new Date(scholarship.startDate), 'dd MMMM yyyy', { locale: th })} -{' '}
                        {format(new Date(scholarship.endDate), 'dd MMMM yyyy', { locale: th })}
                        <br />
                        {daysLeft > 0 ? (
                          <button className={`rounded-lg px-2 py-1 ${buttonColor}`}>
                            คงเหลือ {daysLeft} วัน
                          </button>
                        ) : (
                          <span className="text-red-600">หมดเขต</span>
                        )}
                      </td>
                      <td className="w-40 border px-4 py-2 text-center">
                        <button
                          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                          onClick={() => handleOpenModal(scholarship)}>
                          ดูผลการพิจารณา
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
              ดูผลการพิจารณา
            </button>
          </div>
        )}
      </Modal>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
