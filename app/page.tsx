'use client';

import Header from '@/components/header';
import SessionProvider from '@/components/sessionProvider';
import Sidebar from '@/components/sidebar';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

import styles from './/nuebotton.module.css';

export default function Home() {
  const { data: session } = useSession();

  console.log('sesion:', session);

  const role = session?.userProfile;

  const token = session?.account.access_token as string | undefined;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

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

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย </p>
        </div>
      </footer>
    </div>
  );
}
