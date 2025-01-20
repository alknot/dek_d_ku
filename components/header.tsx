import React from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => (
  <header
    className="shadow-md flex items-center justify-between"
    style={{ backgroundColor: "rgb(0, 104, 95)" }}
  >
    <div className="px-4 py-4">
      <button onClick={toggleSidebar} className="text-white focus:outline-none">
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
    <div className="w-1"></div>
  </header>
);

export default Header;