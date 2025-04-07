'use client';

import { apiService } from '@/common/apiService';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { log } from 'console';
import { differenceInYears } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type QuestionType = 'text' | 'choice' | 'checkbox' | 'date';

interface DynamicQuestionResponse {
  id: number;
  question: string;
  type: QuestionType;
  options: string[];
  required: boolean;
  answer: string;
  selectedDate?: Date | null;
}

interface StaticData {
  nisitNameTh: string;
  nisitNameEn: string;
  createdBy: string;
  nisitAcademicyear: string;
  nisitid: string;
  faculty: string;
  department: string;
  advisor: string;
  gpa: string;
  dateofBirth: Date | null;
  age: string;
  phone: string;
  email: string;
  address: string;
  isLastTerm: boolean;
  wellBehavior: {
    beahavior_detail: string;
  };

  universityPrice: number;
  facultyPrice: number;
  creditPrice: number;
  sumPrice: number;

  newuniversityPrice: number;
  newfacultyPrice: number;
  newcreditPrice: number;
  newsumPrice: number;

  academicYear: string;
  term: string;

  programType: string;
  study: string;
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

export default function ApplyScholarshipPage() {
  const { data: session } = useSession();
  // State สำหรับ static data ของฟอร์ม
  const [staticData, setStaticData] = useState<StaticData>({
    nisitNameTh: '',
    nisitNameEn: '',
    nisitAcademicyear: '',
    createdBy: '',
    nisitid: '',
    faculty: '',
    department: '',
    advisor: '',
    gpa: '',
    dateofBirth: null,
    age: '',
    phone: '',
    email: '',
    address: '',
    wellBehavior: {
      beahavior_detail: '',
    },
    isLastTerm: false,
    academicYear: '',
    term: '',
    programType: '',
    study: '',
    universityPrice: 0,
    facultyPrice: 0,
    creditPrice: 0,
    sumPrice: 0,
    newuniversityPrice: 0,
    newfacultyPrice: 0,
    newcreditPrice: 0,
    newsumPrice: 0,
  });

  // Dynamic question responses state
  const [dynamicResponses, setDynamicResponses] = useState<DynamicQuestionResponse[]>([]);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // สมมติว่า scholarship id อยู่ใน URL เช่น /apply/[id]
  const scholarshipId = params.id; // id: string
  // ดึง query parameters
  const academicYearParam = searchParams.get('academiYear') || '';
  const termParam = searchParams.get('term') || '';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // State สำหรับข้อมูล termprice ที่ได้จาก API
  const [data, setData] = useState<Termprice[]>([]);
  // State สำหรับ selected termprice จากการ filter
  const [selectedTermPrice, setSelectedTermPrice] = useState<Termprice | null>(null);

  // State สำหรับ cascading dropdown options
  const [programTypeOptions, setProgramTypeOptions] = useState<string[]>([]);
  const [studyOptions, setStudyOptions] = useState<string[]>([]);
  const [facultyOptions, setFacultyOptions] = useState<string[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);

  // โหลด dynamic question template จาก Scholarship record (ถ้ามี)
  useEffect(() => {
    if (!scholarshipId) return;
    fetch(`/api/scholarship/${scholarshipId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch scholarship');
        return res.json();
      })
      .then((data) => {
        if (data && data.dynamicQuestions) {
          const loaded = data.dynamicQuestions.map((dq: any, index: number) => ({
            id: Date.now() + index,
            question: dq.question,
            type: dq.type.toLowerCase(),
            options: dq.options,
            required: dq.required,
            answer: '',
            selectedDate: null,
          }));
          setDynamicResponses(loaded);
        }
      })
      .catch((err) => console.error(err));
  }, [scholarshipId]);

  // จัดการ static field
  const handleStaticChange = <K extends keyof StaticData>(field: K, value: StaticData[K]) => {
    setStaticData((prev) => ({ ...prev, [field]: value }));
  };

  // ดึงข้อมูล termprice จาก API เมื่อ academicYearParam และ termParam เปลี่ยนแปลง
  useEffect(() => {
    if (!academicYearParam || !termParam) return;
    const normalizedTerm =
      termParam === '1' ? 'เทอมต้น' : termParam === '2' ? 'เทอมปลาย' : termParam;
    const fetchTermPriceOptions = async () => {
      try {
        const response = await apiService.fetchData(academicYearParam.toString(), normalizedTerm);
        const result = response as Termprice[];
        setData(result);
        // ตัวเลือกสำหรับหลักสูตร
        const uniqueProgramTypes = Array.from(new Set(result.map((item) => item.programType)));
        setProgramTypeOptions(uniqueProgramTypes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTermPriceOptions();
  }, [academicYearParam, termParam]);

  // เมื่อเลือกหลักสูตร ให้ filter หา studyOptions
  useEffect(() => {
    if (!staticData.programType) {
      setStudyOptions([]);
      return;
    }
    const filtered = data.filter((item) => item.programType === staticData.programType);
    const uniqueStudies = Array.from(new Set(filtered.map((item) => item.study)));
    setStudyOptions(uniqueStudies);
    // Reset ค่าที่เกี่ยวข้อง
    handleStaticChange('study', '');
    handleStaticChange('faculty', '');
    handleStaticChange('department', '');
  }, [staticData.programType, data]);

  // เมื่อเลือก study ให้ filter หา facultyOptions
  useEffect(() => {
    if (!staticData.study) {
      setFacultyOptions([]);
      return;
    }
    const filtered = data.filter(
      (item) => item.programType === staticData.programType && item.study === staticData.study
    );
    const uniqueFaculties = Array.from(new Set(filtered.map((item) => item.faculty)));
    setFacultyOptions(uniqueFaculties);
    handleStaticChange('faculty', '');
    handleStaticChange('department', '');
  }, [staticData.study, staticData.programType, data]);

  // เมื่อเลือก faculty ให้ filter หา departmentOptions
  useEffect(() => {
    if (!staticData.faculty) {
      setDepartmentOptions([]);
      return;
    }
    const filtered = data.filter(
      (item) =>
        item.programType === staticData.programType &&
        item.study === staticData.study &&
        item.faculty === staticData.faculty
    );
    const uniqueDepartments = Array.from(new Set(filtered.map((item) => item.department)));
    setDepartmentOptions(uniqueDepartments);
    handleStaticChange('department', '');
  }, [staticData.faculty, staticData.study, staticData.programType, data]);

  // เมื่อ staticData.programType, study, faculty, department เปลี่ยน ให้ filter หา selectedTermPrice
  useEffect(() => {
    if (
      !staticData.programType ||
      !staticData.study ||
      !staticData.faculty ||
      !staticData.department ||
      data.length === 0
    ) {
      setSelectedTermPrice(null);
      return;
    }
    const filtered = data.filter(
      (item) =>
        item.programType === staticData.programType &&
        item.study === staticData.study &&
        item.faculty === staticData.faculty &&
        item.department === staticData.department
    );
    if (filtered.length > 0) {
      setSelectedTermPrice(filtered[0]);
    } else {
      setSelectedTermPrice(null);
    }
  }, [staticData.programType, staticData.study, staticData.faculty, staticData.department, data]);

  useEffect(() => {
    if (staticData.nisitid.length >= 2) {
      // ดึง 2 หลักแรกจากรหัสนิสิต เช่น "64"
      const entryDigits = staticData.nisitid.slice(0, 2);
      // สมมติว่าให้ปีเข้ามหาวิทยาลัย = 2500 + ตัวเลขที่ได้ (เช่น 64 -> 2564)
      const entryYear = parseInt(entryDigits, 10) + 2500;
      // คำนวณปีปัจจุบันในรูปแบบ พ.ศ. โดยบวก 543 กับปี ค.ศ.
      const currentYearBE = new Date().getFullYear() + 543;
      // คำนวณปีที่นิสิตศึกษาอยู่: (ปีปัจจุบัน - ปีเข้ามหาวิทยาลัย) + 1
      const studyYear = Number(academicYearParam) - entryYear + 1;
      // อัปเดต staticData.nisitAcademicyear ให้เป็นค่า studyYear (ในรูปแบบ string)
      handleStaticChange('nisitAcademicyear', studyYear.toString());
    }
  }, [staticData.nisitid]);

  // console.log('user', session?.userProfile?.email);
  // console.log('user', session?.userProfile?.id);
  // จัดการ dynamic question response
  const updateDynamicResponse = (id: number, field: keyof DynamicQuestionResponse, value: any) => {
    setDynamicResponses((prev) =>
      prev.map((resp) => (resp.id === id ? { ...resp, [field]: value } : resp))
    );
  };
  const normalizedProgramType =
    staticData.programType === 'ไทย'
      ? 'THAI'
      : staticData.programType === 'นานาชาติ'
        ? 'INTERNATIONAL'
        : staticData.programType;

  // ส่งข้อมูล Form ไปยัง API (POST /api/request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipId) {
      alert('Scholarship ID not found');
      return;
    }
    let newuniversityPrice = 0;
    let newfacultyPrice = 0;
    let newcreditPrice = 0;
    let newsumPrice = 0;

    if (staticData.isLastTerm === false) {
      newuniversityPrice = 0;
      console.log('selectedTermPrice:', selectedTermPrice ? selectedTermPrice.price2 : 'N/A');
      newfacultyPrice = selectedTermPrice ? selectedTermPrice.price2 : 0;
      newcreditPrice = 0;
      newsumPrice = selectedTermPrice ? selectedTermPrice.price2 : 0;

      console.log('newuniversityPrice0:', newuniversityPrice);
      console.log('newfacultyPrice0:', newfacultyPrice);
      console.log('newcreditPrice0:', newcreditPrice);
      console.log('newsumPrice0:', newsumPrice);
    } else {
      newuniversityPrice = 0;
      newfacultyPrice = 0;
      newcreditPrice = 0;
      newsumPrice = 0;
    }
    staticData.programType = normalizedProgramType;
    const createdBy = session?.userProfile?.id || '';
    console.log('newuniversityPrice:', newuniversityPrice);
    console.log('newfacultyPrice:', newfacultyPrice);
    console.log('newcreditPrice:', newcreditPrice);
    console.log('newsumPrice:', newsumPrice);
    const payload = {
      scholarshipID: scholarshipId,

      ...staticData,
      schType: 'WELL_BEHAVIOR',
      dateofBirth: staticData.dateofBirth ? staticData.dateofBirth.toISOString() : null,
      academicYear: academicYearParam,
      term: termParam,
      createdBy: session?.userProfile?.id,

      universityPrice: staticData.isLastTerm ? 0 : selectedTermPrice ? selectedTermPrice.price1 : 0,
      facultyPrice: staticData.isLastTerm ? 0 : selectedTermPrice ? selectedTermPrice.price2 : 0,
      creditPrice: staticData.isLastTerm ? 0 : selectedTermPrice ? selectedTermPrice.price3 : 0,
      sumPrice: staticData.isLastTerm ? 0 : selectedTermPrice ? selectedTermPrice.sumPrice : 0,

      newuniversityPrice: newuniversityPrice,
      newfacultyPrice: newfacultyPrice,
      newcreditPrice: newcreditPrice,
      newsumPrice: newsumPrice,
      dynamicQuestions: dynamicResponses.map((resp) => ({
        question: resp.question,
        type:
          resp.type === 'text'
            ? 'TEXT'
            : resp.type === 'choice'
              ? 'CHOICE'
              : resp.type === 'checkbox'
                ? 'CHECKBOX'
                : 'DATE',
        options: resp.options,
        required: resp.required,
        answer: resp.answer,
        selectedDate: resp.selectedDate ? resp.selectedDate.toISOString() : undefined,
      })),
    };

    try {
      console.log('Sending payload:', payload);
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('ส่งฟอร์มสมัครทุนสำเร็จ!');
        router.push('/pages/recentscholar'); // เปลี่ยน path ตามที่ต้องการ
      } else {
        alert('เกิดข้อผิดพลาดในการส่งฟอร์ม');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-center text-xl font-bold">กรอกฟอร์มสมัครทุนประพฤติดี</h1>
          <form onSubmit={handleSubmit}>
            {/* Static Fields */}
            <section className="mb-8">
              <h2 className="mb-2 text-lg font-semibold">ข้อมูลนิสิต</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">ชื่อนิสิต (ไทย)</label>
                  <input
                    type="text"
                    value={staticData.nisitNameTh}
                    onChange={(e) => handleStaticChange('nisitNameTh', e.target.value)}
                    className="w-full border p-2"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">ชื่อนิสิต (อังกฤษ)</label>
                  <input
                    type="text"
                    value={staticData.nisitNameEn}
                    onChange={(e) => handleStaticChange('nisitNameEn', e.target.value)}
                    className="w-full border p-2"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium">นิสิตชั้นปีที่</label>
                  <input
                    type="text"
                    value={staticData.nisitAcademicyear}
                    onChange={(e) => handleStaticChange('nisitAcademicyear', e.target.value)}
                    className="w-full border p-2"
                    required
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium">รหัสนิสิต</label>
                  <input
                    type="text"
                    value={staticData.nisitid}
                    onChange={(e) => {
                      // กรองเอาเฉพาะตัวเลขออกมา
                      const value = e.target.value.replace(/\D/g, '');
                      // ตรวจสอบว่าไม่เกิน 10 ตัวอักษร
                      if (value.length <= 10) {
                        handleStaticChange('nisitid', value);
                      }
                    }}
                    maxLength={10} // จำกัดไม่ให้เกิน 10 ตัว
                    pattern="^\d{10}$" // ตรวจสอบว่าต้องเป็นตัวเลข 10 ตัวเมื่อตรวจสอบ validation
                    className="w-full border p-2"
                    required
                  />
                </div>
                {/* หลักสูตร */}
                <div>
                  <label className="block text-sm font-medium">หลักสูตรที่เปิดรับ</label>
                  <select
                    value={staticData.programType}
                    onChange={(e) => handleStaticChange('programType', e.target.value)}
                    className="w-full border p-2"
                    required>
                    <option value="">กรุณาเลือกหลักสูตร</option>
                    {programTypeOptions.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
                {/* ภาค */}
                <div>
                  <label className="block text-sm font-medium">ภาค</label>
                  <select
                    value={staticData.study}
                    onChange={(e) => handleStaticChange('study', e.target.value)}
                    className="w-full border p-2"
                    required>
                    <option value="">กรุณาเลือกภาค</option>
                    {studyOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                {/* คณะ */}
                <div>
                  <label className="block text-sm font-medium">คณะ</label>
                  <select
                    value={staticData.faculty}
                    onChange={(e) => handleStaticChange('faculty', e.target.value)}
                    className="w-full border p-2"
                    required>
                    <option value="">กรุณาเลือกคณะ</option>
                    {facultyOptions.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                  </select>
                </div>
                {/* ภาควิชา/สาขาวิชา */}
                <div>
                  <label className="block text-sm font-medium">ภาควิชา/สาขาวิชา</label>
                  <select
                    value={staticData.department}
                    onChange={(e) => handleStaticChange('department', e.target.value)}
                    className="w-full border p-2"
                    required>
                    <option value="">กรุณาเลือกภาควิชา</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                {/* อาจารย์ที่ปรึกษา */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">อาจารย์ที่ปรึกษา</label>
                  <input
                    type="text"
                    value={staticData.advisor}
                    onChange={(e) => handleStaticChange('advisor', e.target.value)}
                    className="w-full border p-2"
                    required
                  />
                </div>
                {/* เกรดเฉลี่ย, วันเกิด, อายุ */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">เกรดเฉลี่ย</label>
                    <input
                      type="text"
                      value={staticData.gpa}
                      onChange={(e) => handleStaticChange('gpa', e.target.value)}
                      className="w-full border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">วันเกิด</label>
                    <DatePicker
                      selected={staticData.dateofBirth}
                      onChange={(date) => {
                        // อัปเดตวันเกิดใน staticData
                        handleStaticChange('dateofBirth', date);
                        // ถ้ามีการเลือกวันเกิด ให้คำนวณอายุจากวันที่ปัจจุบัน
                        if (date) {
                          const calculatedAge = differenceInYears(new Date(), date);
                          // อัปเดตอายุใน staticData เป็น string (หรือคุณอาจแปลงเป็น number ตามที่ต้องการ)
                          handleStaticChange('age', calculatedAge.toString());
                        } else {
                          handleStaticChange('age', '');
                        }
                      }}
                      className="w-full border p-2"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
                {/* โทรศัพท์ */}
                <div>
                  <label className="block text-sm font-medium">โทรศัพท์</label>
                  <input
                    type="text"
                    value={staticData.phone}
                    onChange={(e) => handleStaticChange('phone', e.target.value)}
                    className="w-full border p-2"
                    required
                  />
                </div>
                {/* E-mail */}
                <div>
                  <label className="block text-sm font-medium">E-mail</label>
                  <input
                    type="email"
                    value={staticData.email}
                    onChange={(e) => handleStaticChange('email', e.target.value)}
                    className="w-full border p-2"
                    required
                  />
                </div>
                {/* ที่อยู่ */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">ที่อยู่</label>
                  <input
                    type="text"
                    value={staticData.address}
                    onChange={(e) => handleStaticChange('address', e.target.value)}
                    className="w-full border p-2"
                    required
                  />
                </div>
                {/* ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจบ */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">
                    ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจบ
                  </label>
                  <select
                    value={staticData.isLastTerm ? 'true' : 'false'}
                    onChange={(e) => handleStaticChange('isLastTerm', e.target.value === 'true')}
                    className="w-full border p-2"
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="true">ใช่</option>
                    <option value="false">ไม่ใช่</option>
                  </select>
                </div>
                {/* บรรยายความประพฤติดี */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">บรรยายความประพฤติดี</label>
                  <textarea
                    rows={6}
                    value={staticData.wellBehavior.beahavior_detail}
                    onChange={(e) =>
                      setStaticData((prev) => ({
                        ...prev,
                        wellBehavior: {
                          ...prev.wellBehavior,
                          beahavior_detail: e.target.value,
                        },
                      }))
                    }
                    className="w-full border p-2"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Dynamic Questions Section */}
            <section className="mb-8">
              <h2 className="mb-2 text-lg font-semibold">คำถามเพิ่มเติม </h2>
              {dynamicResponses.map((dr, idx) => (
                <div key={dr.id} className="mb-4 rounded border p-4">
                  <p className="font-bold">
                    Q{idx + 1}: {dr.question}
                  </p>
                  {dr.type === 'text' && (
                    <input
                      type="text"
                      value={dr.answer}
                      onChange={(e) => updateDynamicResponse(dr.id, 'answer', e.target.value)}
                      className="w-full border p-2"
                      placeholder="กรอกคำตอบ"
                      required={dr.required}
                    />
                  )}
                  {dr.type === 'choice' && (
                    <div>
                      {dr.options.map((opt, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`choice_${dr.id}`}
                            value={opt}
                            checked={dr.answer === opt}
                            onChange={() => updateDynamicResponse(dr.id, 'answer', opt)}
                          />
                          <label>{opt}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {dr.type === 'checkbox' && (
                    <div>
                      {dr.options.map((opt, i) => {
                        const selectedValues = dr.answer ? dr.answer.split(',') : [];
                        const isChecked = selectedValues.includes(opt);
                        const toggleCheckbox = () => {
                          let newArr = [...selectedValues];
                          if (isChecked) {
                            newArr = newArr.filter((v) => v !== opt);
                          } else {
                            newArr.push(opt);
                          }
                          updateDynamicResponse(dr.id, 'answer', newArr.join(','));
                        };
                        return (
                          <div key={i} className="flex items-center space-x-2">
                            <input type="checkbox" checked={isChecked} onChange={toggleCheckbox} />
                            <label>{opt}</label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {dr.type === 'date' && (
                    <DatePicker
                      selected={dr.selectedDate || null}
                      onChange={(date) => updateDynamicResponse(dr.id, 'selectedDate', date)}
                      className="w-full border p-2"
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                </div>
              ))}
            </section>

            <button type="submit" className="w-full rounded bg-blue-500 p-2 text-white">
              ส่งฟอร์มสมัครทุน
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
