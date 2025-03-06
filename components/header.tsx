import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';

import Sidebar from './sidebar';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { data: session } = useSession();
  return (
    <header
      className="relative flex items-center justify-center py-4 shadow-md"
      style={{ backgroundColor: 'rgb(0,104,95)' }}>
      {/* Sidebar Toggle Button (ตำแหน่ง absolute ซ้าย) */}
      <div className="absolute left-0 px-4 py-4">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {session && (
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
        )}
      </div>

      {/* Center Title */}
      <h1 className="text-3xl font-bold text-white">Dek-D KU</h1>

      {/* Login/Logout Button (ตำแหน่ง absolute ขวา) */}
      <div className="absolute right-0 px-4 py-4">
        {!session && (
          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 focus:outline-none"
            onClick={() => signIn('keycloak')}>
            Log in
          </button>
        )}
        {session && (
          <div className="flex items-center space-x-4">
            <span className="text-white">
              {`Hello! ${session.userProfile.firstnameTh} ${session.userProfile.lastnameTh}`}
            </span>
            <button
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400 focus:outline-none"
              onClick={() => signOut({ callbackUrl: '/api/auth/logout' })}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
