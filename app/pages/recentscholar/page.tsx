"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar";
import Modal from "@/components/Modal";
import { format, differenceInDays } from "date-fns";
import { th } from "date-fns/locale";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

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
  const [academiYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");
  const [programType, setProgramType] = useState("");
  const [schType, setSchType] = useState("");

  // สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // แสดง 10 แถวต่อหน้า

  // หา totalPages = เพดาน(จำนวนรายการ / 10)
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
      const response = await axios.get("/api/scholarship", {
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
      console.error("Failed to fetch scholarships:", error);
    }
  };

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    fetchScholarships();
  }, []);

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    fetchScholarships();
  };

  // ตัวอย่างฟังก์ชันสำหรับไปหน้าถัดไป
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ตัวอย่างฟังก์ชันสำหรับไปหน้าก่อนหน้า
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
    // Here you can either set state or use routing to navigate
    // For example, using React Router:
    if (!scholarship) {
      console.error("No scholarship selected");
      return;
    }
  
    setIsModalOpen(false); // Close the modal first
  
    // Navigate based on the scholarship type
    switch(scholarship.schType) {
      case "WELL_BEHAVIOR":
        if (scholarship.term === "เทอมต้น") {
          const term=1;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/wellbehavior/${scholarship.id}?academiYear=${encodeURIComponent(scholarship.academiYear)}&term=${encodeURIComponent(term)}`;
        router.push(url);
        }
        else if (scholarship.term === "เทอมปลาย") {
          const term=2;
          const url = `../../../../../../../../../../../../pages/recentscholar/applyform/wellbehavior/${scholarship.id}?term=${encodeURIComponent(term)}&academicYear=${encodeURIComponent(scholarship.academiYear)}`;
        router.push(url);
        }
        
        break;
      case "EXTRACURRICULAR":
        
      if (scholarship.term === "เทอมต้น") {
        const term=1;
        const url = `../../../../../../../../../../../../pages/recentscholar/applyform/extracurricular/${scholarship.id}?academiYear=${encodeURIComponent(scholarship.academiYear)}&term=${encodeURIComponent(term)}`;
      router.push(url);
      }
      else if (scholarship.term === "เทอมปลาย") {
        const term=2;
        const url = `../../../../../../../../../../../../pages/recentscholar/applyform/extracurricular/${scholarship.id}?term=${encodeURIComponent(term)}&academicYear=${encodeURIComponent(scholarship.academiYear)}`;
      router.push(url);
      }
        
        break;
      case "INNOVATION":

      if (scholarship.term === "เทอมต้น") {
        const term=1;
        const url = `../../../../../../../../../../../../pages/recentscholar/applyform/innovation/${scholarship.id}?academiYear=${encodeURIComponent(scholarship.academiYear)}&term=${encodeURIComponent(term)}`;
      router.push(url);
      }
      else if (scholarship.term === "เทอมปลาย") {
        const term=2;
        const url = `../../../../../../../../../../../../pages/recentscholar/applyform/innovation/${scholarship.id}?term=${encodeURIComponent(term)}&academicYear=${encodeURIComponent(scholarship.academiYear)}`;
      router.push(url);
      }
        
        break;
      default:
        console.error("Unsupported scholarship type:", scholarship.schType);
    }
  }


  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main */}
      <main className=" flex-1 flex  justify-center bg-gray-100 w-full mx-auto">
        <div className="p-6 space-y-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            โครงการที่เปิดรับสมัคร
          </h1>

          {/* Search */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Field 1: ปีการศึกษา */}
              <div>
                <input
                  type="text"
                  placeholder="ปีการศึกษา"
                  value={academiYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              {/* Field 2: เทอม */}
              <select
                className="border-gray-300 rounded-lg p-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option value="">เทอม</option>
                <option value="เทอมต้น">เทอมต้น</option>
                <option value="เทอมปลาย">เทอมปลาย</option>
              </select>

              {/* Field 3: หลักสูตร */}
              <select
                className="border-gray-300 rounded-lg p-2"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
              >
                <option value="">หลักสูตรที่เปิดรับ</option>
                <option value="THAI">หลักสูตรไทย</option>
                <option value="INTERNATIONAL">หลักสูตรนานาชาติ</option>
              </select>

              {/* Field 4: ประเภทโครงการ */}
              <select
                className="border-gray-300 rounded-lg p-2"
                value={schType}
                onChange={(e) => setSchType(e.target.value)}
              >
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
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500"
              >
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
                  <th className="px-2 py-2 w-28 text-left text-center">ปีการศึกษา</th>
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
                  let buttonColor = "bg-green-600";
                  if (daysLeft <= 14 && daysLeft > 7) {
                    buttonColor = "bg-yellow-600";
                  } else if (daysLeft <= 7) {
                    buttonColor = "bg-red-600";
                  }

                  return (
                    <tr key={scholarship.id}>
                      <td className="px-4 py-2 border text-center px-4 w-12">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border text-center w-28">
                        {scholarship.academiYear}
                      </td>
                      <td className="px-4 py-2 border text-center w-28">
                        {scholarship.term}
                      </td>
                      <td className="px-4 py-2 border text-center w-28">
                        {scholarship.programType}
                      </td>
                      <td className="px-4 py-2 border ">
                        {scholarship.schName}
                      </td>
                      <td className="px-4 py-2 border text-center  w-80">
                        {format(new Date(scholarship.startDate), "dd MMMM yyyy", { locale: th })} -{" "}
                        {format(new Date(scholarship.endDate), "dd MMMM yyyy", { locale: th })}
                        <br />
                        {daysLeft >= 0 ? (
                          <button className={`px-2 py-1 rounded-lg ${buttonColor}`}>
                            คงเหลือ {daysLeft} วัน
                          </button>
                        ) : (
                          <span className="text-red-600">หมดเขต</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border text-center w-40">
                        {daysLeft >= 0 && (
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
                            onClick={() => handleOpenModal(scholarship)}
                          >
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

          {/* แถบ Pagination */}
          {scholarships.length > pageSize && (
            <div className="flex items-center justify-center space-x-4 mt-4">
              <button
                onClick={() => prevPage()}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:bg-gray-200"
              >
                ก่อนหน้า
              </button>
              <span>
                หน้าที่ {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => nextPage()}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:bg-gray-200"
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
  {selectedScholarship && (
    <div>
      <h2 className="text-xl font-bold mb-4">{selectedScholarship.schName}</h2>
      <div className="flex items-center space-x-2">
              <p><strong>เอกสารประจำโครงการ:</strong></p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
                onClick={() => window.open(selectedScholarship.pdfUrl, '_blank')}
              >
                แสดงเอกสาร
              </button>
            </div>
      <p><strong>ปีการศึกษา:</strong> {selectedScholarship.academiYear}</p>
      <p><strong>เทอม:</strong> {selectedScholarship.term}</p>
      <p><strong>หลักสูตรที่เปิดรับ:</strong> {selectedScholarship.programType}</p>
      <p><strong>รายละเอียดโครงการ:</strong> {selectedScholarship.description}</p>
      <p><strong>กำหนดการ:</strong> {format(new Date(selectedScholarship.startDate), "dd MMMM yyyy", { locale: th })} - {format(new Date(selectedScholarship.endDate), "dd MMMM yyyy", { locale: th })}</p>
      
      <button
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => navigateToForm(selectedScholarship)}
      >
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
