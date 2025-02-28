"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

// ประเภทคำถาม (template)
type QuestionType = "text" | "choice" | "checkbox" | "date";

type Question = {
  id: number;
  question: string;
  type: QuestionType;
  options: string[];
  required: boolean;
};

export default function DynamicQuestionPage() {
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();
  const params = useParams();         // กรณีเส้นทาง /scholarship/[id]
  const searchParams = useSearchParams();  // ถ้าต้องการอ่าน query param เช่น ?pageScholarshipId=xxx

  // สมมติอ่านค่า scholarshipId จาก params หรือ query param
  const scholarshipId = params.id || searchParams.get("pageScholarshipId");

  useEffect(() => {
    if (!scholarshipId) return;

    // เรียก API GET เพื่อนำข้อมูล Scholarship + dynamicQuestions
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/scholarship/${scholarshipId}`);
        if (!res.ok) {
          // ถ้า status code != 2xx จะโยน Error ออกไป
          throw new Error(`Failed to fetch scholarship. status=${res.status}`);
        }
        const data = await res.json();

        // ตรวจสอบว่ามี dynamicQuestions หรือไม่
        if (data && data.dynamicQuestions) {
          // map ให้ตรงกับ state Question
          const loadedQuestions = data.dynamicQuestions.map(
            (q: any, idx: number) => ({
              id: Date.now() + idx,
              question: q.question,
              // แปลง type ใน DB ("TEXT", "CHOICE", "CHECKBOX", "DATE") เป็น TypeScript union
              type: q.type?.toLowerCase() || "text",
              options: q.options || [],
              required: q.required || false,
            })
          );
          setQuestions(loadedQuestions);
        }
      } catch (error) {
        console.error("Error fetching scholarship:", error);
        // อาจจะ alert หรือทำ redirect ก็ได้
      }
    };

    fetchData();
  }, [scholarshipId]);

  // เพิ่มคำถามใหม่
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        question: "",
        type: "text",
        options: [],
        required: false,
      },
    ]);
  };

  // ลบคำถาม
  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // อัปเดตฟิลด์ของคำถาม
  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  // ส่งข้อมูล (PATCH) เพื่อบันทึก dynamicQuestions กลับไปยัง /api/scholarship/[id]
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipId) {
      alert("Scholarship ID not found.");
      return;
    }
    // แปลงค่า type ใน State ให้เป็น enum ของ Prisma ("TEXT", "CHOICE", ...)
    const dynamicQuestions = questions.map((q) => ({
      question: q.question,
      type:
        q.type === "text"
          ? "TEXT"
          : q.type === "choice"
          ? "CHOICE"
          : q.type === "checkbox"
          ? "CHECKBOX"
          : "DATE",
      options: q.options,
      required: q.required,
    }));

    try {
      const res = await fetch(`/api/scholarship/${scholarshipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dynamicQuestions }),
      });
      if (!res.ok) {
        throw new Error(`Update failed. status=${res.status}`);
      }
      alert("บันทึก Dynamic Questions สำเร็จ!");
      // redirect หรือทำอย่างอื่น
      router.push("/pages/newscholar");
    } catch (error) {
      console.error("Error updating dynamicQuestions:", error);
      alert("Error updating dynamicQuestions");
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar / Header ตามต้องการ */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} />

      <main className="flex-1 flex justify-center bg-gray-100 w-full mx-auto">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">
            เพิ่มคำถาม (Dynamic Question) ให้ Scholarship
          </h2>

          {/* ใช้ form เดียวเท่านั้น, onSubmit={handleFormSubmit} */}
          <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <div key={q.id} className="space-y-2 border-b pb-4 mb-4">
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
                  onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(q.id, "type", e.target.value as QuestionType)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="choice">Multiple Choice</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date Picker</option>
                </select>

                {(q.type === "choice" || q.type === "checkbox") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    {q.options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mb-1">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[idx] = e.target.value;
                            updateQuestion(q.id, "options", newOpts);
                          }}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = q.options.filter((_, i) => i !== idx);
                            updateQuestion(q.id, "options", newOpts);
                          }}
                          className="text-red-500 text-sm"
                        >
                          Del
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion(q.id, "options", [...q.options, ""])
                      }
                      className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg"
                    >
                      Add Option
                    </button>
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

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Add Question
              </button>
            </div>

            <button
              type="submit"
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              บันทึก Dynamic Questions
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
