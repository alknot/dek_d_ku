import { apiService } from '@/common/apiService';
import axios from 'axios';
import React, { useState } from 'react';

interface TermPrice {
  academicYear: number;
  term: string;
  programType: string;
  study: string;

  faculty: string;
  department: string;

  price1: number;
  price2: number;
  price3: number;

  sumPrice: number;
}

const SearchCSV = () => {
  const [academicYear, setAcademicYear] = useState<number | string>('');
  const [term, setTerm] = useState<string>('');
  const [data, setData] = useState<TermPrice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // ตรวจสอบให้แน่ใจว่า academicYear และ term มีค่า
    if (academicYear && term) {
      try {
        const response = await apiService.fetchData(academicYear.toString(), term);
        setData(response as TermPrice[]);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        setData([]);
      }
    }
  };
  const handleDelete = async () => {
    // เพิ่มการยืนยันก่อนลบข้อมูล
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูล?')) {
      return; // หากผู้ใช้กด Cancel ให้หยุดการทำงาน
    }
    console.log('academicYear:', academicYear);
    console.log('term:', term);
    if (academicYear && term) {
      try {
        await axios.delete('/termprice', {
          params: { academicYear, term },
        });
        alert('Data deleted successfully');
        // ล้างข้อมูลที่แสดงออกมา
        setData([]);
      } catch (err) {
        console.error('Failed to delete data:', err);
        alert('Error deleting data. Please try again.');
      }
    } else {
      alert('Please specify academic year and term.');
    }
  };
  return (
    <div className="justify-top flex min-h-screen flex-col items-center bg-gray-100">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 justify-center text-center text-xl font-bold">แสดงข้อมูลจากไฟล์ CSV</h2>

        <div className="mb-4 flex space-x-10 sm:col-span-2">
          <div className="relative max-w-sm">
            <label className="mb-2 block text-sm font-medium text-gray-900">ปีการศึกษา</label>
            <input
              className="bg-white-50 block rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
              type="number"
              value={academicYear}
              onChange={(e) => setAcademicYear(Number(e.target.value))}
              placeholder="2568"
            />
          </div>
          <div className="relative max-w-sm">
            {/* Label */}
            <label htmlFor="term" className="block text-sm font-medium text-gray-900">
              ภาคการศึกษา
            </label>
            {/* กลุ่ม select และปุ่มค้นหาอยู่ในแถวเดียวกัน */}
            <div className="flex items-end space-x-4">
              <select
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="bg-white-50 mt-1 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                <option value="">เลือกภาคการศึกษา</option>
                <option value="เทอมต้น">เทอมต้น</option>
                <option value="เทอมปลาย">เทอมปลาย</option>
              </select>
              <button onClick={fetchData} className="mt-1 rounded bg-blue-500 p-2 text-white">
                ค้นหา
              </button>
              <button onClick={handleDelete} className="mt-1 rounded bg-red-500 p-2 text-white">
                ลบข้อมูล
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
              <th className="border-b px-4 py-2">หลักสูตร</th>
              <th className="border-b px-4 py-2">รูปแบบภาคการเรียน</th>
              <th className="border-b px-4 py-2">คณะ</th>
              <th className="border-b px-4 py-2">ภาควิชา</th>
              <th className="border-b px-4 py-2">ค่าธรรมเนียมคณะ</th>
              <th className="border-b px-4 py-2">ค่าบำรุงมหาวิทยาลัย</th>
              <th className="border-b px-4 py-2">ค่าหน่วยกิต</th>
              <th className="border-b px-4 py-2">รวม</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {/* <td className="py-2 px-4 border-b">{item.academicYear}</td>
                <td className="py-2 px-4 border-b">{item.term}</td> */}
                <td className="border-b px-4 py-2">{item.programType}</td>
                <td className="border-b px-4 py-2">{item.study}</td>
                <td className="border-b px-4 py-2">{item.faculty}</td>
                <td className="border-b px-4 py-2">{item.department}</td>
                <td className="border-b px-4 py-2">{item.price1}</td>
                <td className="border-b px-4 py-2">{item.price2}</td>
                <td className="border-b px-4 py-2">{item.price3}</td>
                <td className="border-b px-4 py-2">{item.sumPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchCSV;
