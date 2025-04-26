import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 transform bg-gray-800 text-white ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
      <div className="p-4">
        <button
          className="block px-4 py-2 font-bold text-gray-400 hover:text-white"
          onClick={toggleSidebar}>
          X
        </button>
        <ul className="mt-6 space-y-2">
          <li>
            <a href="../../../../" className="block rounded px-4 py-2 hover:bg-gray-700">
              วิธีใช้งาน
            </a>
          </li>
          <li>
            <a
              href="../../../../pages/userinfo"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              User Info
            </a>
          </li>
          <li>
            <a
              href="../../../../pages/recentscholar"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              โครงการที่เปิดรับ
            </a>
          </li>
          <li>
            <a
              href="../../../../pages/newscholar"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              สร้างโครงการ
            </a>
          </li>
          <li>
            <a
              href="../../../../pages/consideration"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              พิจารณาผล
            </a>
          </li>
          {/* <li>
            <a
              href="../../../../pages/showresult"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              ติดตามผลการพิจารณา
            </a>
          </li> */}
          <li>
            <a
              href="../../../../pages/dashboard"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="../../../../pages/finance"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              การเงิน
            </a>
          </li>
          <li>
            <a
              href="../../../../pages/giveprivilege"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              การจัดการสิทธิการเข้าถึง
            </a>
          </li>
          <li>
            <a
              href="../../../../pages/hallofflame"
              className="block rounded px-4 py-2 hover:bg-gray-700">
              ทำเนียบ
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
