'use client';

import Modal from '@/components/Modal';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  faculty?: string;
  department?: string;
}

interface Termprice {
  id: string;
  faculty: string;
  department: string;
  academicYear: string;
  term: string;
  programType: string;
  study: string;
  price1: number;
  price2: number;
  price3: number;
  sumPrice: number;
}

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const { data: session } = useSession();
  const router = useRouter();

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  // Search states
  const [searchEmail, setSearchEmail] = useState('');
  const [searchName, setSearchName] = useState('');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(users.length / pageSize);
  const displayedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Modal state and role selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('NOT_ASSIGNED');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ users: User[] }>('/api/user', {
        params: { email: searchEmail, name: searchName },
      });
      setUsers(response.data.users ?? []);
      // Reset page to 1 when searching
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    fetchUsers();
  };

  // Handle selecting/unselecting a user in the table
  const toggleSelectUser = (user: User) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  // Open modal to assign role (we use the selected user from the table)
  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Function to assign role
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError('Please select a user and a role.');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await axios.put(`/api/user/${selectedUser.id}`, {
        role: selectedRole,
        faculty: selectedFaculty,
        department: selectedDepartment,
      });
      alert('Role assigned successfully!');
      // Refresh the user list
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      setError('Failed to assign role.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination handler
  const goToPage = (page: number) => setCurrentPage(page);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      {/* Main Content */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="space-y-6 bg-gray-50 p-6">
          <h1 className="text-center text-2xl font-bold text-gray-800">Role Assignment</h1>
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {/* Search Bar */}
          <div className="space-y-4 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Search by Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              />
              <input
                type="text"
                placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleSearch}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-500">
                Search
              </button>
            </div>
          </div>
          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-center">#</th>
                  <th className="px-4 py-2 text-center">Email</th>
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Role</th>
                  <th className="px-4 py-2 text-center">Faculty</th>
                  <th className="px-4 py-2 text-center">Department</th>
                  <th className="px-4 py-2 text-center">จัดการสิทธิ</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user, index) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2 text-center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-2 text-center">{user.email}</td>
                    <td className="px-4 py-2 text-center">
                      {user.firstnameTh} {user.lastnameTh}
                    </td>
                    <td className="px-4 py-2 text-center">{user.role}</td>
                    <td className="px-4 py-2 text-center">{user.faculty || '-'}</td>
                    <td className="px-4 py-2 text-center">{user.department || '-'}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500">
                        ให้สิทธิ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`rounded-lg px-3 py-1 ${
                    page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Modal for Role Assignment */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedUser && (
          <div>
            <h2 className="mb-4 text-lg font-bold">Assign Role</h2>
            <p className="mb-2">
              {selectedUser.firstnameTh} {selectedUser.lastnameTh} ({selectedUser.email})
            </p>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="mb-4 w-full rounded-lg border px-4 py-2">
              <option value="">Select Role</option>
              <option value="NOT_ASSIGNED">ถอดถอนสิทธิ</option>
              <option value="STUDENT">นิสิต</option>
              <option value="DEPARTMENT_HEAD">หัวหน้าภาควิชา</option>
              <option value="FACULTY_STAFF">เจ้าหน้าที่คณะ</option>
              <option value="DEPUTY_DEAN">รองคณบดี</option>
              <option value="DEAN">คณบดี</option>
              <option value="SA_STAFF">SA Staff</option>
              <option value="COMMITTEE">คณะกรรมการ</option>
              <option value="CHAIRMAN">ประธานกรรมการ</option>
              <option value="FINANCIAL">พนักงานการเงิน</option>
            </select>

            <p className="mb-2">เลือกคณะ</p>
            <input
              type="text"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />

            {/* ส่วนของภาควิชา */}
            <p className="mb-2">เลือกภาควิชา</p>
            <input
              type="text"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />

            <button
              onClick={handleAssignRole}
              className="w-full rounded-lg bg-green-500 px-4 py-2 text-white">
              Assign Role
            </button>
          </div>
        )}
      </Modal>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminPage;
