"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormSection from "@/components/createFormDetail";

type Question = {
  id: number;
  question: string;
  type: string; // "text" | "choice" | "checkbox" | "date"
  options: string[];
  required: boolean; // กำหนดว่าคำถามต้องตอบหรือไม่
  selectedDate?: Date; // สำหรับ Date Picker
};

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // ควบคุมขั้นตอนของฟอร์ม

  const [projectData, setProjectData] = useState({
    name: "",
    startDate: null,
    endDate: null,
    academicYear: "",
    semester: "",
    program: "",
    description: "",
    announcementFile: null,
    announcementFileName: "",
    announcementFileContent: "",
    rewards: [] as ("ลดค่าบำรุงมหาวิทยาลัย" | "ลดค่าหน่วยกิต" | "ลดค่าธรรมเนียมพิเศษคณะ" | "อื่นๆ")[],
    otherReward: "",
  });

  // ฟังก์ชันเปิด/ปิด Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ฟังก์ชันเปลี่ยนขั้นตอน
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, question: "ชื่อ-นามสกุล (นาย/นางสาว)", type: "text", options: [], required: true },
    { id: 2, question: "NAME-SURNAME (Miss/Mr)", type: "text", options: [], required: true },
    { id: 3, question: "นิสิตชั้นปีที่", type: "text", options: [], required: true },
    { id: 4, question: "รหัสนิสิต", type: "text", options: [], required: true },
    { id: 5, question: "ภาควิชา/สาขาวิชา", type: "text", options: [], required: true },
    { id: 6, question: "คณะ", type: "text", options: [], required: true },
    { id: 7, question: "อาจารย์ที่ปรึกษา", type: "text", options: [], required: true },
    { id: 8, question: "คะแนนเฉลี่ยสะสม", type: "text", options: [], required: true },
    { id: 9, question: "เกิดวันที่", type: "date", options: [], required: true },
    { id: 10, question: "อายุ(ปี)", type: "text", options: [], required: true },
    { id: 11, question: "โทรศัพท์", type: "text", options: [], required: true },
    { id: 12, question: "E-mail", type: "text", options: [], required: true },
    { id: 13, question: "ที่อยู่ปัจจุบัน", type: "text", options: [], required: true },
    { id: 14, question: "ท่านเรียนภาคการศึกษานี้เป็นภาคสุดท้ายใช่หรือไม่", type: "choice", options: ['ใช่','ไม่ใช่'], required: true },
  ]);

  // เพิ่มคำถามใหม่
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        type: "text",
        options: [],
        required: false,
      },
    ]);
  };

  // ลบคำถาม
  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // อัปเดตคำถาม
  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  // ฟังก์ชันตรวจสอบ validation
  const validateForm = () => {
    for (let q of questions) {
      if (q.required && (!q.options.length || !q.question.trim())) {
        alert(`Question "${q.question || 'Untitled'}" is required!`);
        return false;
      }
    }
    return true;
  };

  // ส่งข้อมูลฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form Data:", questions);
      alert("Form Submitted!");
    }
  };

  const handleProjectChange = (field: string, value: any) => {
    setProjectData({ ...projectData, [field]: value });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProjectChange("announcementFile", e.target.files[0]);
      handleProjectChange("announcementFileName", e.target.files[0].name);
      
    }
  };

  const handleRewardChange = (reward: string) => {
    const newRewards = projectData.rewards.includes(reward as "ลดค่าบำรุงมหาวิทยาลัย" | "ลดค่าหน่วยกิต" | "ลดค่าธรรมเนียมพิเศษคณะ" | "อื่นๆ")
      ? projectData.rewards.filter((r) => r !== reward)
      : [...projectData.rewards, reward];
    handleProjectChange("rewards", newRewards);
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
        <div className="w-1"></div>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex justify-center bg-gray-100 w-full mx-auto">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        {currentStep === 1 && (
            <FormSection
              projectData={projectData}
              handleProjectChange={handleProjectChange}
              handleFileChange={handleFileChange}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <div className="flex justify-center items-top min-h-screen bg-white ">
              <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">
                  ตัวอย่างคำถามเพื่อสมัครเข้าโครงการ
                </h2>
                <form onSubmit={handleSubmit}>
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
                          checked={q.required}
                          onChange={(e) =>
                            updateQuestion(q.id, "required", e.target.checked)
                          }
                        />
                        <label className="text-sm text-gray-700">Required</label>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Add Question
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Submit Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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