"use client";
import React, { useState } from "react";
import Papa from "papaparse";

// กำหนดประเภทข้อมูล CSV
type CSVRow = {
  Faculty: string;
  Department: string;
  AcademicYear: string;
  Term: string;
  ProgramType: string;
  Study: string;
  "ค่าบำรุงมหาวิทยาลัย": string;
  "ค่าหน่วยกิต": string;
  "ค่าธรรมเนียมพิเศษคณะ": string;
  "รวม": string;
};

const acceptableCSVFileTypes =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";

export default function TermPriceTable() {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ฟังก์ชันสำหรับอ่านไฟล์ CSV
  const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const csvFile = event.target.files?.[0];
    if (!csvFile) return;

    Papa.parse<CSVRow>(csvFile, {
        skipEmptyLines: true,
        header: true,
        complete: function (results) {
          console.log("Parsed Data:", results.data); // ตรวจสอบข้อมูล
          setCsvData(results.data); // กำหนดข้อมูลใน State
        },
        error: function (error) {
          console.error("Error parsing CSV:", error);
        },
      });
  };

  // ฟังก์ชันสำหรับบันทึกข้อมูลลง MongoDB
  const saveDataToMongoDB = async () => {
    if (!csvData.length) {
      alert("No data to save.");
      return;
    }

    setIsUploading(true);

    try {
      
      const response = await fetch("/api/termprice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: csvData }),
      });

      if (response.ok) {
        alert("Data saved successfully!");
        setCsvData([]); // ล้างข้อมูลหลังจากบันทึกสำเร็จ
      } else {
        const error = await response.json();
        alert(`Error saving data: ${error.message}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data.");
    } finally {
      setIsUploading(false);
    }
  };

  // ฟังก์ชันสำหรับล้างข้อมูล
  const clearData = () => {
    setCsvData([]);
  };

  return (
    <div className="py-8 space-y-7">
      <div className="flex items-center gap-8">
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            id="csvFileSelector"
            accept={acceptableCSVFileTypes}
            onChange={onFileChangeHandler}
          />
        </div>

        <div className="space-y-5 space-x-3">
          <button
            onClick={saveDataToMongoDB}
            className="py-2 px-6 rounded bg-purple-300 text-slate-900"
            disabled={isUploading}
          >
            {isUploading ? "Saving..." : "Save Data"}
          </button>
          <button onClick={clearData} className="py-2 px-6 rounded bg-red-300 text-slate-900">
            Clear Data
          </button>
        </div>
      </div>

      {/* แสดงข้อมูลจาก CSV */}
      {csvData.length > 0 && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 px-64">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Faculty</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Academic Year</th>
                <th className="px-6 py-3">Term</th>
                <th className="px-6 py-3">Program Type</th>
                <th className="px-6 py-3">Study</th>
                <th className="px-6 py-3">ค่าบำรุงมหาวิทยาลัย</th>
                <th className="px-6 py-3">ค่าหน่วยกิต</th>
                <th className="px-6 py-3">ค่าธรรมเนียมพิเศษคณะ</th>
                <th className="px-6 py-3">รวม</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-black-200 dark:border-black-700"
                >
                  <td className="px-6 py-4">{row.Faculty}</td>
                  <td className="px-6 py-4">{row.Department}</td>
                  <td className="px-6 py-4">{row.AcademicYear}</td>
                  <td className="px-6 py-4">{row.Term}</td>
                  <td className="px-6 py-4">{row.ProgramType}</td>
                  <td className="px-6 py-4">{row.Study}</td>
                  <td className="px-6 py-4">{row["ค่าบำรุงมหาวิทยาลัย"]}</td>
                  <td className="px-6 py-4">{row["ค่าหน่วยกิต"]}</td>
                  <td className="px-6 py-4">{row["ค่าธรรมเนียมพิเศษคณะ"]}</td>
                  <td className="px-6 py-4">{row["รวม"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
