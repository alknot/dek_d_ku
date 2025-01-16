"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Question = {
    id: number;
    question: string;
    type: string; // "text" | "radio" | "checkbox" | "date"
    options: string[];
    required: boolean; // กำหนดว่าคำถามต้องตอบหรือไม่
    selectedDate?: Date; // สำหรับ Date Picker
};

export default function DynamicForm() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, question: "Your name?", type: "text", options: [], required: true },
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
                <div className="w-10"></div> {/* ใช้เพื่อเว้นช่องให้ Header ตรงกลาง */}
            </header>

            {/* Main Section */}
            <main className="flex-1 flex items-center justify-center bg-gray-100">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg space-y-4">
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
                                <option value="radio">Multiple Choice</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="date">Date Picker</option>
                            </select>
                            {q.type === "radio" || q.type === "checkbox" ? (
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
                                                    const newOptions = q.options.filter(
                                                        (_, i) => i !== idx
                                                    );
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
                    dark:focus:ring-blue-500 dark:focus:border-blue-500 "
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
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                        Add Question
                    </button>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Submit Form
                    </button>
                </form>
            </main>

            {/* Footer Section */}
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; นายกุลชัย</p>
                </div>
            </footer>
        </div>
    )
}
