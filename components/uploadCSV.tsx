"use client";
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const CsvUploader = () => {
  const [academicYear, setAcademicYear] = useState("");
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

    // อ่านและ parse ไฟล์ CSV
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
        // เพิ่ม academicYear และ term ให้กับทุกแถวของข้อมูล
        const dataWithMetadata = parsedData.map((row) => ({
          ...row,
          academicYear,
          term,
        }));

        const mappedData = dataWithMetadata.map((row: any) => ({
            
            academicYear: academicYear,
            term: term,
            department: row["คณะ"],
            // faculty: row["คณะ"],
            price1: parseFloat(row["ค่าธรรมเนียมคณะ"]),
            price2: parseFloat(row["ค่าบำรุงมหาวิทยาลัย"]),
            price3: parseFloat(row["ค่าหน่วยกิต"]),
            programType: row["โปรแกรมการเรียน"],
            study: row["รูปแบบภาคการเรียน"],
            sumPrice: parseFloat(row["รวม"]),
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          console.log("mappedData:", mappedData);

        try {
          // ส่งข้อมูลไปยัง API
          await axios.post("/api/termprice", { data: mappedData });
          alert("อัปโหลดข้อมูลสำเร็จ");
        } catch (error) {
          console.error("Error uploading data:", error);
          alert("เกิดข้อผิดพลาดในการอัปโหลดข้อมูล");
        }
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
            <option value="ต้น">ต้น</option>
            <option value="ปลาย">ปลาย</option>
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
