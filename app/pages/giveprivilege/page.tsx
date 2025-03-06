'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

type Role =
  | 'STUDENT'
  | 'FACULTY_STAFF'
  | 'DEAN'
  | 'SA_STAFF'
  | 'DEPARTMENT_HEAD'
  | 'NOT_ASSIGNED'
  | 'DEPUTY_DEAN'
  | 'COMMITTEE'
  | 'CHAIRMAN'
  | 'FINANCIAL';

interface User {
  id: string;
  firstnameTh: string;
  lastnameTh: string;
  email: string;
  role: Role;
}

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { data: session } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>('');
  const [selectedRole, setSelectedRole] = useState<Role>('NOT_ASSIGNED');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ users: User[] }>('/api/user');
      console.log('API response:', response.data);
      // สมมติ API ส่งกลับมาเป็น { users: [...] }
      setUsers(response.data.users ?? []);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลผู้ใช้งานจาก API
  useEffect(() => {
    fetchUsers();
  }, []);

  // ฟังก์ชัน Assign Role
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError('Please select a user and a role.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      console.log('Assigning role:', selectedRole);
      console.log('Selected user:', selectedUser);
      await axios.put(`/api/user/${selectedUser}`, {
        role: selectedRole,
      });
      if (session && session.userProfile) {
        session.userProfile.role = selectedRole;
      }
      alert('Role assigned successfully!');

      fetchUsers();
    } catch (err) {
      setError('Failed to assign role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Section */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold">Admin Role Assignment</h1>

          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Users</h2>

            {/* ส่วนแสดงรายชื่อผู้ใช้ในระบบ */}
            <div className="space-y-4">
              {users?.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <p className="font-semibold">
                      {user.firstnameTh} {user.firstnameTh}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Current Role: <span className="font-medium">{user.role}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(selectedUser === user.id ? '' : user.id)}
                    className={`rounded px-4 py-2 text-white ${
                      selectedUser === user.id ? 'bg-red-600' : 'bg-blue-400 hover:bg-blue-500'
                    }`}>
                    {selectedUser === user.id ? 'ยกเลิก' : 'เลือก'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="mb-4 text-lg font-bold">Assign Role</h2>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="mb-4 w-full rounded-lg border px-4 py-2">
                <option value="NOT_ASSIGNED">Select Role</option>
                <option value="STUDENT">นิสิต</option>
                <option value="DEPARTMENT_HEAD">หัวหน้าภาควิชา</option>
                <option value="FACULTY_STAFF">เจ้าหน้าที่คณะ</option>
                <option value="DEPUTY_DEAN">รองคณบดี</option>
                <option value="DEAN">คณบดี</option>
                <option value="SA_STAFF">SA Staff</option>

                <option value="COMMITTEE">คณะกรรมการ</option>
                <option value="CHAIRMAN">ประธานกรรมกาาร</option>
                <option value="FINANCIAL">พนักงานการเงิน</option>
              </select>

              <button
                onClick={handleAssignRole}
                className="w-full rounded-lg bg-green-500 px-4 py-2 text-white">
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
};

export default AdminPage;
