import React from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4">
        <button
          className="block py-2 px-4 text-gray-400 hover:text-white font-bold"
          onClick={toggleSidebar}
        >
          X
        </button>
        <ul className="mt-6 space-y-2">
          <li>
            <a href="../../" className="block py-2 px-4 hover:bg-gray-700 rounded">
              วิธีใช้งาน
            </a>
          </li>
          <li>
            <a href="../../pages/userinfo" className="block py-2 px-4 hover:bg-gray-700 rounded">
              User Info
            </a>
          </li>
          <li>
            <a href="../../pages/recentscholar" className="block py-2 px-4 hover:bg-gray-700 rounded">
              โครงการที่เปิดรับ
            </a>
          </li>
          <li>
            <a href="../../pages/newscholar" className="block py-2 px-4 hover:bg-gray-700 rounded">
              สร้างโครงการ
            </a>
          </li>
          <li>
            <a href="../../pages/consideration" className="block py-2 px-4 hover:bg-gray-700 rounded">
              พิจารณาผล
            </a>
          </li>
          <li>
            <a href="../../pages/showresult" className="block py-2 px-4 hover:bg-gray-700 rounded">
              ติดตามผลการพิจารณา
            </a>
          </li>
          <li>
            <a href="../../pages/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Dashboard
            </a>
          </li>
          <li>
            <a href="../../pages/finance" className="block py-2 px-4 hover:bg-gray-700 rounded">
              การเงิน
            </a>
          </li>
          <li>
            <a href="../../pages/giveprivilege" className="block py-2 px-4 hover:bg-gray-700 rounded">
              การจัดการสิทธิการเข้าถึง
            </a>
          </li>
          <li>
            <a href="../../pages/hallofflame" className="block py-2 px-4 hover:bg-gray-700 rounded">
              ทำเนียบ
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;