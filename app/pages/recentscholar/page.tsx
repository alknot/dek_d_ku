
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        <div className="w-10"></div> {/* ใช้เพื่อเว้นช่องให้ Header ตรงกลาง */}
      </header>

      {/* Main Section (Full Screen) */}
      <main className="flex-1 flex  justify-center bg-gray-100">
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
            <input type="text" id="academicYear" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ปีการศึกษา"  />
          </div>
          {/* Dropdown 2 */}
          <select className="border-gray-300 rounded-lg p-2">
            <option>เทอม</option>
            <option>ต้น</option>
            <option>ปลาย</option>
          </select>
          {/* Dropdown 3 */}
          <select className="border-gray-300 rounded-lg p-2">
            <option>เลือกคณะ</option>
            <option>วิศวกรรมศาสตร์</option>
            <option>วิทยาศาสตร์</option>
          </select>
          {/* Dropdown 4 */}
          <select className="border-gray-300 rounded-lg p-2">
            <option>ภาควิชา</option>
            <option>ปริญญาตรี</option>
            <option>ปริญญาโท</option>
          </select>
          {/* Dropdown 5 */}
          <select className="border-gray-300 rounded-lg p-2">
            <option>หลักสูตรที่เปิดรับ</option>
            <option>นานาชาติ</option>
            <option>ภาคปกติ</option>
          </select>
          {/* Dropdown 6 */}
          <select className="border-gray-300 rounded-lg p-2">
            <option>ทุนการศึกษา</option>
            <option>มีทุน</option>
            <option>ไม่มีทุน</option>
          </select>
        </div>
        {/* ปุ่มค้นหา */}
        <div className="text-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500">
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
              <th className="px-4 py-2 text-left">โครงการ</th>
              <th className="px-4 py-2 text-left">รับสมัคร</th>
            </tr>
          </thead>
          <tbody>
            {/* โครงการ 1 */}
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">
                <div className="font-bold text-gray-800">
                  โครงการ Phuket International Admission
                </div>
                <div className="text-sm text-gray-600">
                  Phuket International Admission (For foreign applicants with a
                  passport)
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    ภูเก็ต
                  </span>
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded">
                    รายละเอียดโครงการ
                  </button>
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                <div>1 ต.ค. 67 - 4 ก.ค. 68</div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  เหลือ 177 วัน
                </span>
              </td>
            </tr>
            {/* โครงการ 2 */}
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">2</td>
              <td className="px-4 py-2">
                <div className="font-bold text-gray-800">
                  โครงการรับนักศึกษาหลักสูตรเทคโนโลยีบัณฑิต
                </div>
                <div className="text-sm text-gray-600">
                  สาขาวิชาเทคโนโลยีสารสนเทศ คณะวิทยาศาสตร์
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    หาดใหญ่
                  </span>
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded">
                    รายละเอียดโครงการ
                  </button>
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                <div>19 ธ.ค. 67 - 28 ก.พ. 68</div>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  เหลือ 71 วัน
                </span>
              </td>
            </tr>
            {/* โครงการ 3 */}
            <tr>
              <td className="px-4 py-2">3</td>
              <td className="px-4 py-2">
                <div className="font-bold text-gray-800">
                  โครงการดาวรุ่งคอมพิวเตอร์ ปีการศึกษา 2568
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    หาดใหญ่
                  </span>
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded">
                    รายละเอียดโครงการ
                  </button>
                </div>
              </td>
              <td className="px-4 py-2 text-center">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                  หมดเขต
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย และผองเพื่อน.</p>
        </div>
      </footer>
    </div>
  );
}
