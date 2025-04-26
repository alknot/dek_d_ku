'use client';

import { apiService } from '@/common/apiService';
import ChartDisplay from '@/components/chartDisplay';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartItem {
  project: string;
  count: number;
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [academicYear, setAcademicYear] = useState<number | string>('');
  const [term, setTerm] = useState<string>('');
  const [data, setData] = useState<ChartItem[]>([]);

  const fetchChart = async () => {
    if (!academicYear || !term) return;
    const res = await fetch(`/api/chart?academicYear=${academicYear}&term=${term}`);
    const json: ChartItem[] = await res.json();
    setData(json);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Section */}
      <main className="flex flex-1 flex-col items-center bg-gray-100 p-4">
        <div className="w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
          <header className="mb-6">
            <h2 className="text-center text-4xl font-bold text-gray-800">Dashboard</h2>
            <p className="mt-2 text-center text-lg text-gray-600">จำนวนผู้สมัครในแต่ละโครงการ</p>
          </header>

          {/* ฟอร์มกรอกปีการศึกษา + ภาคการศึกษา */}
          <div className="mb-6 flex justify-center space-x-4">
            <input
              type="number"
              placeholder="ปีการศึกษา (เช่น 2568)"
              className="w-48 rounded-lg border border-gray-300 p-2"
              value={academicYear}
              onChange={(e) => setAcademicYear(Number(e.target.value))}
            />
            <select
              className="rounded-lg border border-gray-300 p-2"
              value={term}
              onChange={(e) => setTerm(e.target.value)}>
              <option value="">เลือกภาคการศึกษา</option>
              <option value="เทอมต้น">เทอมต้น</option>
              <option value="เทอมปลาย">เทอมปลาย</option>
            </select>
            <button
              onClick={fetchChart}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500">
              ค้นหา
            </button>
          </div>

          {/* แสดงกราฟเมื่อ data มี */}
          {data.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="project"
                  label={{ value: 'โครงการ', position: 'insideBottom', offset: -10 }}
                />
                <YAxis label={{ value: 'จำนวนผู้สมัคร', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="count" name="จำนวนผู้สมัคร" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
