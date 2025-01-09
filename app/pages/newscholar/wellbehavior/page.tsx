"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State สำหรับเก็บข้อมูลฟอร์ม
  // const [formData, setFormData] = useState({
  //   NameTH: "",
  //   NameEN: "",
  //   email: "",

  // });

  // ฟังก์ชันเปิด/ปิด Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ฟังก์ชันอัปเดตค่าของฟอร์ม
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const { name, value } = e.target;
    // setFormData({
    //   ...formData,
    //   [name]: value,
    // });
  };

  // ฟังก์ชันส่งข้อมูลไปที่ API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/newformdata", {
        // method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        // body: JSON.stringify(formData),
      });

      //     if (response.ok) {
      //       alert("Data submitted successfully!");
      //       setFormData({
      //         NameTH: "",
      //         NameEN: "",
      //       //   aca
      //         email: "",

      //       nisitNameTh: body.nisitNameTh,
      //   nisitNameEn: body.nisitNameEn,
      //   nisitAcademicyear: body.nisitAcademicyear,
      //   nisitid: body.nisitid,
      //   faculty: body.faculty,
      //   department: body.department,
      //   advisor: body.advisor,
      //   gpa: body.gpa,
      //   dateofBirth: body.dateofBirth,
      //   age: body.age,
      //   phone: body.phone,
      //   email: body.email,
      //   address: body.address,

      //       });
      //     } else {
      //       const error = await response.json();
      //       alert(`Error: ${error.message}`);
      //     }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
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
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *"></meta>
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
        <div className="w-1"></div> {/* ใช้เพื่อเว้นช่องให้ Header ตรงกลาง */}

      </header>

      {/* Main Section */}
      <main className="flex-1 flex  justify-center bg-gray-100 w-full mx-auto">
        <div >
          <div className="grow w-1 h-8 "></div>
          <section className="bg-white dark:bg-gray-900  max-w-8xl mx-auto px-10 lg:px-8">
            <div className=" px-12 mx-auto max-w-5xl lg:py-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white text-center">
                สร้างโครงการประพฤติดี
              </h2>
              <h1 className="mb-4  font-bold text-gray-900 dark:text-white text-center">
                กรอกข้อมูลของโครงการ
              </h1>
              <form action="#">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อโครงการ</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="name" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="file_input"
                    >
                      ประกาศโครงการ
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      type="file"
                      id="csvFileSelector"
                    // accept={}
                    // onChange={}
                    />
                  </div>
                  <div className="relative max-w-sm">
                    <DatePicker
                      // selected={selectedDate}
                      // onChange={(date) => setSelectedDate(date)}
                      placeholderText="Start date"
                      dateFormat="dd/MM/yyyy"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 h-10 start-0 flex pl-3 items-center ps-3.5 pointer-events-none ">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>

                  </div>

                  <div className="relative max-w-sm">
                    <DatePicker
                      // selected={selectedDate}
                      // onChange={(date) => setSelectedDate(date)}
                      placeholderText="End date"
                      dateFormat="dd/MM/yyyy"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 h-10 start-0 flex pl-3 items-center ps-3.5 pointer-events-none ">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>

                  </div>

                  <div className="w-full">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ปีการศึกษา</label>
                    <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="2568" required />
                  </div>
                  <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ภาคการศึกษา</label>
                    <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected>เลือก</option>
                      <option value="1">ภาคต้น</option>
                      <option value="2">ภาคปลาย</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">หลักสูตร</label>
                    <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected>เลือก</option>
                      <option value="1">หลักสูตรไทย</option>
                      <option value="2">หลักสูตรนานาชาติ</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea id="description" rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
                  </div>
                </div>
                {/* </form> */}
                {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                <h1 className="mb-4  font-bold text-gray-900 dark:text-white text-center">
                  ส่วน ตัวอย่างคำถามเพื่อสมัครเข้าโครงการ
                </h1>
                {/* <form action="#"> */}
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อ-นามสกุล นิสิต (TH)</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="ชื่อ-นามสกุล" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อ-นามสกุล นิสิต (ENG)</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Name" />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">นิสิตชั้นปีที่</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รหัสนิสิต</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ภาควิชา/สาขาวิชา</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คณะ</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อ-นามสกุล อาจารย์ที่ปรึกษา</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Name" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ปีการศึกษา</label>
                    <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="2568" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ภาคการศึกษา</label>
                    <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected>เลือก</option>
                      <option value="1">ภาคต้น</option>
                      <option value="2">ภาคปลาย</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">หลักสูตร</label>
                    <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected>เลือก</option>
                      <option value="1">หลักสูตรไทย</option>
                      <option value="2">หลักสูตรนานาชาติ</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คะแนนเฉลี่ยสะสม</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ท่านเรียนภาคการศึกษานี้เป็นภาคสุดท้ายหรือไม่</div>
                    <fieldset>
                      <legend className="sr-only">ท่านเรียนภาคการศึกษานี้เป็นภาคสุดท้ายหรือไม่</legend>

                      <div className="flex items-center mb-4">
                        <input id="option-1" type="radio" name="countries" value="USA" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="country-option-1" className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                          ใช่
                        </label>
                      </div>

                      <div className="flex items-center mb-4">
                        <input id="option-2" type="radio" name="countries" value="Germany" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="country-option-2" className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          ไม่
                        </label>
                      </div>

                    </fieldset>
                  </div>

                  <div className="relative max-w-sm ">
                    <DatePicker
                      // selected={selectedDate}
                      // onChange={(date) => setSelectedDate(date)}
                      placeholderText="เกิดวันที่"
                      dateFormat="dd/MM/yyyy"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                      block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                      dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                    />
                    <div className="absolute inset-y-0 h-10 start-0 flex pl-3 items-center ps-3.5 pointer-events-none ">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>

                  </div>

                  

                  <div className="w-1/2">

                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="อายุ (ปี)" />
                  </div>

                  <div className="w-full">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">โทรศัพท์</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
                  </div>

                  <div className="w-full">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รายละเอียดด้านความประพฤติดี</label>
                    <textarea id="description" rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 
                    focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder=""></textarea>
                  </div>
                </div>
                <button type="submit" className="inline-flex justify-right items-right px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-black bg-green-100 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-100">
                  สร้าง
                </button>
              </form>
            </div>
          </section>
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
