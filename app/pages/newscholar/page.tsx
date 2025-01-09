
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import styles from "./nuebotton.module.css";
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

      {/* Main Section (Full Screen) */}
      <main className="flex-1 flex items-top justify-center bg-gray-100">
        <div className="text-center bg-gray-50 px-10 py-10" >
          <div className="text-top justify-center bg-gray-50 text-3xl">
             เลือกประเภทโครงการ
          </div>
             
          <div className="space-x-10  space-y-20">
          <Link href="../pages/newscholar/wellbehavior">
          <button className = {styles.button} >
             โครงการประพฤติดี
          </button>
          </Link>
          <button className = {styles.button} >
            โครงการกิจกรรมนอกหลักสูตร
          </button>
          </div>

          <div className="space-y-10 space-x-10 ">
          <button className = {styles.button} >
            โครงการความคิดสร้างสรรค์และนวัตกรรม
          </button> 
          <button className = {styles.button} >
            โครงการอื่นๆ
          </button>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย</p>
        </div>
      </footer>
    </div>
  );
}
