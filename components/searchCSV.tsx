"use client";

import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface TermPrice {
  academicYear: number;
  term: string;
  price: number;
}

const SearchFinancePage = () => {
  const [data, setData] = useState<TermPrice[]>([]);
  const [filteredData, setFilteredData] = useState<TermPrice[]>([]);
  const [academicYear, setAcademicYear] = useState<number | string>("");
  const [term, setTerm] = useState<string>("");

  useEffect(() => {
    // Fetch and parse the CSV file
    fetch("/path/to/termprice.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<TermPrice>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data);
          },
        });
      });
  }, []);

  useEffect(() => {
    // Filter the data based on academicYear and term
    const filtered = data.filter(
      (item) =>
        (academicYear ? item.academicYear === Number(academicYear) : true) &&
        (term ? item.term === term : true)
    );
    setFilteredData(filtered);
  }, [academicYear, term, data]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold justify-center text-center mb-4">
          แสดงข้อมูลจากไฟล์ CSV
        </h2>

        <div className="flex space-x-10 sm:col-span-2 mb-4">
          <div className="relative max-w-sm">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              ปีการศึกษา
            </label>
            <input
              className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="number"
              value={academicYear}
              onChange={(e) => setAcademicYear(Number(e.target.value))}
              placeholder="2568"
            />
          </div>
          <div className="relative max-w-sm">
            <label
              htmlFor="term"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              ภาคการศึกษา
            </label>
            <select
              className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value="">เลือกภาคการศึกษา</option>
              <option value="เทอมต้น">เทอมต้น</option>
              <option value="เทอมปลาย">เทอมปลาย</option>
            </select>
          </div>
        </div>

        {/* <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ปีการศึกษา</th>
              <th className="py-2 px-4 border-b">ภาคการศึกษา</th>
              <th className="py-2 px-4 border-b">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{item.academicYear}</td>
                <td className="py-2 px-4 border-b">{item.term}</td>
                <td className="py-2 px-4 border-b">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default SearchFinancePage;