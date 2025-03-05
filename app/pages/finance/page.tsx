'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import SearchFinancePage from '@/components/searchCSV';
import Sidebar from '@/components/sidebar';
import CsvUploader from '@/components/uploadCSV';
import { useState } from 'react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('searchfinance');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'uploadfile':
        return <CsvUploader />;
      case 'searchfinance':
      default:
        return <SearchFinancePage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section */}
      <main className="flex flex-1 flex-col items-center justify-center bg-gray-100">
        <div className="mb-4 w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex justify-center space-x-4">
            <button
              onClick={() => setCurrentPage('searchfinance')}
              className={`rounded px-4 py-2 ${
                currentPage === 'searchfinance'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}>
              Search Finance
            </button>
            <button
              onClick={() => setCurrentPage('uploadfile')}
              className={`rounded px-4 py-2 ${
                currentPage === 'uploadfile'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}>
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
