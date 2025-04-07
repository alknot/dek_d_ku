'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// ประเภทคำถาม (template)
type QuestionType = 'text' | 'choice' | 'checkbox' | 'date';

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
  const params = useParams(); // กรณีเส้นทาง /scholarship/[id]
  const searchParams = useSearchParams(); // ถ้าต้องการอ่าน query param เช่น ?pageScholarshipId=xxx

  // สมมติอ่านค่า scholarshipId จาก params หรือ query param
  const scholarshipId = params.id || searchParams.get('pageScholarshipId');

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
          const loadedQuestions = data.dynamicQuestions.map((q: any, idx: number) => ({
            id: Date.now() + idx,
            question: q.question,
            // แปลง type ใน DB ("TEXT", "CHOICE", "CHECKBOX", "DATE") เป็น TypeScript union
            type: q.type?.toLowerCase() || 'text',
            options: q.options || [],
            required: q.required || false,
          }));
          setQuestions(loadedQuestions);
        }
      } catch (error) {
        console.error('Error fetching scholarship:', error);
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
        question: '',
        type: 'text',
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
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  // ส่งข้อมูล (PATCH) เพื่อบันทึก dynamicQuestions กลับไปยัง /api/scholarship/[id]
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipId) {
      alert('Scholarship ID not found.');
      return;
    }
    // แปลงค่า type ใน State ให้เป็น enum ของ Prisma ("TEXT", "CHOICE", ...)
    const dynamicQuestions = questions.map((q) => ({
      question: q.question,
      type:
        q.type === 'text'
          ? 'TEXT'
          : q.type === 'choice'
            ? 'CHOICE'
            : q.type === 'checkbox'
              ? 'CHECKBOX'
              : 'DATE',
      options: q.options,
      required: q.required,
    }));

    try {
      const res = await fetch(`/api/scholarship/${scholarshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dynamicQuestions }),
      });
      if (!res.ok) {
        throw new Error(`Update failed. status=${res.status}`);
      }
      alert('สร้างโครงการสำเร็จ!');
      // redirect หรือทำอย่างอื่น
      router.push('/pages/newscholar');
    } catch (error) {
      console.error('Error updating dynamicQuestions:', error);
      alert('Error updating dynamicQuestions');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar / Header ตามต้องการ */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            เพิ่มคำถาม ให้ Scholarship
          </h2>

          {/* ใช้ form เดียวเท่านั้น, onSubmit={handleFormSubmit} */}
          <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <div key={q.id} className="mb-4 space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Question {index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(q.id)}
                    className="text-sm text-red-500">
                    Delete
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter your question"
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(q.id, 'type', e.target.value as QuestionType)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="text">Text</option>
                  <option value="choice">Multiple Choice</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="date">Date Picker</option>
                </select>

                {(q.type === 'choice' || q.type === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    {q.options.map((option, idx) => (
                      <div key={idx} className="mb-1 flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[idx] = e.target.value;
                            updateQuestion(q.id, 'options', newOpts);
                          }}
                          className="w-full rounded-lg border border-gray-300 px-3 py-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOpts = q.options.filter((_, i) => i !== idx);
                            updateQuestion(q.id, 'options', newOpts);
                          }}
                          className="text-sm text-red-500">
                          Del
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateQuestion(q.id, 'options', [...q.options, ''])}
                      className="mt-2 rounded-lg bg-blue-500 px-4 py-1 text-white">
                      Add Option
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(q.id, 'required', e.target.checked)}
                  />
                  <label className="text-sm text-gray-700">Required</label>
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={addQuestion}
                className="rounded-lg bg-green-500 px-4 py-2 text-white">
                Add Question
              </button>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white">
              สร้างโครงการ
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
