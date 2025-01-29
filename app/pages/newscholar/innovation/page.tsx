"use client";
import axios from "axios";
import DatePicker from "react-datepicker";
import React, {ChangeEvent, useEffect,useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";


const Create = () => {
    const [schName, setschName] = useState("")
    const [description, setdescription] = useState<string>("")
    const [academiYear, setacademicYear] = useState<number | string>("")
    const [term, setterm] = useState<string>("")
    const [startDate, setstartDate] = useState<Date | null>(null)
    const [endDate, setendDate] = useState<Date | null>(null)
    const [schType, setschType] = useState([""])
    const [attachment, setattachment] = useState<string>("")
    const [programType, setprogramType] = useState([""])
    const study = 'ปกติ'
    const price1 = 1500
    const price2 = 500
    const price3 = 16000
    const sumPrice = 18000
    // const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // ทำการส่ง category
      await axios.post('/api/scholarship', { schName, description, academiYear, term, startDate, endDate, schType, attachment,programType,study,price1,price2,price3,sumPrice })
    //   router.push('/')
    } catch (error) {
      console.error(error)
    }
  }



    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        throw new Error("Function not implemented.");
    }

  return (
    <>
      <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">สร้างโครงการประพฤติดี</h2>
      <h1 className="mb-4 font-bold text-gray-900 text-center">กรอกข้อมูลของโครงการ</h1>
      <form>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
      <div>
            <label htmlFor="schName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อโครงการ</label>
            <input type="text" id="schName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อโครงการ" 
            value={schName} onChange={(e) => setschName(e.target.value)} required />
          
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-900">ประกาศโครงการ (PDF)</label>
          <input
            type="text"
            // accept="application/pdf"
            value={attachment}
            onChange={(e) => setattachment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            required
          />
          
        </div>
        {/* <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">รางวัลในแต่ละโครงการ</label>
            <div className="flex flex-col space-y-2">
              {["ลดค่าบำรุงมหาวิทยาลัย", "ลดค่าหน่วยกิต", "ลดค่าธรรมเนียมพิเศษคณะ", "อื่นๆ"].map((reward) => (
                <label key={reward} className="flex items-center">
                  <input
                    type="checkbox"
                    name="reward"
                    value={reward}
                    checked={projectData.rewards.includes(reward)}
                    onChange={() => handleRewardChange(reward)}
                    className="mr-2"
                  />
                  {reward}
                </label>
              ))}
              {projectData.rewards.includes("อื่นๆ") && (
                <InputField
                  label=""
                  type="text"
                  value={projectData.otherReward}
                  onChange={(e) => handleProjectChange("otherReward", e.target.value)}
                  placeholder="กรอกรางวัลอื่นๆ"
                />
              )}
            </div>
          </div> */}
        <div className="flex space-x-5">
          <div className="relative max-w-sm">
            <label className="block mb-2 text-sm font-medium text-gray-900">วันที่เริ่มโครงการ</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setstartDate(date)}
              placeholderText="Start date"
              dateFormat="dd/MM/yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            />
          </div>
          <div className="relative max-w-sm">
            <label className="block mb-2 text-sm font-medium text-gray-900">วันที่จบโครงการ</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setendDate(date)}
              placeholderText="End date"
              dateFormat="dd/MM/yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            />
          </div>
        </div>
        <div className="flex w-full px-3 py-0 space-x-3">
        
          <label className="block mb-2 text-sm font-medium text-gray-900">ปีการศึกษา</label>
          <input
            type="number"
            value={academiYear}
            onChange={(e) => setacademicYear(Number(e.target.value))}
            placeholder="2568"
            required
          />
          <label htmlFor="term" className="block mb-2 text-sm font-medium text-gray-900">ภาคการศึกษา</label>
          <select
            id="term"
            value={term}
            onChange={(e) => setterm(e.target.value)}
            required
          >
            <option value="เทอมต้น">เทอมต้น</option>
            <option value="เทอมปลาย">เทอมปลาย</option>
          </select>
          <label htmlFor="programType" className="block mb-2 text-sm font-medium text-gray-900">สำหรับหลักสูตร</label>
          <select
            id="programType"
            value={programType[0]}
            onChange={(e) => setprogramType([e.target.value])}
            required
          >
            <option value="ภาคไทย">ภาคไทย</option>
            <option value="ภาคนานาชาติ">ภาคนานาชาติ</option>
            <option value="ทั้งภาคไทยและนานาชาติ">ทั้งภาคไทยและนานาชาติ</option>
          </select>
          <label htmlFor="schType" className="block mb-2 text-sm font-medium text-gray-900">ประเภททุน</label>
          <select
            id="schType"
            value={schType[0]}
            onChange={(e) => setschType([e.target.value])}
            required
          >
            <option value="inno1">inno1</option>
            <option value="inno2">inno2</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-900">รายละเอียดโครงการ</label>
          <textarea
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
            placeholder="รายละเอียดโครงการ"
            rows={6}
            required
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        ไปหน้าถัดไป
      </button>
    </form>
    </>
  );
};

export default Create;