import React, { useState } from "react";
import { apiService } from "@/common/apiService";

interface TermPrice {
  academicYear: number;
  term: string;
  department: string;
  faculty: string;
  price1: number;
  price2: number;
  price3: number;
  programType: string;
  study: string;
  sumPrice: number;
}

const SearchCSV = () => {
  const [academicYear, setAcademicYear] = useState<number | string>("");
  const [term, setTerm] = useState<string>("");
  const [data, setData] = useState<TermPrice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // ตรวจสอบให้แน่ใจว่า academicYear และ term มีค่า
    if (academicYear && term) {
      try {
        const response = await apiService.fetchData(academicYear.toString(), term);
        setData(response);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-top bg-gray-100">
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold justify-center text-center mb-4">
          แสดงข้อมูลจากไฟล์ CSV
        </h2>

        <div className="flex space-x-10 sm:col-span-2 mb-4">
          <div className="relative max-w-sm">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              ปีการศึกษา
            </label>
            <input
              className="bg-white-50 border border-gray-300 text-gray-900 
              text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="number"
              value={academicYear}
              onChange={(e) => setAcademicYear(Number(e.target.value))}
              placeholder="2568"
            />
          </div>
          <div className="relative max-w-sm">
            {/* Label */}
            <label
              htmlFor="term"
              className="block text-sm font-medium text-gray-900"
            >
              ภาคการศึกษา
            </label>
            {/* กลุ่ม select และปุ่มค้นหาอยู่ในแถวเดียวกัน */}
            <div className="flex items-end space-x-4">
              <select
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1 bg-white-50 border border-gray-300 text-gray-900 
                text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="">เลือกภาคการศึกษา</option>
                <option value="เทอมต้น">เทอมต้น</option>
                <option value="เทอมปลาย">เทอมปลาย</option>
              </select>
              <button
                onClick={fetchData}
                className="mt-1 bg-blue-500 text-white p-2 rounded"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {/* <th className="py-2 px-4 border-b">ปีการศึกษา</th>
              <th className="py-2 px-4 border-b">ภาคการศึกษา</th> */}
              <th className="py-2 px-4 border-b">คณะ</th>
              <th className="py-2 px-4 border-b">ภาควิชา</th>
              <th className="py-2 px-4 border-b">ค่าธรรมเนียมคณะ</th>
              <th className="py-2 px-4 border-b">ค่าบำรุงมหาวิทยาลัย</th>
              <th className="py-2 px-4 border-b">ค่าหน่วยกิต</th>
              <th className="py-2 px-4 border-b">โปรแกรมการเรียน</th>
              <th className="py-2 px-4 border-b">รูปแบบภาคการเรียน</th>
              <th className="py-2 px-4 border-b">รวม</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {/* <td className="py-2 px-4 border-b">{item.academicYear}</td>
                <td className="py-2 px-4 border-b">{item.term}</td> */}
                <td className="py-2 px-4 border-b">{item.faculty}</td>
                <td className="py-2 px-4 border-b">{item.department}</td>
                <td className="py-2 px-4 border-b">{item.price1}</td>
                <td className="py-2 px-4 border-b">{item.price2}</td>
                <td className="py-2 px-4 border-b">{item.price3}</td>
                <td className="py-2 px-4 border-b">{item.programType}</td>
                <td className="py-2 px-4 border-b">{item.study}</td>
                <td className="py-2 px-4 border-b">{item.sumPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchCSV;