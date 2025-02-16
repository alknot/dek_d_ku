
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import styles from "./nuebotton.module.css";
import Link from "next/link";
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
      <main className="flex-1 flex items-top justify-center bg-gray-100">
        <div className="text-center bg-gray-50 px-10 py-10" >
          <div className="text-top justify-center bg-gray-50 text-3xl">
             เลือกประเภทโครงการ
          </div>
             <div style={{ height: '40px' }}></div>
          <div className="space-x-10  space-y-20">
          <Link href="../pages/newscholar/wellbehavior">
          <button className = {styles.button} >
             โครงการประพฤติดี
          </button>
          </Link >
          <Link href="../pages/newscholar/extracurricular">
          <button className = {styles.button} >
            โครงการกิจกรรมนอกหลักสูตร
          </button>
          </Link>
          </div>

          <div className="space-y-10 space-x-10 ">
          <Link href="../pages/newscholar/innovation">
          <button className = {styles.button} >
            โครงการความคิดสร้างสรรค์และนวัตกรรม
          </button> 
          </Link>
          <button className = {styles.button} >
            โครงการอื่นๆ
          </button>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
