'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import { useState } from 'react';

import styles from './nuebotton.module.css';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Section (Full Screen) */}
      <main className="items-top flex flex-1 justify-center bg-gray-100">
        <div className="bg-gray-50 px-10 py-10 text-center">
          <div className="text-top justify-center bg-gray-50 text-3xl">เลือกประเภทโครงการ</div>
          <div style={{ height: '40px' }}></div>
          <div className="space-x-10 space-y-20">
            <Link href="../../../../pages/newscholar/wellbehavior">
              <button className={styles.button}>โครงการประพฤติดี</button>
            </Link>
            <Link href="../../../../pages/newscholar/extracurricular">
              <button className={styles.button}>โครงการกิจกรรมนอกหลักสูตร</button>
            </Link>
          </div>

          <div className="space-x-10 space-y-10">
            <Link href="../../../../pages/newscholar/innovation">
              <button className={styles.button}>โครงการความคิดสร้างสรรค์และนวัตกรรม</button>
            </Link>
            <button className={styles.button}>โครงการอื่นๆ</button>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
