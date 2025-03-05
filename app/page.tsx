"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from ".//nuebotton.module.css";
import SessionProvider from "@/components/sessionProvider";
import Link from "next/link";

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
      <header
        className="shadow-md flex items-center justify-between"
        style={{ backgroundColor: "rgb(0,104,95)" }}
      >
        {/* Sidebar Toggle Button */}
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
        {/* Center Title */}
        <h1 className="text-3xl font-bold text-white text-center flex-1">
          Dek-D KU
        </h1>
        {/* Log in Button at the right-most side */}
        <div className="px-4 py-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 focus:outline-none"
            onClick={() => signIn("keycloak")}
          >
            Log in
          </button>
        </div>
      </header>

      {/* Main Section (Full Screen) */}
      <main className="flex-1 flex items-top justify-center bg-gray-100">
        <div className="text-center bg-gray-50 px-10 py-10">
          <div className="text-top justify-center bg-gray-50 text-3xl">
            คู่มือแต่ละโรล
          </div>
          <div style={{ height: '40px' }}></div>
          <div className="space-x-10 space-y-20">
            <Link href="../../../../pages/newscholar/wellbehavior">
              <button className={styles.button}>
                ผู้เสนอชื่อผู้สมัคร (นิสิต,หัวหน้าภาควิชา)
              </button>
            </Link>
            <Link href="../../../../pages/newscholar/extracurricular">
              <button className={styles.button}>
                เจ้าหน้าที่คณะ (รองคณบดี,คณบดี)
              </button>
            </Link>
          </div>

          <div className="space-y-10 space-x-10">
            <Link href="../../../../pages/newscholar/innovation">
              <button className={styles.button}>
                เจ้าหน้าที่กองพัฒนานิสิต
              </button>
            </Link>
            <button className={styles.button}>
              คณะกรรมการประจำโครงการ
            </button>
          </div>

          <div className="space-y-10 space-x-10 mt-12"> {/* เพิ่ม mt-20 เพื่อเพิ่มระยะห่าง */}
            <Link href="../../../../pages/newscholar/innovation">
              <button className={styles.button}>
                ประธานโครงการ
              </button>
            </Link>
          </div>
        </div>
      </main>

      <button
        className="button is-primary"
        onClick={() => signOut({ callbackUrl: "/api/auth/logout" })}
      >
        Log out
      </button>


      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย </p>
        </div>
      </footer>
    </div>
  );
}
