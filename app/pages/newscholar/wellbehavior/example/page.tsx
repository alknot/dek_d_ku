"use client";
import axios from "axios";
import DatePicker from "react-datepicker";
import React, { ChangeEvent, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/compat/router";

import Sidebar from "@/components/sidebar";
import { SchType } from "@prisma/client";
import { programType } from "@prisma/client";
// import router from "next/dist/shared/lib/router/router";




const Create = () => {
  type Question = {
    id: number;
    question: string;
    type: string; // "text" | "choice" | "checkbox" | "date"
    options: string[];
    required: string;
    selectedDate?: Date;
  };
  type Props = {
    questions: Question[];
    addQuestion: () => void;
    deleteQuestion: (id: number) => void;
    updateQuestion: (id: number, field: string, value: any) => void;
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), question: "", type: "text", options: [], required: "false" },
    ]);
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/request/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Failed to submit the form.");
      }
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
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="flex-1 flex justify-center bg-gray-100 w-full mx-auto">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">ตัวอย่างคำถาม</h2>

          <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อผู้สมัคร (ภาษาไทย)</label>
                <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อผู้สมัคร (ภาษาไทย)"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อผู้สมัคร (ภาษาอังกฤษ)</label>
                <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อผู้สมัคร (ภาษาอังกฤษ)"
                />
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">นิสิตชั้นปีที่</label>
                  <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="นิสิตชั้นปีที่"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รหัสนิสิต</label>
                  <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="รหัสนิสิต"
                  />
                </div>

                <div className="flex space-x-10 sm:col-span-2">
                  <div className="relative max-w-sm">
                    <label className="block mb-2 text-sm font-medium text-gray-900">เกิดวันที่</label>
                    <DatePicker
                      // selected={startDate}
                      // onChange={(date) => setstartDate(date)}
                      placeholderText="เกิดวันที่"
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                    />
                  </div>
                  <div className="relative max-w-sm">
                    <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อายุ</label>
                    <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อายุ (ปี)"
                    />
                  </div>
                </div>


              </div>
              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คณะ</label>
                  <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="คณะ"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ภาควิชา/สาขาวิชา</label>
                  <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ภาควิชา/สาขาวิชา"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คะแนนเฉลี่ยสะสม</label>
                  <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="คะแนนเฉลี่ยสะสม"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="programType" className="block mb-2 text-sm font-medium text-gray-900">ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจะจบ</label>
                  <select className="bg-white-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="programType"
                    // value={programType}
                    // onChange={(e) => setprogramType(e.target.value)}
                    required
                  >
                    <option value="">กรุณาเลือก</option>
                    <option value="">ใช่</option>
                    <option value="">ไม่ใช่</option>

                  </select>
                </div>
              </div>


              <div className="flex space-x-10 sm:col-span-2">

                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">โทรศัพท์</label>
                  <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="โทรศัพท์"
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                  <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E-mail"
                  />
                </div>
              </div>


              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่ออาจารย์ที่ปรึกษา</label>
                <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่ออาจารยืที่ปรึกษา"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ที่อยู่ปัจจุบัน</label>
                <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ที่อยู่ปัจจุบัน"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">บรรยายความประพฤติดี</label>
                <textarea rows={6} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="บรรยายความประพฤติดี"
                />
              </div>
            </div>


            <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">
              เพิ่มคำถามเพื่อสมัครเข้าโครงการ
            </h2>
            <form onSubmit={handleFormSubmit}>
              {questions.map((q, index) => (
                <div key={q.id} className="space-y-2 border-b pb-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Question {index + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(q.id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(q.id, "question", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="choice">Multiple Choice</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="date">Date Picker</option>
                  </select>
                  {q.type === "choice" || q.type === "checkbox" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Options
                      </label>
                      {q.options.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...q.options];
                              newOptions[idx] = e.target.value;
                              updateQuestion(q.id, "options", newOptions);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = q.options.filter((_, i) => i !== idx);
                              updateQuestion(q.id, "options", newOptions);
                            }}
                            className="text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestion(q.id, "options", [...q.options, ""])
                        }
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                      >
                        Add Option
                      </button>
                    </div>
                  ) : null}
                  {q.type === "date" && (
                    <div className="relative max-w-sm">
                      <DatePicker
                        selected={q.selectedDate}
                        onChange={(date) =>
                          updateQuestion(q.id, "selectedDate", date)
                        }
                        placeholderText="Select a date"
                        dateFormat="dd/MM/yyyy"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                                       block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                       dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={q.required === 'true'}
                      onChange={(e) =>
                        updateQuestion(q.id, "required", e.target.checked ? 'true' : 'false')
                      }
                    />
                    <label className="text-sm text-gray-700">Required</label>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Add Question
                </button>
              </div>
            </form>


            <button
              type="button"
              //   onClick={handleSubmit}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              ตกลง
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


