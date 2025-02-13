"use client";
import axios from "axios";
import DatePicker from "react-datepicker";
import React, { ChangeEvent, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from 'next/navigation'

import Sidebar from "@/components/sidebar";
import { SchType } from "@prisma/client";
import { programType } from "@prisma/client";
// import router from "next/dist/shared/lib/router/router";


const Create = () => {
  const [schName, setschName] = useState("")
  const [description, setdescription] = useState<string>("")
  const [academiYear, setacademicYear] = useState<string>("")
  const [term, setterm] = useState<string>("")
  const [startDate, setstartDate] = useState<Date | null>(null)
  const [endDate, setendDate] = useState<Date | null>(null)
  const [schType, setSchType] = useState<SchType>(SchType.EXTRACURRICULAR);
  const [attachment, setattachment] = useState<File>()

  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfMimeType, setPdfMimeType] = useState<string | null>(null);

  const [programType, setprogramType] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  // const [rewards, setrewards] = useState<string[]>(['อื่นๆ', 'ลดค่าบำรุงมหาวิทยาลัย', 'ลดค่าหน่วยกิต', 'ลดค่าธรรมเนียมพิเศษคณะ'])
  // const [otherReward, setotherReward] = useState<string>("")
  const router = useRouter();
  const accept = ".pdf";
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPdf(event.target.files[0]);
      setPdfMimeType(event.target.files[0].type);
      console.log(event.target.files[0].type);
    }
  };

  const handleUploadPdf = async () => {
    if (!pdf) return;

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64File = await toBase64(pdf);

    const formData = new FormData();
    formData.append('pdf', base64File);
    formData.append('mimeType', pdfMimeType || '');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setPdfUrl((await response.json()).url);
      } else {
        setPdfUrl(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setPdfUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        schName,
        description,
        academiYear,
        term,
        startDate,
        endDate,
        schType,
        programType
      };

      console.log(data); // ตรวจสอบข้อมูลก่อนส่ง

      // ส่งข้อมูลไปยัง API
      handleUploadPdf();
      await axios.post('/api/scholarship', data);
      router.push('pages/newscholar/extracurricular/example');

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="flex-1 flex justify-center bg-gray-100 w-full mx-auto">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">สร้างโครงการนอกหลักสูตร</h2>
          <h1 className="mb-4 font-bold text-gray-900 text-center">กรอกข้อมูลของโครงการ</h1>
          <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อโครงการ</label>
                <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อโครงการ"
                  value={schName} onChange={(e) => setschName(e.target.value)} required />

              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900">ประกาศโครงการ (PDF)</label>
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                  required
                />
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    className="mt-4 text-green-500"
                    target="_blank"
                    rel="noopener noreferrer">
                    {pdfUrl}
                  </a>
                )}
              </div>
              {/* <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">รางวัลในแต่ละโครงการ</label>
            <div className="flex flex-col space-y-2">
              {["ลดค่าบำรุงมหาวิทยาลัย", "ลดค่าหน่วยกิต", "ลดค่าธรรมเนียมพิเศษคณะ", "อื่นๆ"].map((reward) => (
                <label key={reward} className="flex items-center">
                  <input
                    type="checkbox"
                    name="reward"
                    value={reward}
                    checked={rewards.includes(reward)}
                    onChange={() => handleRewardChange(reward)}
                    className="mr-2"
                  />
                  {reward}
                </label>
              ))}
              {rewards.includes("อื่นๆ") && (
                <input
                  
                  type="text"
                  value={otherReward}
                  onChange={(e) => setotherReward(e.target.value)}
                  placeholder="กรอกรางวัลอื่นๆ"
                />
              )}
            </div>
          </div> */}

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="block mb-2 text-sm font-medium text-gray-900">วันที่เริ่มโครงการ</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setstartDate(date)}
                    placeholderText="Start date"
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label className="block mb-2 text-sm font-medium text-gray-900">วันที่จบโครงการ</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setendDate(date)}
                    placeholderText="End date"
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                  />
                </div>
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label className="block mb-2 text-sm font-medium text-gray-900">ปีการศึกษา</label>
                  <input className="bg-white-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="number"
                    value={academiYear}
                    onChange={(e) => setacademicYear((e.target.value))}
                    placeholder="2568"
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="term" className="block mb-2 text-sm font-medium text-gray-900">ภาคการศึกษา</label>
                  <select className="bg-white-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="term"
                    value={term}
                    onChange={(e) => setterm(e.target.value)}
                    required
                  >
                    <option value="">กรุณาเลือก</option>
                    <option value="เทอมต้น">เทอมต้น</option>
                    <option value="เทอมปลาย">เทอมปลาย</option>
                  </select>
                </div>
                <div >
                  <label htmlFor="programType" className="block mb-2 text-sm font-medium text-gray-900">สำหรับหลักสูตร</label>
                  <select className="bg-white-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="programType"
                    value={programType}
                    onChange={(e) => setprogramType(e.target.value)}
                    required
                  >
                    <option value="">กรุณาเลือก</option>
                    <option value="THAI">ภาคไทย</option>
                    <option value="INTERNATIONAL">ภาคนานาชาติ</option>
                    <option value="BOTHTHAIANDINTERNATIONAL">ทั้งภาคไทยและนานาชาติ</option>
                  </select>
                </div>

              </div>




              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900">รายละเอียดโครงการ</label>
                <textarea
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                  placeholder="รายละเอียดโครงการ"
                  rows={6}
                  required
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              ยืนยันและไปหน้าถัดไป
            </button>
          </form>

        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Create;


