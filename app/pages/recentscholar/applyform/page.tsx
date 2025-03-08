'use client';

import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { ActivityHour, CompetitiveLevel, ExtracurricularType, SchType } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/compat/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import { programType } from "@prisma/client";
// import router from "next/dist/shared/lib/router/router";

const Create = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPdf(event.target.files[0]);
      setPdfMimeType(event.target.files[0].type);
      console.log(event.target.files[0].type);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(event.target.files[0]);
      setImageMimeType(event.target.files[0].type);
      console.log(event.target.files[0].type);
    }
  };

  const handleUploadPdf = async () => {
    if (!pdf) return;

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64File = await toBase64(pdf);

    const formData = new FormData();
    formData.append('pdf', base64File);
    formData.append('mimeType', pdfMimeType || '');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const URL = (await response.json()).url;
        setPdfUrl(URL);
        return URL;
      } else {
        setPdfUrl(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setPdfUrl(null);
    }
  };

  const handleUploadImage = async () => {
    if (!image) return;

    const toBase64 = (image: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64Image = await toBase64(image);

    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('mimeType', imageMimeType || '');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        const URL = (await response.json()).url;
        setImageUrl(URL);
        return URL;
      } else {
        setImageUrl(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setImageUrl(null);
    }
  };

  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfMimeType, setPdfMimeType] = useState<string | null>(null);
  const [image, setImages] = useState<File | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [nisitNameTh, setNisitNameTH] = useState<string>('');
  const [nisitNameEn, setNisitNameENG] = useState<string>('');
  const [nisitid, setNisitID] = useState<string>('');
  const [nisitAcademicyear, setNisitAcademicyear] = useState<string>('');
  const [age, setAge] = useState<number>();
  const [dateofBirth, setDateofBirth] = useState<Date | null>(null);
  const [awardDate, setAwardDate] = useState<Date | null>(null);
  const [faculty, setFaculty] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [advisor, setAdvisor] = useState<string>('');
  const [gpa, setGPA] = useState<number>();
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isLastTerm, setLastterm] = useState('');
  const [competitionName, setCompetitionName] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [innovationName, setInnovationName] = useState<string>('');
  const [organizer, setOrganizer] = useState<string>('');
  const [prizeName, setPrizeName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [numberOfTeam, setNumberOfTeam] = useState<number>();
  const [ExtracurricularType, setExtracurricularType] = useState<ExtracurricularType>();
  const [activityHour, setactivityHour] = useState<ActivityHour>();
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

  // <option value="SOCIAL">
  //   เป็นนิสิตที่ดำเนินกิจกรรมและต้องแสดงให้เห็นว่าเมื่อดำเนินกิจกรรมแล้ว ชาวบ้าน
  //   ชุมชนในท้องถิ่นหรือผู้เข้าร่วมกิจกรรมได้รับประโยชน์อย่างไรจากการดำเนินกิจกรรมก่อให้เกิดประโยชน์ต่อส่วนรวมและเป็นการสร้างเกียรติคุณต่อคณะหรือมหาวิทยาลัยหรือไม่
  // </option>;

  const router = useRouter();
  const { id, academiYear, term } = router?.query || {};
  console.log('id', id);
  const accept = '.pdf';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async () => {
    if (fileType === 'pdf') {
      const url = await handleUploadPdf();
      console.log(fileType);
      try {
        const data = {
          nisitNameTh,
          nisitNameEn,
          nisitid,
          nisitAcademicyear,
          age,
          dateofBirth,
          faculty,
          department,
          advisor,
          gpa,
          phone,
          email,
          address,
          isLastTerm,
          scholarshipId: id,
          competitionName,
          teamName,
          innovationName,
          prizeName,
          organizer,
          numberOfTeam,
          ExtracurricularType,
          activityHour,
          attachfile: url,
          // Include the id in the data
        };

        console.log(data); // ตรวจสอบข้อมูลก่อนส่ง

        // ส่งข้อมูลไปยัง API
        await axios.post('/api/request', data);
      } catch (error) {
        console.error(error);
      }
    } else if (fileType === 'image') {
      const url = await handleUploadImage();
      console.log(fileType);
      try {
        const data = {
          nisitNameTh,
          nisitNameEn,
          nisitid,
          nisitAcademicyear,
          age,
          dateofBirth,
          faculty,
          department,
          advisor,
          gpa,
          phone,
          email,
          address,
          isLastTerm,
          scholarshipId: id,
          competitionName,
          teamName,
          innovationName,
          prizeName,
          organizer,
          numberOfTeam,
          ExtracurricularType,
          activityHour,
          attachfile: url,
          // Include the id in the data
        };

        console.log(data); // ตรวจสอบข้อมูลก่อนส่ง

        // ส่งข้อมูลไปยัง API
        await axios.post('/api/request', data);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const data = {
          nisitNameTh,
          nisitNameEn,
          nisitid,
          nisitAcademicyear,
          age,
          dateofBirth,
          faculty,
          department,
          advisor,
          gpa,
          phone,
          email,
          address,
          isLastTerm,
          scholarshipId: id,
          competitionName,
          teamName,
          innovationName,
          prizeName,
          organizer,
          numberOfTeam,
          ExtracurricularType,
          activityHour,

          // Include the id in the data
        };

        console.log(data); // ตรวจสอบข้อมูลก่อนส่ง

        // ส่งข้อมูลไปยัง API
        await axios.post('/api/request', data);
      } catch (error) {
        console.error(error);
      }
    }
  };

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

          <form>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาไทย)
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อผู้สมัคร (ภาษาไทย)"
                  value={nisitNameTh}
                  onChange={(e) => setNisitNameTH(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่อผู้สมัคร (ภาษาอังกฤษ)
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่อผู้สมัคร (ภาษาอังกฤษ)"
                  value={nisitNameEn}
                  onChange={(e) => setNisitNameENG(e.target.value)}
                  required
                />
              </div>

              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    นิสิตชั้นปีที่
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="นิสิตชั้นปีที่"
                    value={nisitAcademicyear}
                    onChange={(e) => setNisitAcademicyear(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    รหัสนิสิต
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="รหัสนิสิต"
                    value={nisitid}
                    onChange={(e) => setNisitID(e.target.value)}
                    required
                  />
                </div>

                <div className="flex space-x-10 sm:col-span-2">
                  <div className="relative max-w-sm">
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      เกิดวันที่
                    </label>
                    <DatePicker
                      selected={dateofBirth}
                      onChange={(date) => setDateofBirth(date)}
                      placeholderText="เกิดวันที่"
                      dateFormat="dd/MM/yyyy"
                      className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="relative max-w-sm">
                    <label
                      htmlFor="schName"
                      className="mb-2 block text-sm font-medium text-gray-900">
                      อายุ
                    </label>
                    <input
                      type="text"
                      id="schName"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="อายุ (ปี)"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-10 sm:col-span-2">
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    คณะ
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="คณะ"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    ภาควิชา/สาขาวิชา
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="ภาควิชา/สาขาวิชา"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    คะแนนเฉลี่ยสะสม
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="คะแนนเฉลี่ยสะสม"
                    value={gpa}
                    onChange={(e) => setGPA(Number(e.target.value))}
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
                    className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={isLastTerm}
                    onChange={(e) => setLastterm(e.target.value)}
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
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="โทรศัพท์"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="relative max-w-sm">
                  <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                    E-mail
                  </label>
                  <input
                    type="text"
                    id="schName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ชื่ออาจารยืที่ปรึกษา
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ชื่ออาจารย์ที่ปรึกษา"
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="schName" className="mb-2 block text-sm font-medium text-gray-900">
                  ที่อยู่ปัจจุบัน
                </label>
                <input
                  type="text"
                  id="schName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ที่อยู่ปัจจุบัน"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  ประเภทการสมัคร
                </label>
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
                          setExtracurricularType(opt.value as ExtracurricularType);
                        }}
                        className="w-full cursor-pointer px-4 py-2 hover:bg-gray-100">
                        <p>{opt.label.split(': ')[0]}</p>
                        <p className="text-sm text-gray-600">{opt.label.split(': ')[1]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(ExtracurricularType === 'UNIVERSITY_COMPETITION' ||
                ExtracurricularType === 'NATIONAL_COMPETITION' ||
                ExtracurricularType === 'INTERNATIONAL_COMPETITION') && (
                <div className="sm:col-span-2">
                  <div className="sm:col-span-2">
                    <div className="relative max-w-sm">
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        เลือกประเภทไฟล์
                      </label>
                      <select
                        className="block rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        required>
                        <option value="">กรุณาเลือก</option>
                        <option value="pdf">file .pdf</option>
                        <option value="image">file image</option>
                      </select>
                    </div>
                    {fileType === 'pdf' && (
                      <div className="sm:col-span-2">
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
                        {pdfUrl && (
                          <a
                            href={pdfUrl}
                            className="mt-4 text-green-500"
                            target="_blank"
                            rel="noopener noreferrer">
                            {pdfUrl}
                          </a>
                        )}
                      </div>
                    )}
                    {fileType === 'image' && (
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                          แนบผลงาน(ใบประกาศ) หรือเอกสารอ้างอิงที่บ่งบอกถึงการได้รับรางวัล
                        </label>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="mb-4 w-full rounded-md border px-3 py-2"
                        />
                        {imageUrl && (
                          <a
                            href={imageUrl}
                            className="mt-4 text-green-500"
                            target="_blank"
                            rel="noopener noreferrer">
                            {imageUrl}
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-10 sm:col-span-2">
                    <div className="relative max-w-sm">
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        วันที่ได้รับรางวัล
                      </label>
                      <DatePicker
                        selected={awardDate}
                        onChange={(date) => setAwardDate(date)}
                        placeholderText="วันที่ได้รับรางวัล"
                        dateFormat="dd/MM/yyyy"
                        className="focus:ring-primary-600 focus:border-primary-600 w-full rounded-lg border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="sm:grid-cols-1">
                    <label
                      htmlFor="schName"
                      className="mb-2 block text-sm font-medium text-gray-900">
                      ชื่อโครงการที่แข่งขัน/เข้าร่วม
                    </label>
                    <input
                      type="text"
                      id="schName"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ชื่อโครงการที่แข่งขัน/เข้าร่วม"
                      value={competitionName}
                      onChange={(e) => setCompetitionName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:grid-cols-1">
                    <label
                      htmlFor="schName"
                      className="mb-2 block text-sm font-medium text-gray-900">
                      ชื่อทีม
                    </label>
                    <input
                      type="text"
                      id="schName"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ชื่อทีม"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:grid-cols-1">
                    <label
                      htmlFor="schName"
                      className="mb-2 block text-sm font-medium text-gray-900">
                      ชื่อผลงานที่ได้รับรางวัล
                    </label>
                    <input
                      type="text"
                      id="schName"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ชื่อผลงานที่ได้รับรางวัล"
                      value={innovationName}
                      onChange={(e) => setInnovationName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:grid-cols-1">
                    <label
                      htmlFor="schName"
                      className="mb-2 block text-sm font-medium text-gray-900">
                      รางวัลที่ได้รับ
                    </label>
                    <input
                      type="text"
                      id="schName"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="รางวัลที่ได้รับ"
                      value={prizeName}
                      onChange={(e) => setPrizeName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="sm:grid-cols-1">
                    <label
                      htmlFor="schName"
                      className="mb-2 block text-sm font-medium text-gray-900">
                      หน่วยงานที่จัดการแข่งขัน/โครงการ
                    </label>
                    <input
                      type="text"
                      id="schName"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="รางวัลที่ได้รับ"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-10 sm:col-span-2">
                    <div className="sm:grid-cols-1">
                      <label
                        htmlFor="schName"
                        className="mb-2 block text-sm font-medium text-gray-900">
                        จำนวนทีมที่เข้าร่วมในโครงการ/การแข่งขัน
                      </label>
                      <input
                        type="text"
                        id="schName"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="เช่น 5"
                        value={numberOfTeam}
                        onChange={(e) => setNumberOfTeam(Number(e.target.value))}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="programType"
                        className="mb-2 block text-sm font-medium text-gray-900">
                        ประเภทกิจกรรม
                      </label>
                      <select
                        className="bg-white-50 block rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        id="programType"
                        value={activityHour}
                        onChange={(e) => setactivityHour(e.target.value as ActivityHour)}
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
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white">
              สมัคร
            </button>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Create;
