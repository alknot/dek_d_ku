"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

type QuestionType = "text" | "choice" | "checkbox" | "date";

interface DynamicQuestionResponse {
  id: number;
  question: string;
  type: QuestionType;
  options: string[];
  required: boolean;
  answer: string;
  selectedDate?: Date | null;
}

interface StaticData {
  nisitNameTh: string;
  nisitNameEn: string;
  nisitAcademicyear: string;
  nisitid: string;
  faculty: string;
  department: string;
  advisor: string;
  gpa: string;
  dateofBirth: Date | null;
  age: string;
  phone: string;
  email: string;
  address: string;
  isLastTerm: boolean;
  beahavior_detail: string;
  
}

export default function ApplyScholarshipPage() {
  // Static fields state
  const [staticData, setStaticData] = useState<StaticData>({
    nisitNameTh: "",
    nisitNameEn: "",
    nisitAcademicyear: "",
    nisitid: "",
    faculty: "",
    department: "",
    advisor: "",
    gpa: "",
    dateofBirth: null,
    age: "",
    phone: "",
    email: "",
    address: "",
    beahavior_detail: "",

    isLastTerm: false,
  });

  // Dynamic question responses state
  const [dynamicResponses, setDynamicResponses] = useState<DynamicQuestionResponse[]>([]);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // สมมติว่า scholarship id อยู่ใน URL เช่น /apply/[id]
  const scholarshipId = params.id; // id: string
  // นอกจากนี้ อาจมี query params สำหรับ academicYear และ term
  const academicYearParam = searchParams.get("academiYear") || "";
  const termParam = searchParams.get("term") || "";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // โหลด dynamic question template จาก Scholarship record (ถ้ามี)
  useEffect(() => {
    if (!scholarshipId) return;
    fetch(`/api/scholarship/${scholarshipId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch scholarship");
        return res.json();
      })
      .then((data) => {
        if (data && data.dynamicQuestions) {
          // map dynamicQuestions template ให้เป็น dynamicResponses state
          const loaded = data.dynamicQuestions.map((dq: any, index: number) => ({
            id: Date.now() + index,
            question: dq.question,
            type: dq.type.toLowerCase(), // สมมติใน DB เป็น "TEXT", "CHOICE", ฯลฯ
            options: dq.options,
            required: dq.required,
            answer: "",
            selectedDate: null,
          }));
          setDynamicResponses(loaded);
        }
      })
      .catch((err) => console.error(err));
  }, [scholarshipId]);

  // จัดการ static field
  const handleStaticChange = <K extends keyof StaticData>(field: K, value: StaticData[K]) => {
    setStaticData((prev) => ({ ...prev, [field]: value }));
  };

  // จัดการ dynamic question response
  const updateDynamicResponse = (
    id: number,
    field: keyof DynamicQuestionResponse,
    value: any
  ) => {
    setDynamicResponses((prev) =>
      prev.map((resp) => (resp.id === id ? { ...resp, [field]: value } : resp))
    );
  };

  // ส่งข้อมูล Form ไปยัง API (POST /api/form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipId) {
      alert("Scholarship ID not found");
      return;
    }
    // Prepare payload (แปลงวันที่ให้เป็น ISO string)
    const payload = {
      scholarshipID: scholarshipId,
      ...staticData,schType: "WELL_BEHAVIOR",
      dateofBirth: staticData.dateofBirth ? staticData.dateofBirth.toISOString() : null,
      academicYear: academicYearParam,
      term: termParam,
      
      dynamicQuestions: dynamicResponses.map((resp) => ({
        question: resp.question,
        type:
          resp.type === "text"
            ? "TEXT"
            : resp.type === "choice"
            ? "CHOICE"
            : resp.type === "checkbox"
            ? "CHECKBOX"
            : "DATE",
        options: resp.options,
        required: resp.required,
        answer: resp.answer,
        selectedDate: resp.selectedDate ? resp.selectedDate.toISOString() : undefined,
      })),
    };

    try {
      console.log("Sending payload:", payload);
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("ส่งฟอร์มสมัครทุนสำเร็จ!");
        router.push("/newscholarship/success"); // เปลี่ยน path ตามที่ต้องการ
      } else {
        alert("เกิดข้อผิดพลาดในการส่งฟอร์ม");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} />
      <main className="flex-1 flex justify-center bg-gray-100 w-full mx-auto">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-center mb-4">
            กรอกฟอร์มสมัครทุนประพฤติดี
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Static Fields */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-2">
                ข้อมูลนิสิต 
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">ชื่อนิสิต (ไทย)</label>
                  <input
                    type="text"
                    value={staticData.nisitNameTh}
                    onChange={(e) => handleStaticChange("nisitNameTh", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">ชื่อนิสิต (อังกฤษ)</label>
                  <input
                    type="text"
                    value={staticData.nisitNameEn}
                    onChange={(e) => handleStaticChange("nisitNameEn", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ปีการศึกษา</label>
                  <input
                    type="text"
                    value={staticData.nisitAcademicyear}
                    onChange={(e) => handleStaticChange("nisitAcademicyear", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">รหัสนิสิต</label>
                  <input
                    type="text"
                    value={staticData.nisitid}
                    onChange={(e) => handleStaticChange("nisitid", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">คณะ</label>
                  <input
                    type="text"
                    value={staticData.faculty}
                    onChange={(e) => handleStaticChange("faculty", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ภาควิชา/สาขาวิชา</label>
                  <input
                    type="text"
                    value={staticData.department}
                    onChange={(e) => handleStaticChange("department", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">อาจารย์ที่ปรึกษา</label>
                  <input
                    type="text"
                    value={staticData.advisor}
                    onChange={(e) => handleStaticChange("advisor", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">เกรดเฉลี่ย</label>
                  <input
                    type="text"
                    value={staticData.gpa}
                    onChange={(e) => handleStaticChange("gpa", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">วันเกิด</label>
                  <DatePicker
                    selected={staticData.dateofBirth}
                    onChange={(date) => handleStaticChange("dateofBirth", date)}
                    className="border p-2 w-full"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">อายุ</label>
                  <input
                    type="text"
                    value={staticData.age}
                    onChange={(e) => handleStaticChange("age", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">โทรศัพท์</label>
                  <input
                    type="text"
                    value={staticData.phone}
                    onChange={(e) => handleStaticChange("phone", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">E-mail</label>
                  <input
                    type="email"
                    value={staticData.email}
                    onChange={(e) => handleStaticChange("email", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">ที่อยู่</label>
                  <input
                    type="text"
                    value={staticData.address}
                    onChange={(e) => handleStaticChange("address", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจบ</label>
                  <select
                    value={staticData.isLastTerm ? "true" : "false"}
                    onChange={(e) =>
                      handleStaticChange("isLastTerm", e.target.value === "true")
                    }
                    className="border p-2 w-full"
                    required
                  >
                    <option value="">กรุณาเลือก</option>
                    <option value="true">ใช่</option>
                    <option value="false">ไม่ใช่</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">บรรยายความประพฤติดี</label>
                  <textarea
                    rows={6}
                    
                    value={staticData.beahavior_detail}
                    onChange={(e) => handleStaticChange("beahavior_detail", e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Dynamic Questions Section */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-2">คำถามเพิ่มเติม </h2>
              {dynamicResponses.map((dr, idx) => (
                <div key={dr.id} className="border p-4 mb-4 rounded">
                  <p className="font-bold">Q{idx + 1}: {dr.question}</p>
                  {dr.type === "text" && (
                    <input
                      type="text"
                      value={dr.answer}
                      onChange={(e) =>
                        updateDynamicResponse(dr.id, "answer", e.target.value)
                      }
                      className="border p-2 w-full"
                      placeholder="กรอกคำตอบ"
                      required={dr.required}
                    />
                  )}
                  {dr.type === "choice" && (
                    <div>
                      {dr.options.map((opt, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`choice_${dr.id}`}
                            value={opt}
                            checked={dr.answer === opt}
                            onChange={() => updateDynamicResponse(dr.id, "answer", opt)}
                          />
                          <label>{opt}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {dr.type === "checkbox" && (
                    <div>
                      {dr.options.map((opt, i) => {
                        const selectedValues = dr.answer ? dr.answer.split(",") : [];
                        const isChecked = selectedValues.includes(opt);
                        const toggleCheckbox = () => {
                          let newArr = [...selectedValues];
                          if (isChecked) {
                            newArr = newArr.filter((v) => v !== opt);
                          } else {
                            newArr.push(opt);
                          }
                          updateDynamicResponse(dr.id, "answer", newArr.join(","));
                        };
                        return (
                          <div key={i} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={toggleCheckbox}
                            />
                            <label>{opt}</label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {dr.type === "date" && (
                    <DatePicker
                      selected={dr.selectedDate || null}
                      onChange={(date) => updateDynamicResponse(dr.id, "selectedDate", date)}
                      className="border p-2 w-full"
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                </div>
              ))}
              {/* <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setDynamicResponses((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        question: "",
                        type: "text",
                        options: [],
                        required: false,
                        answer: "",
                        selectedDate: null,
                      },
                    ])
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  เพิ่มคำถาม
                </button>
              </div> */}
            </section>

            <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
              ส่งฟอร์มสมัครทุน
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
