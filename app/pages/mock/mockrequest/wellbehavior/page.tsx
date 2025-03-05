'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { SchType } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/compat/router';
// Import useRouter from next/router
import { useParams, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import router from "next/dist/shared/lib/router/router";

const Create = () => {
  const [nisitNameTh, setNisitNameTH] = useState<string>('');
  const [nisitNameEn, setNisitNameENG] = useState<string>('');
  const [nisitid, setNisitID] = useState<string>('');
  const [nisitAcademicyear, setNisitAcademicyear] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [dateofBirth, setDateofBirth] = useState<Date | null>(null);
  const [faculty, setFaculty] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [advisor, setAdvisor] = useState<string>('');
  const [gpa, setGPA] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [behavior_Detail, setBehaviorDetail] = useState('');
  const [isLastTerm, setLastterm] = useState('');
  const [term, setTerm] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('');
  const [scholarshipId, setScholarshipId] = useState<string>('');
  const [schType, setSchType] = useState<SchType>(SchType.WELL_BEHAVIOR);

  const router = useRouter();

  const id = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const academicYearparam = searchParams.get('academiYear');
  // console.log("Acade",academicYearparam)
  const termnum = searchParams.get('term');
  const accept = '.pdf';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async () => {
    setScholarshipId(id.id);
    // console.log("Academic",academicYearparam)

    setAcademicYear(academicYearparam || '');

    if (termnum == '1') {
      setTerm('เทอมต้น');
    } else if (termnum == '2') {
      setTerm('เทอมปลาย');
    }
    try {
      const data = {
        nisitNameTh,
        nisitNameEn,
        nisitid,
        nisitAcademicyear,
        age,
        dateofBirth,
        faculty,
        department,
        advisor,
        gpa,
        phone,
        email,
        address,
        behavior_Detail,
        isLastTerm,
        scholarshipId: id,
        schType: schType,

        term: term,
        academicYear: academicYearparam,
        // Include the id in the data
      };

      console.log(data); // ตรวจสอบข้อมูลก่อนส่ง

      // ส่งข้อมูลไปยัง API
      await axios.post('/api/request', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            แบบฟอร์มเสนอรายชื่อนิสิตดีเด่นมหาสิทยาลัยเกษรศาสตร์
          </h2>

          <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาไทย)
                </label>
                <input
                  type="text"
                  id=""
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อผู้สมัคร (ภาษาไทย)"
                  value={nisitNameTh}
                  onChange={(e) => setNisitNameTH(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อผู้สมัคร (ภาษาอังกฤษ)"
                  value={nisitNameEn}
                  onChange={(e) => setNisitNameENG(e.target.value)}
                  required
                />
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    นิสิตชั้นปีที่
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="นิสิตชั้นปีที่"
                    value={nisitAcademicyear}
                    onChange={(e) => setNisitAcademicyear(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    รหัสนิสิต
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="รหัสนิสิต"
                    value={nisitid}
                    onChange={(e) => setNisitID(e.target.value)}
                    required
                  />
                </div>

                <div className="flex space-x-10 sm:col-span-2">
                  <div className="relative max-w-sm">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      เกิดวันที่
                    </label>
                    <DatePicker
                      selected={dateofBirth}
                      onChange={(date) => setDateofBirth(date)}
                      placeholderText="เกิดวันที่"
                      dateFormat="dd/MM/yyyy"
                      className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="relative max-w-sm">
                    <label htmlFor="" className="mb-2 block text-sm font-medium text-gray-900">
                      อายุ
                    </label>
                    <input
                      type="text"
                      id=""
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="อายุ(ปี)"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    คณะ
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="คณะ"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    ภาควิชา/สาขาวิชา
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="ภาควิชา/สาขาวิชา"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    คะแนนเฉลี่ยสะสม
                  </label>
                  <input
                    type=""
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="คะแนนเฉลี่ยสะสม"
                    value={gpa}
                    onChange={(e) => setGPA(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="" className="mb-2 block text-sm font-medium text-gray-900">
                    ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจะจบ
                  </label>
                  <select
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={isLastTerm}
                    onChange={(e) => setLastterm(e.target.value)}
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="true">ใช่</option>
                    <option value="false">ไม่ใช่</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    โทรศัพท์
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="โทรศัพท์"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    E-mail
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่ออาจารย์ที่ปรึกษา
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่ออาจารยืที่ปรึกษา"
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ที่อยู่ปัจจุบัน
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ที่อยู่ปัจจุบัน"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  บรรยายความประพฤติดี
                </label>
                <textarea
                  rows={6}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="บรรยายความประพฤติดี"
                  value={behavior_Detail}
                  onChange={(e) => setBehaviorDetail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-center text-center sm:col-span-2">
              <h2 className="mb-4 text-xl font-bold text-gray-900">คำถามเพิ่มเติม</h2>
            </div>

            <div className="flex items-center justify-center text-center sm:col-span-2">
              <h2 className="mb-4 text-xl font-bold text-gray-900">ส่วนการเงิน</h2>
            </div>

            <p className="mb-2 text-gray-900">ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจะจบ</p>

            <p className="mb-2 font-bold text-gray-900">จำนวนเงินเต็มที่ควรเก็บได้</p>
            <div className="flex space-x-10 sm:col-span-2">
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงมหาลัย
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงคณะ
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าหน่วยกิต
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  รวม
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>
            <p className="mb-2 font-bold text-gray-900">จำนวนเงินที่ควรเก็บได้จริง</p>
            <div className="flex space-x-10 sm:col-span-2">
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงมหาลัย
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าบำรุงคณะ
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ค่าหน่วยกิต
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  รวม
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {/* ปุ่มย้อนกลับ (ซ้ายสุด) */}
              <button type="button" className="w-1/6 rounded-lg bg-gray-500 px-4 py-2 text-white">
                ย้อนกลับ
              </button>

              {/* ปุ่มตัดสิน (ขวาสุด) */}
              <div className="flex space-x-3">
                <button type="button" className="rounded-lg bg-blue-500 px-4 py-2 text-white">
                  comment
                </button>

                <button type="button" className="rounded-lg bg-red-500 px-4 py-2 text-white">
                  ไม่ผ่านการตัดสิน
                </button>

                <button type="button" className="rounded-lg bg-green-500 px-4 py-2 text-white">
                  ผ่านการตัดสิน
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Create;
