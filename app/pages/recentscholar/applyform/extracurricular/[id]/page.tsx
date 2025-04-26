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

  extracurricular: {
    extracurricularType: string;
    awardDate: Date | null;
    competitionName: string;
    teamName: string;
    innovationName: string;
    prizeName: string;
    organizer: string;
    competitiveLevel: string;
    numberOfTeam: string;
    activityHour: string;
    attachFile: string;
  };
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

    extracurricular: {
      extracurricularType: '',
      awardDate: null,
      competitionName: '',
      teamName: '',
      innovationName: '',
      prizeName: '',
      organizer: '',
      competitiveLevel: 'TERTIARY',
      numberOfTeam: '',
      activityHour: 'OTHER',
      attachFile: '',
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
  const academicYearParam = searchParams.get('academicYear') || '';
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
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfMimeType, setPdfMimeType] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const options = [
    { label: 'กรุณาเลือก', value: '' },
    {
      label:
        'เข้าร่วมการแข่งขันทางวิชาการหรือศิลปกรรม ระดับอุดมศึกษา และได้รับราลวัลใดรางวัลหนึ่งจากการแข่งขัน',
      value: 'UNIVERSITY_COMPETITION',
    },
    {
      label:
        'เข้าร่วมการแข่งขันทางวิชาการหรือศิลปกรรม ระดับชาติ และได้รับราลวัลใดรางวัลหนึ่งจากการแข่งขัน',
      value: 'NATIONAL_COMPETITION',
    },
    {
      label:
        'เข้าร่วมการแข่งขันทางวิชาการหรือศิลปกรรม ระดับนานาชาติ และได้รับราลวัลใดรางวัลหนึ่งจากการแข่งขัน',
      value: 'INTERNATIONAL_COMPETITION',
    },
    {
      label: 'ดำรงตำแหน่งนายกองค์การบริหาร องค์การนิสิต ประธานสภาผู้แทนนิสิตหรือนายกสโมสรนิสิต',
      value: 'POSITION',
    },
    {
      label:
        'เป็นนิสิตที่ดำเนินกิจกรรมและต้องแสดงให้เห็นว่าเมื่อดำเนินกิจกรรมแล้ว ชาวบ้าน ชุมชนในท้องถิ่นหรือผู้เข้าร่วมกิจกรรมได้รับประโยชน์อย่างไรจากการดำเนินกิจกรรมที่่ก่อให้เกิดประโยชน์ต่อส่วนรวมและเป็นการสร้างเกียรติคุณต่อคณะหรือมหาวิทยาลัยหรือไม่',
      value: 'SOCIAL',
    },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPdf(event.target.files[0]);
      setPdfMimeType(event.target.files[0].type);
    }
  };

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

  // ตัวอย่างการอัปโหลด PDF (ถ้าต้องการ)
  const handleUploadPdf = async (): Promise<string | null> => {
    if (!pdf) return null;

    // แปลงเป็น Base64
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64File = await toBase64(pdf);
      const formData = new FormData();
      formData.append('pdf', base64File);
      formData.append('mimeType', pdfMimeType || '');

      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setPdfUrl(url);
        return url;
      } else {
        setPdfUrl(null);
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setPdfUrl(null);
      return null;
    }
  };

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

    if (
      staticData.isLastTerm === false &&
      staticData.extracurricular.extracurricularType != 'POSITION' &&
      staticData.extracurricular.extracurricularType != 'SOCIAL' &&
      staticData.extracurricular.competitiveLevel == 'TERTIARY'
    ) {
      newuniversityPrice = selectedTermPrice ? selectedTermPrice.price1 : 0;
      newfacultyPrice = selectedTermPrice ? selectedTermPrice.price2 : 0;
      newcreditPrice = 0;
      newsumPrice = newuniversityPrice + newfacultyPrice;
    } else if (
      staticData.isLastTerm === false &&
      staticData.extracurricular.extracurricularType != 'POSITION' &&
      staticData.extracurricular.extracurricularType != 'SOCIAL' &&
      staticData.extracurricular.competitiveLevel == 'NATIONAL'
    ) {
      newuniversityPrice = 0;
      newfacultyPrice = selectedTermPrice ? selectedTermPrice.price2 : 0;
      newcreditPrice = 0;
      newsumPrice = newfacultyPrice;
    } else if (
      (staticData.isLastTerm === false &&
        staticData.extracurricular.extracurricularType == 'POSITION') ||
      staticData.extracurricular.extracurricularType == 'SOCIAL'
    ) {
      newuniversityPrice = selectedTermPrice ? selectedTermPrice.price1 : 0;
      newfacultyPrice = selectedTermPrice ? selectedTermPrice.price2 : 0;
      newcreditPrice = selectedTermPrice ? selectedTermPrice.price3 : 0;
      newsumPrice = newuniversityPrice + newfacultyPrice + newcreditPrice;
    } else {
      newuniversityPrice = 0;
      newfacultyPrice = 0;
      newcreditPrice = 0;
      newsumPrice = 0;
    }
    staticData.programType = normalizedProgramType;
    const createdBy = session?.userProfile?.id || '';
    console.log('pdfUrl', pdfUrl);
    console.log('staticData.innovation.attachFile', staticData.extracurricular.attachFile);

    // console.log('newuniversityPrice:', newuniversityPrice);
    // console.log('newfacultyPrice:', newfacultyPrice);
    // console.log('newcreditPrice:', newcreditPrice);
    // console.log('newsumPrice:', newsumPrice);

    try {
      const url = await handleUploadPdf();
      staticData.extracurricular.attachFile = url || '';

      const payload = {
        scholarshipID: scholarshipId,
        ...staticData,
        schType: 'EXTRACURRICULAR',
        dateofBirth: staticData.dateofBirth ? staticData.dateofBirth.toISOString() : null,

        academicYear: academicYearParam,
        term: termParam,
        createdBy: session?.userProfile?.id,
        universityPrice: staticData.isLastTerm
          ? 0
          : selectedTermPrice
            ? selectedTermPrice.price1
            : 0,
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

  function setExtracurricularType(value: string) {
    setStaticData((prev) => ({
      ...prev,
      extracurricular: {
        ...prev.extracurricular,
        extracurricularType: value,
      },
    }));
  }
  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Section (Full Screen) */}
      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            กรอกฟอร์มสมัครทุนกิจกรรมนอกหลักสูตร
          </h2>
          <h2 className="mb-2 text-lg font-semibold">ข้อมูลนิสิต</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาไทย)
                </label>
                <input
                  type="text"
                  value={staticData.nisitNameTh}
                  onChange={(e) => handleStaticChange('nisitNameTh', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อผู้สมัคร (ภาษาไทย)"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  value={staticData.nisitNameEn}
                  onChange={(e) => handleStaticChange('nisitNameEn', e.target.value)}
                  placeholder="ชื่อผู้สมัคร (ภาษาอังกฤษ)"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                {/* <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    นิสิตชั้นปีที่
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="นิสิตชั้นปีที่"
                    value={staticData.nisitAcademicyear}
                    onChange={(e) => handleStaticChange('nisitAcademicyear', e.target.value)}
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

              <div>
                <label className="block text-sm font-medium">หลักสูตรที่เปิดรับ</label>
                <select
                  value={staticData.programType}
                  onChange={(e) => handleStaticChange('programType', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required>
                  <option value="">กรุณาเลือกภาควิชา</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    เกรดเฉลี่ย
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="เกรดเฉลี่ย"
                    value={staticData.gpa}
                    onChange={(e) => handleStaticChange('gpa', e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label
                    htmlFor="programType"
                    className="mb-2 block text-sm font-medium text-gray-900">
                    ภาคการศึกษานี้เป็นภาคสุดท้ายก่อนจะจบ
                  </label>

                  <select
                    value={staticData.isLastTerm ? 'true' : 'false'}
                    onChange={(e) => handleStaticChange('isLastTerm', e.target.value === 'true')}
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required>
                    <option value="">กรุณาเลือก</option>
                    <option value="true">ใช่</option>
                    <option value="false">ไม่ใช่</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    โทรศัพท์
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="โทรศัพท์"
                    value={staticData.phone}
                    onChange={(e) => handleStaticChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    E-mail
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="E-mail"
                    value={staticData.email}
                    onChange={(e) => handleStaticChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่ออาจารย์ที่ปรึกษา
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่ออาจารย์ที่ปรึกษา"
                  value={staticData.advisor}
                  onChange={(e) => handleStaticChange('advisor', e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ที่อยู่ปัจจุบัน
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ที่อยู่ปัจจุบัน"
                  value={staticData.address}
                  onChange={(e) => handleStaticChange('address', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-4 sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-900">ประเภทการสมัคร</label>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full cursor-pointer border px-4 py-2">
                {selectedOption || 'Select an option'}
              </div>
              {isOpen && (
                <div className="mt-1 border">
                  {options.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        setSelectedOption(opt.label);
                        setIsOpen(false);
                        // อัปเดต staticData.extracurricular.extracurricularType ด้วยค่า opt.value
                        handleStaticChange('extracurricular', {
                          ...staticData.extracurricular,
                          extracurricularType: opt.value,
                        });
                      }}
                      className="w-full cursor-pointer px-4 py-2 hover:bg-gray-100">
                      <p>{opt.label.split(': ')[0]}</p>
                      <p className="text-sm text-gray-600">{opt.label.split(': ')[1]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* เงื่อนไข: ถ้าเลือกประเภทที่ไม่ใช่ POSITION และ SOCIAL ให้แสดงช่องข้อมูลเพิ่มเติม */}
            {staticData.extracurricular.extracurricularType !== 'POSITION' &&
              staticData.extracurricular.extracurricularType !== 'SOCIAL' &&
              staticData.extracurricular.extracurricularType !== '' && (
                <>
                  <div className="mb-4 sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      แนบผลงาน(ใบประกาศ) หรือเอกสารอ้างอิงที่บ่งบอกถึงการได้รับรางวัล
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4 flex space-x-10 sm:col-span-2">
                    <div className="relative max-w-sm">
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        วันที่ได้รับรางวัล
                      </label>
                      <DatePicker
                        selected={staticData.extracurricular.awardDate}
                        onChange={(date) =>
                          handleStaticChange('extracurricular', {
                            ...staticData.extracurricular,
                            awardDate: date,
                          })
                        }
                        placeholderText="วันที่ได้รับรางวัล"
                        dateFormat="dd/MM/yyyy"
                        className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="mb-4 sm:grid-cols-1">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      หน่วยงานที่จัดการแข่งขัน
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      value={staticData.extracurricular.organizer}
                      onChange={(e) =>
                        handleStaticChange('extracurricular', {
                          ...staticData.extracurricular,
                          organizer: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4 sm:grid-cols-1">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      ชื่อโครงการที่แข่งขัน/เข้าร่วม
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ชื่อโครงการที่แข่งขัน/เข้าร่วม"
                      value={staticData.extracurricular.competitionName}
                      onChange={(e) =>
                        handleStaticChange('extracurricular', {
                          ...staticData.extracurricular,
                          competitionName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4 sm:grid-cols-1">
                    <label className="mb-2 block text-sm font-medium text-gray-900">ชื่อทีม</label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ชื่อทีม"
                      value={staticData.extracurricular.teamName}
                      onChange={(e) =>
                        handleStaticChange('extracurricular', {
                          ...staticData.extracurricular,
                          teamName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4 sm:grid-cols-1">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      ชื่อผลงานที่ได้รับรางวัล
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ชื่อผลงานที่ได้รับรางวัล"
                      value={staticData.extracurricular.innovationName}
                      onChange={(e) =>
                        handleStaticChange('extracurricular', {
                          ...staticData.extracurricular,
                          innovationName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4 sm:grid-cols-1">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      รางวัลที่ได้รับ
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="รางวัลที่ได้รับ"
                      value={staticData.extracurricular.prizeName}
                      onChange={(e) =>
                        handleStaticChange('extracurricular', {
                          ...staticData.extracurricular,
                          prizeName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4 flex space-x-10 sm:col-span-2">
                    <div className="sm:grid-cols-1">
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        จำนวนทีมที่เข้าร่วมในโครงการ/การแข่งขัน
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="เช่น 5"
                        value={staticData.extracurricular.numberOfTeam}
                        onChange={(e) =>
                          handleStaticChange('extracurricular', {
                            ...staticData.extracurricular,
                            numberOfTeam: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="relative max-w-sm">
                      <label
                        htmlFor="term"
                        className="mb-2 block text-sm font-medium text-gray-900">
                        ระดับการประกวดการแข่งขัน/การเข้าร่วม
                      </label>
                      <select
                        className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        value={staticData.extracurricular.competitiveLevel}
                        onChange={(e) =>
                          handleStaticChange('extracurricular', {
                            ...staticData.extracurricular,
                            competitiveLevel: e.target.value,
                          })
                        }
                        required>
                        <option value="">กรุณาเลือก</option>
                        <option value="TERTIARY">ระดับอุดมศึกษา</option>
                        <option value="NATIONAL">ระดับชาติ</option>
                        <option value="INTERNATIONAL">ระดับนานาติ</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="programType"
                        className="mb-2 block text-sm font-medium text-gray-900">
                        ประเภทกิจกรรม
                      </label>
                      <select
                        className="bg-white-50 mb-2 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        id="programType"
                        value={staticData.extracurricular.activityHour}
                        onChange={(e) =>
                          handleStaticChange('extracurricular', {
                            ...staticData.extracurricular,
                            activityHour: e.target.value,
                          })
                        }
                        required>
                        <option value="">กรุณาเลือก</option>
                        <option value="OTHER">
                          ส่งเสริมคุณลักษณะบัณฑิตที่พึงประสงค์ที่กำหนดโดยสถาบัน
                        </option>
                        <option value="SPORT">กีฬาหรือส่งเสริมสุขภาพ</option>
                        <option value="ENVIRONMENT">บำเพ็ญประโยชน์หรือรักษาสิ่งแวดล้อม</option>
                        <option value="VIRTUE">เสริมสร้างคุณธรรมและจริยธรรม</option>
                        <option value="CULTURE">ส่งเสริมศิลปและวัฒนธรรม</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

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

            <button type="submit" className="mt-3 w-full rounded bg-blue-500 p-2 text-white">
              ส่งฟอร์มสมัครทุน
            </button>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
