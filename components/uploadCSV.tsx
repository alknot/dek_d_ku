"use client";
import React, { useState } from "react";
import Papa from "papaparse";
import { apiService } from "@/common/apiService";

const CsvUploader = () => {
  const [academicYear, setAcademicYear] = useState<string>(""); 
  const [term, setTerm] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !academicYear || !term) {
      alert("กรุณากรอกปีการศึกษา ภาคการศึกษา และเลือกไฟล์");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        if (result.errors.length) {
          console.error("Error parsing CSV:", result.errors);
          alert("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV");
          return;
        }

        const parsedData = result.data as Record<string, string>[];
        console.log("Parsed data:", parsedData);
  

        await apiService.uploadTermPrice(parsedData, academicYear, term);
      },
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold">อัปโหลดไฟล์ CSV</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">ปีการศึกษา</label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="2568"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">ภาคการศึกษา</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">เลือกภาคการศึกษา</option>
            <option value="เทอมต้น">เทอมต้น</option>
            <option value="เทอมปลาย">เทอมปลาย</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">เลือกไฟล์ CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          อัปโหลด
        </button>
      </form>
    </div>
  );
};

export default CsvUploader;
