'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import SessionProvider from '@/components/sessionProvider';
import Sidebar from '@/components/sidebar';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ตรวจสอบสถานะ session หากยังโหลดอยู่ให้แสดง Loading...
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // สมมุติว่า user info อยู่ใน session.user
  const userInfo = session?.user;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Section (User Info Section) */}
      <main className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">User Information</h2>
          {session ? (
            <>
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-600">
                  ชื่อ: {session.userProfile.firstnameTh} {session.userProfile.lastnameTh}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-600">
                  Email: {session.userProfile.email}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-600">
                  คณะ: {session.userProfile.faculty}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-600">
                  ภาควิชา: {session.userProfile.department}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-600">
                  Role: {session.userProfile.role}
                </p>
              </div>
              {/* <div className="mb-4">
                <p className="text-lg font-semibold text-gray-600">Signature:</p>
                เพิ่มรายละเอียดเพิ่มเติมหรือ component สำหรับลายเซ็นต์ที่นี่
              </div> */}
            </>
          ) : (
            <p className="text-gray-600">ไม่มีข้อมูลผู้ใช้</p>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย</p>
        </div>
      </footer>
    </div>
  );
}
