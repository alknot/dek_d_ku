"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  interface Scholarship {
    id: number;
    academiYear: string;
    term: string;
    programType: string;
    schName: string;
    description: string;
    startDate: string;
    endDate: string;
  }

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [academiYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");
  const [programType, setProgramType] = useState("");
  const [schType, setSchType] = useState("");

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <header
        className="shadow-md flex items-center justify-between"
        style={{ backgroundColor: "rgb(0, 104, 95)" }}
      >
        <div className="px-4 py-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white text-center flex-1">
          Dek-D KU
        </h1>
        {/* <div className="w-10"></div> ใช้เพื่อเว้นช่องให้ Header ตรงกลาง */}
      </header>

      {/* Main Section (Full Screen) */}
      <main className=" flex-1 flex  justify-center bg-gray-100 w-full mx-auto">
        <div className="p-6 space-y-6 bg-gray-50">
          {/* หัวข้อ */}
          <h1 className="text-2xl font-bold text-center text-gray-800">
            โครงการที่เปิดรับสมัคร
          </h1>

          {/* ช่องค้นหา */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Dropdown 1 */}
              <div>
                <input
                  type="text"
                  id="academicYear"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ปีการศึกษา"
                  value={academiYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                />
              </div>
              {/* Dropdown 2 */}
              <select
                className="border-gray-300 rounded-lg p-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                <option value="">เทอม</option>
                <option value="เทอมต้น">เทอมต้น</option>
                <option value="เทอมปลาย">เทอมปลาย</option>
              </select>
              {/* Dropdown 3 */}

              {/* Dropdown 4 */}

              {/* Dropdown 5 */}
              <select
                className="border-gray-300 rounded-lg p-2"
                value={programType}
                onChange={(e) => setProgramType(e.target.value)}
              >
                <option value="">หลักสูตรที่เปิดรับ</option>
                <option value="THAI">หลักสูตรนานาชาติ</option>
                <option value="INTERNATIONAL">หลักสูตรไทย</option>
              </select>
              {/* Dropdown 6 */}
              <select
                className="border-gray-300 rounded-lg p-2"
                value={schType}
                onChange={(e) => setSchType(e.target.value)}
              >
                <option value="">ประเภทโครงการ</option>
                <option value="WELL_BEHAVIOR">ประพฤติดี</option>
                <option value="EXTRACURRICULAR">กิจกรรมเสริมหลักสูตร</option>
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

          {/* ตาราง */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">ที่</th>
                  <th className="px-4 py-2 text-left">ปีการศึกษา</th>
                  <th className="px-4 py-2 text-left">เทอม</th>
                  <th className="px-4 py-2 text-left">หลักสูตรที่เปิดรับ</th>
                  <th className="px-4 py-2 text-left">โครงการ</th>
                  <th className="px-9 py-2 text-left">รายละเอียดโครงการ</th>
                  <th className="px-9 py-2 text-left">วันที่เริ่มโครงการ</th>
                  <th className="px-9 py-2 text-left">วันที่จบโครงการ</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((scholarship, index) => (
                  <tr key={scholarship.id}>
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{scholarship.academiYear}</td>
                    <td className="px-4 py-2 border">{scholarship.term}</td>
                    <td className="px-4 py-2 border">{scholarship.programType}</td>
                    <td className="px-4 py-2 border">{scholarship.schName}</td>
                    <td className="px-4 py-2 border">{scholarship.description}</td>
                    <td className="px-4 py-2 border">{scholarship.startDate}</td>
                    <td className="px-4 py-2 border">{scholarship.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย </p>
        </div>
      </footer>
    </div>
  );
}