"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

type Role =
  | "STUDENT"
  | "FACULTY_STAFF"
  | "DEAN"
  | "SA_STAFF"
  | "DEPARTMENT_HEAD"
  | "NOT_ASSIGNED"
  | "DEPUTY_DEAN"
  | "COMMITTEE"
  | "CHAIRMAN"
  | "FINANCIAL";


interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}



const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<Role>("NOT_ASSIGNED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้งานจาก API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users"); // แก้ endpoint ให้ตรงกับ backend
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError("Please select a user and a role.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await axios.post("/api/assign-role", {
        userId: selectedUser,
        role: selectedRole,
      }); // แก้ endpoint ให้ตรงกับ backend
      alert("Role assigned successfully!");
      // Refresh user list
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to assign role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
    {/* Sidebar */}
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    {/* Header Section */}
    <Header toggleSidebar={toggleSidebar} />

    {/* Main Section (Full Screen) */}
    <main className="flex-1 flex justify-center bg-gray-100 w-full mx-auto">
        <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Admin Role Assignment
      </h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="text-sm font-medium">
                  {user.name} ({user.email})
                </p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
              <button
                onClick={() => setSelectedUser(user.id)}
                className={`px-4 py-2 text-sm rounded ${
                  selectedUser === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {selectedUser === user.id ? "Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Assign Role</h2>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          >
            <option value="NOT_ASSIGNED">Select Role</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY_STAFF">Faculty Staff</option>
            <option value="DEAN">Dean</option>
            <option value="SA_STAFF">SA Staff</option>
            <option value="DEPARTMENT_HEAD">Department Head</option>
          </select>

          <button
            onClick={handleAssignRole}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Assign Role
          </button>
        </div>
      </div>
    </div>
    </main>

    {/* Footer Section */}
    <Footer />
  </div>
);
}

export default AdminPage;

