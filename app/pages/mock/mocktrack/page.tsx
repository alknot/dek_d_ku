"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar";
import Modal from "@/components/Modal";
import { format, differenceInDays } from "date-fns";
import { th } from "date-fns/locale";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from 'next/navigation'
import styles from "./nuebotton.module.css";

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
  const [academiYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");
  const [programType, setProgramType] = useState("");
  const [schType, setSchType] = useState("");
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
      const response = await axios.get("/api/scholarship", {
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
      console.error("Failed to fetch scholarships:", error);
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
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className=" flex-1 flex  justify-center bg-gray-100 w-full mx-auto">
        <div className="p-6 space-y-6 bg-gray-50">
          {/* หัวข้อ */}
          <h1 className="text-2xl font-bold text-center text-gray-800">
            ดูผลการพิจารณาของผู้สมัครเข้าร่วมโครงการ
          </h1>
          

          {/* ช่องค้นหา */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
          <h3 className="text-2xl font-bold text-center text-gray-800">
            โครงการ [$schName]
          </h3>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            ปีการศึกษา [$academiYear] ภาคการศึกษา [$term]
          </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Dropdown 1 */}
              <div>
                <input
                  type="text"
                  
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="รหัสนิสิต"
                  value={academiYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 w-1/4"
              >
                ค้นหา
              </button>
              {/* Dropdown 2 */}
              {/* <select
                className="border-gray-300 rounded-lg p-2"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
              >
                <option value="">ประเภทย่อย</option>
                <option value="THAI">เข้าร่วมการแข่งขันทางวิชาการหรือศิลปกรรม</option>
                <option value="INTERNATIONAL">การดำรงตำแหน่ง</option>
                <option value="INTERNATIONAL">นิสิตที่ดำเนินกิจกรรมสร้างเกียรติคุณต่อคณะหรือมหาลัย</option>
              </select> */}
              {/* Dropdown 3 */}
              {/* <select
                className="border-gray-300 rounded-lg p-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option value="">ระดับการแข่งขัน</option>
                <option value="เทอมต้น">ระดับอุดมศึกษา</option>
                <option value="เทอมปลาย">ระดับชาติ</option>
                <option value="เทอมปลาย">ระดับนานาชาติ</option>
              </select> */}
              {/* Dropdown 4 */}
              {/* <select
                className="border-gray-300 rounded-lg p-2"
                value={schType}
                onChange={(e) => setSchType(e.target.value)}
              >
                <option value="">สถานะการตัดสิน</option>
                <option value="WELL_BEHAVIOR">รอการพิจารณา</option>
                <option value="EXTRACURRICULAR">ผ่านการพิจารณา</option>
                <option value="ACADEMIC">ไม่ผ่านการพิจารณา</option>
              </select> */}
              {/* Dropdown 5 */}
              
              {/* Dropdown 6 */}
              
            </div>
            {/* ปุ่มค้นหา */}
            {/* <div className="text-center">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500"
              >
                ค้นหา
              </button>
            </div> */}
          </div>

          {/* ตาราง */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-center">ที่</th>
                  <th className="px-2 py-2 w-36 text-left text-center">รหัสนิสิต</th>
                  <th className="px-4 py-2 text-left text-center">ชื่อ - สกุล</th>
                  <th className="px-4 py-2 text-left text-center">คณะ</th>
                  <th className="px-4 py-2 text-left text-center">ดูใบสมัคร</th>
                  <th className="px-9 py-2 text-left text-center">รองคณบดี</th>
                  <th className="px-9 py-2 text-left text-center">คณบดี</th>
                  <th className="px-9 py-2 text-left text-center">กองพัฒนานิสิต</th>
                  <th className="px-9 py-2 text-left text-center">คณะกรรมการ</th>
                  <th className="px-9 py-2 text-left text-center">ประธานกรรมการ</th>
                  <th className="px-9 py-2 text-left text-center">comment</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((scholarship, index) => {
                  const daysLeft = differenceInDays(new Date(scholarship.endDate), new Date());
                  let buttonColor = "bg-green-600";
                  if (daysLeft <= 14 && daysLeft > 7) {
                    buttonColor = "bg-yellow-600";
                  } else if (daysLeft <= 7) {
                    buttonColor = "bg-red-600";
                  }

                  return (
                    <tr key={scholarship.id}>
                      <td className="px-4 py-2 border w-12">{index + 1}</td>
                      <td className="px-2 py-2 border w-28 text-center">6410401027</td>
                      <td className="px-4 py-2 border w-96 text-center"></td>
                      <td className="px-4 py-2 border w-60"></td>
                      <td className="px-4 py-2 border"></td>
                      <td className="px-4 py-2 border text-center w-60"><button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400">ผ่าน</button></td>
                      <td className="px-4 py-2 border text-center w-60"><button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400">ไม่ผ่าน</button></td>
                    <td className="px-4 py-2 border text-center w-60"><button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400">รอการพิจารณา</button></td>
                      <td className="px-4 py-2 border text-center w-60">
                        {/* <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
                          onClick={() => handleOpenModal(scholarship)}
                        >
                          
                        </button> */}
                      </td>
                      <td className="px-2 py-2 border w-60 text-center"></td>
                      <td className="px-2 py-2 border w-60 text-center"><button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400">comment</button></td>
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
      <h2 className="text-xl font-bold mb-4">{selectedScholarship.schName}</h2>
      <p><strong>ปีการศึกษา:</strong> {selectedScholarship.academiYear}</p>
      <p><strong>เทอม:</strong> {selectedScholarship.term}</p>
      <p><strong>หลักสูตรที่เปิดรับ:</strong> {selectedScholarship.programType}</p>
      <p><strong>รายละเอียดโครงการ:</strong> {selectedScholarship.description}</p>
      <p><strong>กำหนดการ:</strong> {format(new Date(selectedScholarship.startDate), "dd MMMM yyyy", { locale: th })} - {format(new Date(selectedScholarship.endDate), "dd MMMM yyyy", { locale: th })}</p>
      <button
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
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