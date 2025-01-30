"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">Hello, World!</h2>
          <p className="mt-4 text-lg text-gray-600">
            This main section is now fully stretched to cover the page.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}