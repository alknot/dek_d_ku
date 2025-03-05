'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { SchType } from '@prisma/client';
import { programType } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/compat/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import router from "next/dist/shared/lib/router/router";

const Create = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const handleRewardChange = (reward: string) => {
  //     setrewards(prevRewards =>
  //         prevRewards.includes(reward)
  //         ? prevRewards.filter(r => r !== reward)
  //         : [...prevRewards, reward]
  //     );
  // };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">ตัวอย่างคำถาม</h2>

          <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาไทย)
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อผู้สมัคร (ภาษาไทย)"
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
                  />
                </div>

                <div className="flex space-x-10 sm:col-span-2">
                  <div className="relative max-w-sm">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      เกิดวันที่
                    </label>
                    <DatePicker
                      // selected={startDate}
                      // onChange={(date) => setstartDate(date)}
                      placeholderText="เกิดวันที่"
                      dateFormat="dd/MM/yyyy"
                      className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="relative max-w-sm">
                    <label
                      htmlFor="schName"
                      className="mb-2 block text-sm font-medium text-gray-900">
                      อายุ
                    </label>
                    <input
                      type="text"
                      id="schName"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="อายุ (ปี)"
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
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    คะแนนเฉลี่ยสะสม
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="คะแนนเฉลี่ยสะสม"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label
                    htmlFor="programType"
                    className="mb-2 block text-sm font-medium text-gray-900">
                    ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจะจบ
                  </label>
                  <select
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    id="programType"
                    // value={programType}
                    // onChange={(e) => setprogramType(e.target.value)}
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="">ใช่</option>
                    <option value="">ไม่ใช่</option>
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
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่ออาจารย์ที่ปรึกษา
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่ออาจารยืที่ปรึกษา"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ที่อยู่ปัจจุบัน
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ที่อยู่ปัจจุบัน"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  แนบผลงาน(ใบประกาศ) หรือเอกสารอ้างอิงที่บ่งบอกถึงการได้รับรางวัล
                </label>
                <input
                  type="file"
                  className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    วันที่ได้รับรางวัล
                  </label>
                  <DatePicker
                    // selected={startDate}
                    // onChange={(date) => setstartDate(date)}
                    placeholderText="วันที่ได้รับรางวัล"
                    dateFormat="dd/MM/yyyy"
                    className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อโครงการที่แข่งขัน/เข้าร่วม
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อโครงการที่แข่งขัน/เข้าร่วม"
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อทีม
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อทีม"
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผลงานที่ได้รับรางวัล
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อผลงานที่ได้รับรางวัล"
                />
              </div>
              <div className="sm:grid-cols-1">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  รางวัลที่ได้รับ
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="รางวัลที่ได้รับ"
                />
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="term" className="mb-2 block text-sm font-medium text-gray-900">
                    ระดับการประกวดการแข่งขัน/การเข้าร่วม
                  </label>
                  <select
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    id="term"
                    // value={term}
                    // onChange={(e) => setterm(e.target.value)}
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="">ระดับอุดมศึกษา</option>
                    <option value="เทอมต้น">ระดับชาติ</option>
                    <option value="เทอมปลาย">ระดับนานาติ</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="programType"
                    className="mb-2 block text-sm font-medium text-gray-900">
                    ประเภทกิจกรรม
                  </label>
                  <select
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    id="programType"
                    // value={programType}
                    // onChange={(e) => setprogramType(e.target.value)}
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="">ส่งเสริมคุณลักษณะบัณฑิตที่พึงประสงค์ที่กำหนดโดยสถาบัน</option>
                    <option value="">กีฬาหรือส่งเสริมสุขภาพ</option>
                    <option value="">บำเพ็ญประโยชน์หรือรักษาสิ่งแวดล้อม</option>
                    <option value="">เสริมสร้างคุณธรรมและจริยธรรม</option>
                    <option value="">ส่งเสริมศิลปและวัฒนธรรม</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              type="button"
              //   onClick={handleSubmit}
              className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white">
              ไปหน้าถัดไป
            </button>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Create;
