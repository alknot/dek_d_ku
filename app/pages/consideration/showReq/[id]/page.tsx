'use client';

import Modal from '@/components/Modal';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Scholarship {
  id: string;
  schName: string;
  schType: string;
  // ฟิลด์อื่นๆ ตามที่ API ส่งกลับ
}

interface FormType {
  id: string;
  scholarshipID: string;
  schType: string;
  approveStatus: string;
  nisitNameTh: string;
  nisitNameEn: string;
  nisitAcademicyear: string;
  nisitid: string;
  faculty: string;
  department: string;
  advisor: string;
  gpa: number;
  dateofBirth: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  isLastTerm: boolean;
  certificate?: string | null;
  activityImageUrl?: string | null;
  sumPrice: number;
  newSumPrice: number;
  comment: string;
  commentedBy: string;
  // สามารถเพิ่ม field อื่น ๆ ที่ต้องการแสดงได้
}

export default function CommitteeViewPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);

  const token = session?.account.access_token as string | undefined;
  // console.log('token:', token);

  // State สำหรับฟอร์มทั้งหมด
  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State สำหรับ search bar
  const [studentId, setStudentId] = useState('');
  const [academiYear, setAcademicYear] = useState('');
  const [term, setTerm] = useState('');
  const [nisitNameTH, setNisitNameTH] = useState('');
  const [programType, setProgramType] = useState('');
  const [schType, setSchType] = useState('');
  const [formType, setFormType] = useState('PENDING');
  const [faculty, setFacultyType] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // แสดง 10 แถวต่อหน้า

  const scholarshipID = useParams().id;

  const [schName, setSchName] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const initialYear = searchParams.get('academiYear') || '';
    const initialTerm = searchParams.get('term') || '';
    setAcademicYear(initialYear);
    setTerm(initialTerm);
  }, [searchParams]);
  // ดึงค่า query parameter เริ่มต้น (ถ้ามี)
  useEffect(() => {
    if (!scholarshipID) return;
    console.log('working009');
    // เรียก API เพื่อดึงข้อมูลทุน
    fetch(`/api/scholarship/${scholarshipID}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch scholarship details');
        }
        return res.json();
      })
      .then((data: Scholarship) => {
        setSchName(data.schName);
      })
      .catch((err) => console.error(err));
  }, [scholarshipID]);
  // ฟังก์ชันดึงข้อมูลฟอร์มจาก API

  const fetchForms = async () => {
    try {
      setLoading(true);
      const academicYearParam = searchParams.get('academicYear');
      // ตัวอย่างแปลง termParam
      const termParam = searchParams.get('term');

      const normalizedTerm =
        termParam === '1' ? 'เทอมต้น' : termParam === '2' ? 'เทอมปลาย' : termParam;
      // console.log('tokenBF', token);
      const response = await axios.get('/api/request', {
        headers: { Authorization: token },
        params: {
          scholarshipID: scholarshipID,
          academicYear: academiYear,
          term: normalizedTerm,
          studentId: studentId,
          nisitNameTH: nisitNameTH,
          faculty: faculty,

          // ...อาจส่ง param อื่น ๆ เช่น studentId, programType, schType
        },
      });
      console.log('response', response.data);
      if (formType == 'PENDING') {
        const data = response.data as { getByStatus: FormType[] };
        setForms(data.getByStatus);
      } else if (formType == 'NOT_PASS') {
        const data = response.data as { getRejected: FormType[] };
        setForms(data.getRejected);
      } else if (formType == 'PASS') {
        const data = response.data as { getPass: FormType[] };
        setForms(data.getPass);
      } else if (formType == 'ALL') {
        const data = response.data as { getByFaculty: FormType[] };
        setForms(data.getByFaculty);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลเมื่อ mount หรือเมื่อ param ต่าง ๆ เปลี่ยน
  useEffect(() => {
    if (!token) {
      return;
    }
    fetchForms();
    // รีเซ็ต currentPage เป็น 1 เมื่อเงื่อนไขค้นหาเปลี่ยน
    setCurrentPage(1);
  }, [academiYear, term, programType, schType, studentId, token]);

  // handleSearch สำหรับกดปุ่ม "ค้นหา"
  const handleSearch = () => {
    // อาจมีการ set state ของ filter ต่าง ๆ ก่อนเรียก fetchForms
    fetchForms();
    setCurrentPage(1);
  };

  const handleOpenModal = (form: FormType) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  // ปิด modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  // คำนวณ Pagination
  const totalPages = Math.ceil(forms.length / pageSize);
  const currentForms = forms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Render
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading forms...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <main className="mx-auto flex w-full flex-1 justify-center bg-gray-100">
        <div className="space-y-6 bg-gray-50 p-6">
          <h1 className="text-center text-2xl font-bold">พิจารณาผู้สมัครเข้าร่วมโครงการ</h1>
          <h2 className="text-center text-xl font-semibold">โครงการ{schName}</h2>
          <div className="mt-4 text-center">
            <p>
              ปีการศึกษา: <strong>{academiYear}</strong> ภาคการศึกษา:{' '}
              <strong>{term === '1' ? 'เทอมต้น' : 'เทอมปลาย'}</strong>
            </p>
          </div>

          {/* Search Bar */}
          <div className="space-y-4 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <input
                type="text"
                placeholder="รหัสนิสิต"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              />
              <input
                type="text"
                placeholder="ชื่อนิสิต"
                value={nisitNameTH}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
              />
              {(schType === 'INNOVATION' || schType === 'EXTRACURRICULAR') && (
                <>
                  <select
                    value={programType}
                    onChange={(e) => setProgramType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2">
                    <option value="">ประเภทย่อย</option>
                    <option value="THAI">การแข่งขันทางวิชาการ/ศิลปกรรม</option>
                    <option value="INTERNATIONAL">การดำรงตำแหน่ง</option>
                    <option value="BOTH">สร้างเกียรติคุณต่อคณะ/มหาลัย</option>
                  </select>

                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2">
                    <option value="">ระดับการแข่งขัน</option>
                    <option value="ระดับอุดมศึกษา">ระดับอุดมศึกษา</option>
                    <option value="ระดับชาติ">ระดับชาติ</option>
                    <option value="ระดับนานาชาติ">ระดับนานาชาติ</option>
                  </select>
                </>
              )}
              {/* <select
                value={faculty}
                onChange={(e) => setFacultyType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2">
                <option value="PENDING">รอการพิจารณา</option>
                <option value="PASS">ผ่านการพิจารณา</option>
                <option value="NOT_PASS">ไม่ผ่านการพิจารณา</option>
                <option value="ALL">ทั้งหมด</option>
              </select> */}
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2">
                <option value="PENDING">รอการพิจารณา</option>
                <option value="PASS">ผ่านการพิจารณา</option>
                <option value="NOT_PASS">ไม่ผ่านการพิจารณา</option>
                <option value="ALL">ทั้งหมด</option>
              </select>
            </div>

            <div className="text-center">
              <button
                onClick={handleSearch}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-500">
                ค้นหา
              </button>
            </div>
          </div>

          {forms.length === 0 ? (
            <p className="text-center">ยังไม่มีฟอร์มสมัครทุน</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">ที่</th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">รหัสนิสิต</th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">
                        ชื่อนิสิต (ไทย)
                      </th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">คณะ</th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">ภาควิชา</th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">
                        จำนวนเงินเต็มที่ควรเก็บได้
                      </th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">
                        จำนวนเงินที่ได้จริง
                      </th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">พิจารณาผล</th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">
                        สถานะการพิจารณาผล
                      </th>
                      <th className="px-6 py-3 text-center uppercase tracking-wider">comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentForms.map((form, index) => (
                      <tr key={form.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          {index + 1 + (currentPage - 1) * pageSize}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          {form.nisitid}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          {form.nisitNameTh}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          {form.faculty}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          {form.department}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          {form.sumPrice}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          {form.newSumPrice}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          <button
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                            onClick={() => {
                              if (form.schType === 'WELL_BEHAVIOR') {
                                router.push(`/pages/showrequest/wellbehavior/${form.id}`);
                              } else if (form.schType === 'INNOVATION') {
                                router.push(`/pages/showrequest/innovation/${form.id}`);
                              } else if (form.schType === 'EXTRACURRICULAR') {
                                router.push(`/pages/showrequest/extracurricular/${form.id}`);
                              } else {
                                // fallback หรือกรณีอื่น ๆ ตามต้องการ
                                console.log('Unrecognized schType:', form.schType);
                              }
                            }}>
                            พิจารณาผล
                          </button>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          <ApproveStatusButton form={form} />
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                          <button
                            className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-500"
                            onClick={() => handleOpenModal(form)}>
                            comment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Numeric Pagination */}
              <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded px-4 py-2 ${
                      page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                    }`}>
                    {page}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedForm && (
          <div>
            <h2 className="mb-4 text-xl font-bold">ความคิดเห็น</h2>

            <p>
              <strong>ความคิดเห็น</strong>
            </p>
            <textarea className="w-full border p-2" value={selectedForm.comment} readOnly />
            <p>
              <strong>ผู้ให้ความเห็น</strong>
            </p>
            <input
              type="text"
              className="w-full border p-2"
              value={selectedForm.commentedBy}
              readOnly
            />
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

function ApproveStatusButton({ form }: { form: FormType }) {
  const { data: session } = useSession();

  const token = session?.account.access_token;
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmCancellation = async () => {
    console.log('Confirmed cancellation for', form.id);
    setShowConfirm(false);
    const res = await fetch(`/api/request/cancleConsideration/${form.id}`, {
      method: 'PUT',
      headers: token ? { Authorization: token } : {},
      body: JSON.stringify({
        approveStatus: form.approveStatus,
      }),
    });
    console.log('res', res);
    router.refresh();
  };

  const handleCancelConfirmation = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        className="min-w-[230px] rounded-lg bg-gray-600 px-6 py-2 text-white transition-all duration-200 hover:bg-red-500 focus:outline-none"
        onClick={() => setShowConfirm(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {isHovered ? 'ยกเลิกการพิจารณา' : form.approveStatus}
      </button>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-center text-xl font-bold">ยืนยันการยกเลิกการพิจารณา</h2>
            <p className="mb-4 text-center">คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการพิจารณานี้?</p>
            <div className="flex justify-around">
              <button
                className="min-w-[100px] rounded-lg bg-blue-500 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-400"
                onClick={handleConfirmCancellation}>
                ยืนยัน
              </button>
              <button
                className="min-w-[100px] rounded-lg bg-gray-500 px-4 py-2 text-white transition-all duration-200 hover:bg-red-400"
                onClick={handleCancelConfirmation}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
