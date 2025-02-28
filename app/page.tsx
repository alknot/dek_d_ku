"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-teal-700 shadow-md">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
          aria-label="Toggle Sidebar"
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
        <h1 className="flex-1 text-center text-3xl font-bold text-white">
          Dek-D KU
        </h1>
        {/* Spacer */}
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Dek-D KU
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {session ? `Logged in as ${session.user?.name}` : "Please log in to continue."}
          </p>
          <div className="space-x-4">
            {!session ? (
              <button
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg transition"
                onClick={() => signIn("keycloak")}
              >
                Log in
              </button>
            ) : (
              <button
                className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg transition"
                onClick={() => signOut({ callbackUrl: "/api/auth/logout" })}
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 นายกุลชัย. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
