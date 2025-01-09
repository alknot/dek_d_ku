"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    joined: "2023-01-01",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

      {/* Main Section (User Info Section) */}
      <main className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Information</h2>
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-600">Name:</p>
            <p className="text-gray-800">{userInfo.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-600">Email:</p>
            <p className="text-gray-800">{userInfo.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-600">Role:</p>
            <p className="text-gray-800">{userInfo.role}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-600">Signature:</p>
            <p className="text-gray-800"></p>
          </div>
          <button
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
            onClick={() => alert("Edit User Info Clicked!")}
          >
            Edit User Info
          </button>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย </p>
        </div>
      </footer>
    </div>
  );
}
