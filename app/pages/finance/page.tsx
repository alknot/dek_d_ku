"use client";

import { useState } from "react";

export default function FinancePage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/termprice", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Term Prices</h1>

      <div className="mb-6">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Upload
        </button>
      </div>

      {data.length > 0 && (
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Faculty</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Academic Year</th>
              <th className="px-4 py-2">Term</th>
              <th className="px-4 py-2">Program Type</th>
              <th className="px-4 py-2">Study</th>
              <th className="px-4 py-2">Price 1</th>
              <th className="px-4 py-2">Price 2</th>
              <th className="px-4 py-2">Price 3</th>
              <th className="px-4 py-2">Sum Price</th>
            </tr>
          </thead>
          <tbody>
            {/* {data.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{row.faculty}</td>
                <td className="px-4 py-2">{row.department}</td>
                <td className="px-4 py-2">{row.academicYear}</td>
                <td className="px-4 py-2">{row.term}</td>
                <td className="px-4 py-2">{row.programType}</td>
                <td className="px-4 py-2">{row.study}</td>
                <td className="px-4 py-2">{row.price1}</td>
                <td className="px-4 py-2">{row.price2}</td>
                <td className="px-4 py-2">{row.price3}</td>
                <td className="px-4 py-2">{row.sumPrice}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      )}
    </div>
  );
}
