'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import styles from './nuebotton.module.css';

interface UserData {
  email: string;
  isAcceptPolicy: boolean;
  // สามารถเพิ่มฟิลด์อื่นๆ ที่จำเป็นจาก API ได้ตามต้องการ
}

export default function Home() {
  const { data: session } = useSession();

  // สมมติว่า session มี property userProfile ที่เก็บ email ไว้
  const email = session?.userProfile?.email;
  const token = session?.account?.access_token as string | undefined;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const router = useRouter();

  // State สำหรับเก็บข้อมูลผู้ใช้ที่ดึงมาจาก API
  const [userData, setUserData] = useState<UserData | null>(null);
  // State สำหรับควบคุมการแสดง pop-up นโยบาย
  const [showPolicyPopup, setShowPolicyPopup] = useState(false);

  // ฟังก์ชันสำหรับเรียก API เพื่อดึงข้อมูลผู้ใช้จาก email
  const fetchUserByEmail = async (email: string) => {
    try {
      const response = await fetch(`/api/user/email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // หากต้องการส่ง token เพิ่มได้ เช่น "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user, status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  // useEffect เรียกข้อมูลผู้ใช้เมื่อ email มีค่า
  useEffect(() => {
    if (email) {
      fetchUserByEmail(email).then((data) => {
        if (data) {
          setUserData(data);
          // ถ้าผู้ใช้ยังไม่ยอมรับนโยบาย (isAcceptPolicy === false) ให้แสดง pop-up
          if (!data.isAcceptPolicy) {
            setShowPolicyPopup(true);
          }
        }
      });
    }
  }, [email]);

  // ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้กด "ยอมรับนโยบาย"
  const handleAcceptPolicy = async () => {
    try {
      const response = await fetch(`/api/user/email/${encodeURIComponent(email!)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          isAcceptPolicy: true,
        }),
      });
      if (response.ok) {
        setShowPolicyPopup(false);
        // อัพเดท userData ใน state ให้เป็น true
        setUserData({ ...userData!, isAcceptPolicy: true });
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตนโยบาย');
      }
    } catch (error) {
      console.error('Error updating policy:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Section */}
      <main className="flex flex-1 justify-center bg-gray-100">
        <div className="bg-gray-50 px-10 py-10 text-center">
          <div className="text-top justify-center bg-gray-50 text-3xl">คู่มือแต่ละโรล</div>
          <div style={{ height: '40px' }}></div>
          <div className="space-x-10 space-y-20">
            <Link href="../../../../pages/newscholar/wellbehavior">
              <button className={styles.button}>ผู้เสนอชื่อผู้สมัคร (นิสิต, หัวหน้าภาควิชา)</button>
            </Link>
            <Link href="../../../../pages/newscholar/extracurricular">
              <button className={styles.button}>เจ้าหน้าที่คณะ (รองคณบดี, คณบดี)</button>
            </Link>
          </div>
          <div className="space-x-10 space-y-10">
            <Link href="../../../../pages/newscholar/innovation">
              <button className={styles.button}>เจ้าหน้าที่กองพัฒนานิสิต</button>
            </Link>
            <button className={styles.button}>คณะกรรมการประจำโครงการ</button>
          </div>
          <div className="mt-12 space-x-10 space-y-10">
            <Link href="../../../../pages/newscholar/innovation">
              <button className={styles.button}>ประธานโครงการ</button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; นายกุลชัย</p>
        </div>
      </footer>

      {/* Pop-up Policy Modal */}
      {showPolicyPopup && session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-screen w-11/12 max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-center text-xl font-bold">นโยบายการใช้งาน/ความเป็นส่วนตัว</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>1. ข้อมูลส่วนบุคคลที่เราเก็บ</strong>
                <br />
                ระบบจะเก็บรวบรวมข้อมูลส่วนบุคคลที่ท่านได้กรอกเข้ามา โดยมีวัตถุประสงค์
                ขอบเขตและใช้วิธีการที่ชอบด้วยกฎหมาย
                ข้อมูลส่วนบุคคลทั้งหมดต้องได้รับความยินยอมจากเจ้าของข้อมูลแล้ว
                การเก็บข้อมูลจะทำเพียงเท่าที่จำเป็นต่อการดำเนินงานภายใต้วัตถุประสงค์ของระบบ
                และทางเราจะให้เจ้าของข้อมูลรับรู้ผ่านความยินยอมทางอิเล็กทรอนิกส์
              </p>
              <p>
                <strong>2. การประมวลผลข้อมูลส่วนบุคคล</strong>
                <br />
                เราจะประมวลผลข้อมูลส่วนบุคคลของท่านเพื่อให้บริการตามที่ท่านสมัคร ร้องขอ
                และเพื่อการให้บริการที่มีประสิทธิภาพสูงสุด
                โดยข้อมูลจะถูกนำไปใช้เพื่อสร้างและจัดการบัญชีผู้ใช้งาน ใช้ในการติดต่อระหว่างผู้ใช้
                ป้องกันการทุจริต และปฏิบัติตามข้อตกลงและเงื่อนไข
                รวมถึงกฎหมายและกฎระเบียบของหน่วยงานราชการ
              </p>
              <p>
                <strong>3. วิธีการเก็บรักษาข้อมูลส่วนบุคคลและความปลอดภัย</strong>
                <br />
                เราจะรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคลของท่านตามหลักการความลับ
                ความถูกต้องครบถ้วน และความพร้อมใช้งาน โดยใช้มาตรการด้านการบริหารจัดการ เทคนิค
                และทางกายภาพในการป้องกันข้อมูลจากการสูญหาย การเข้าถึง การเปลี่ยนแปลง หรือการเปิดเผย
              </p>
              <p>
                <strong>4. การเปิดเผยข้อมูลส่วนบุคคล</strong>
                <br />
                อาจเปิดเผยข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก
                ตามที่ได้รับความยินยอมจากท่านหรือเมื่อกฎหมายอนุญาต
                เพื่อวัตถุประสงค์ในการปรับปรุงบริการ หรือการประชาสัมพันธ์
              </p>
              <p>
                <strong>5. สิทธิของเจ้าของข้อมูลส่วนบุคคล</strong>
                <br />
                ก. การเพิกถอนความยินยอม: ท่านมีสิทธิเพิกถอนความยินยอมในการจัดเก็บ ใช้
                หรือเปิดเผยข้อมูลส่วนบุคคลของท่านได้ โดยติดต่อเจ้าหน้าที่ผ่าน Email:
                kunlachai.b@ku.th
                <br />
                ข. การขอเข้าถึงข้อมูลส่วนบุคคล:
                ท่านสามารถขอรับสำเนาหรือเปิดเผยแหล่งที่มาของข้อมูลส่วนบุคคลของท่าน
                <br />
                ค. การคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล: ท่านมีสิทธิคัดค้านการเก็บรวบรวม
                ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของท่าน
                <br />
                ง. การขอลบหรือเปลี่ยนแปลงข้อมูล: ท่านสามารถขอให้ลบ ทำลาย
                หรือเปลี่ยนแปลงข้อมูลส่วนบุคคลให้ไม่ระบุตัวตน
                <br />
                จ. การขอให้ระงับการประมวลผล:
                ท่านสามารถขอให้ระงับการประมวลผลข้อมูลส่วนบุคคลของท่านทั้งหมดหรือบางส่วน
                <br />
                ฉ. การแก้ไขข้อมูล: ท่านมีสิทธิขอแก้ไขข้อมูลส่วนบุคคลของท่านให้ถูกต้องและเป็นปัจจุบัน
                <br />
                ช. การร้องเรียน:
                ท่านมีสิทธิร้องเรียนต่อหน่วยงานที่เกี่ยวข้องในกรณีที่เชื่อว่าการจัดเก็บหรือใช้ข้อมูลส่วนบุคคลฝ่าฝืนกฎหมาย
              </p>
              <p>
                <strong>6. รายละเอียดการติดต่อ</strong>
                <br />
                หากท่านมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
                กรุณาติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลผ่าน Email: kunlachai.b@ku.th
              </p>
            </div>
            <div className="mt-8"></div>
            <button
              className="mb-2 w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
              onClick={handleAcceptPolicy}>
              ยอมรับนโยบาย
            </button>
            <button
              className="w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-400"
              onClick={() => signOut({ callbackUrl: '/api/auth/logout' })}>
              ปฏิเสธนโยบาย
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
