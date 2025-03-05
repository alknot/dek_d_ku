'use client';

import SessionProvider from '@/components/sessionProvider';
import Sidebar from '@/components/sidebar';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

import styles from './/nuebotton.module.css';

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
      <header
        className="flex items-center justify-between shadow-md"
        style={{ backgroundColor: 'rgb(0,104,95)' }}>
        {/* Sidebar Toggle Button */}
        <div className="px-4 py-4">
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
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
        <h1 className="flex-1 text-center text-3xl font-bold text-white">Dek-D KU</h1>
        {/* Log in Button at the right-most side */}
        <div className="px-4 py-4">
          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 focus:outline-none"
            onClick={() => signIn('keycloak')}>
            Log in
          </button>
        </div>
      </header>

      {/* Main Section (Full Screen) */}
      <main className="items-top flex flex-1 justify-center bg-gray-100">
        <div className="bg-gray-50 px-10 py-10 text-center">
          <div className="text-top justify-center bg-gray-50 text-3xl">คู่มือแต่ละโรล</div>
          <div style={{ height: '40px' }}></div>
          <div className="space-x-10 space-y-20">
            <Link href="../../../../pages/newscholar/wellbehavior">
              <button className={styles.button}>ผู้เสนอชื่อผู้สมัคร (นิสิต,หัวหน้าภาควิชา)</button>
            </Link>
            <Link href="../../../../pages/newscholar/extracurricular">
              <button className={styles.button}>เจ้าหน้าที่คณะ (รองคณบดี,คณบดี)</button>
            </Link>
          </div>

          <div className="space-x-10 space-y-10">
            <Link href="../../../../pages/newscholar/innovation">
              <button className={styles.button}>เจ้าหน้าที่กองพัฒนานิสิต</button>
            </Link>
            <button className={styles.button}>คณะกรรมการประจำโครงการ</button>
          </div>

          <div className="mt-12 space-x-10 space-y-10">
            {' '}
            {/* เพิ่ม mt-20 เพื่อเพิ่มระยะห่าง */}
            <Link href="../../../../pages/newscholar/innovation">
              <button className={styles.button}>ประธานโครงการ</button>
            </Link>
          </div>
        </div>
      </main>

      <button
        className="button is-primary"
        onClick={() => signOut({ callbackUrl: '/api/auth/logout' })}>
        Log out
      </button>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย </p>
        </div>
      </footer>
    </div>
  );
}
