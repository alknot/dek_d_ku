// "use client";

// import { useState } from "react";
// import Sidebar from "@/components/sidebar";
// import Header from "@/components/header";
// import Footer from "@/components/footer";
// import { useSession } from "next-auth/react";
// import SessionProvider from "@/components/sessionProvider";

// export default function Home() {
//   const { data: session, status } = useSession();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // ตรวจสอบสถานะ session หากยังโหลดอยู่ให้แสดง Loading...
//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }

//   // สมมุติว่า user info อยู่ใน session.user
//   const userInfo = session?.user;

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Sidebar */}
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

//       {/* Header Section */}
//       <Header toggleSidebar={toggleSidebar} />

//       {/* Main Section (User Info Section) */}
//       <main className="flex-1 flex items-center justify-center bg-gray-100">
//         <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">User Information</h2>
//           {userInfo ? (
//             <>
//               <div className="mb-4">
//                 <p className="text-lg font-semibold text-gray-600">ชื่อ: {userInfo.name}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="text-lg font-semibold text-gray-600">Email: {userInfo.email}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="text-lg font-semibold text-gray-600">คณะ: {userInfo.faculty || "N/A"}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="text-lg font-semibold text-gray-600">ภาควิชา: {userInfo.department || "N/A"}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="text-lg font-semibold text-gray-600">Role: {userInfo.role || "N/A"}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="text-lg font-semibold text-gray-600">Signature:</p>
//                 {/* เพิ่มรายละเอียดเพิ่มเติมหรือ component สำหรับลายเซ็นต์ที่นี่ */}
//               </div>
//             </>
//           ) : (
//             <p className="text-gray-600">ไม่มีข้อมูลผู้ใช้</p>
//           )}
//         </div>
//       </main>

//       {/* Footer Section */}
//       <footer className="bg-gray-800 text-white py-6">
//         <div className="container mx-auto text-center">
//           <p>&copy; นายกุลชัย</p>
//         </div>
//       </footer>
//     </div>
//   );
// }
