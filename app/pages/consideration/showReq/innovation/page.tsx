"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
    // เพิ่ม field อื่น ๆ ตามต้องการ
}

export default function FormDetailPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };


    const { id } = useParams(); // รับ id จาก URL เช่น /form/[id]
    const [formDetail, setFormDetail] = useState<FormType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        const fetchForm = async () => {
            try {
                const res = await fetch(`/api/request/`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch form, status: ${res.status}`);
                }
                const data = await res.json();
                setFormDetail(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchForm();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading form...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!formDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Form not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Header Section */}
            <Header toggleSidebar={toggleSidebar} />
            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        รายละเอียดแบบฟอร์มสมัครทุน
                    </h1>
                    <div className="space-y-4">
                        <p>
                            <strong>รหัสฟอร์ม:</strong> {formDetail.id}
                        </p>
                        <p>
                            <strong>ชื่อผู้สมัคร (ไทย):</strong> {formDetail.nisitNameTh}
                        </p>
                        <p>
                            <strong>ชื่อผู้สมัคร (อังกฤษ):</strong> {formDetail.nisitNameEn}
                        </p>
                        <p>
                            <strong>รหัสนิสิต:</strong> {formDetail.nisitid}
                        </p>
                        <p>
                            <strong>ปีการศึกษา:</strong> {formDetail.nisitAcademicyear}
                        </p>
                        <p>
                            <strong>คณะ:</strong> {formDetail.faculty}
                        </p>
                        <p>
                            <strong>ภาควิชา/สาขาวิชา:</strong> {formDetail.department}
                        </p>
                        <p>
                            <strong>อาจารย์ที่ปรึกษา:</strong> {formDetail.advisor}
                        </p>
                        <p>
                            <strong>เกรดเฉลี่ย:</strong> {formDetail.gpa}
                        </p>
                        <p>
                            <strong>วันเกิด:</strong>{" "}
                            {format(new Date(formDetail.dateofBirth), "dd MMMM yyyy", { locale: th })}
                        </p>
                        <p>
                            <strong>อายุ:</strong> {formDetail.age}
                        </p>
                        <p>
                            <strong>โทรศัพท์:</strong> {formDetail.phone}
                        </p>
                        <p>
                            <strong>E-mail:</strong> {formDetail.email}
                        </p>
                        <p>
                            <strong>ที่อยู่:</strong> {formDetail.address}
                        </p>
                        <p>
                            <strong>ภาคการศึกษานี้เป็นภาคสุดท้าย:</strong>{" "}
                            {formDetail.isLastTerm ? "ใช่" : "ไม่ใช่"}
                        </p>
                        <p>
                            <strong>สถานะการอนุมัติ:</strong> {formDetail.approveStatus}
                        </p>
                    </div>
                </div>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
}
