"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import CsvUploader from "@/components/uploadCSV";
import SearchFinancePage from "@/components/searchCSV";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("searchfinance");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "uploadfile":
        return <CsvUploader />;
      case "searchfinance":
      default:
        return <SearchFinancePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg mb-4">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => setCurrentPage("searchfinance")}
              className={`px-4 py-2 rounded ${
                currentPage === "searchfinance"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Search Finance
            </button>
            <button
              onClick={() => setCurrentPage("uploadfile")}
              className={`px-4 py-2 rounded ${
                currentPage === "uploadfile"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Upload File
            </button>
          </div>
          {renderPage()}
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}